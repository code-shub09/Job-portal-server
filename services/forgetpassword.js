
const nodemailer = require("nodemailer");
const path = require("path");
const User = require("../model/user");
const { customError } = require("../utils/errorClass");
const { tokenGen } = require("../utils/generateJWT_Token");

async function sendForgetMail(receiverEmail) {
    
    console.log('forget pass-shub',receiverEmail)
    const user = await User.findOne({ email: receiverEmail });
    if (!user) throw new customError("Email not exists", 404);

    
    console.log('reset----',receiverEmail);
    const resetToken = await tokenGen(user);
    console.log('reset----',resetToken);

    user.resetToken = resetToken;
    user.resetTokenExpiredAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    const resetLink = `${process.env.CLIENT_URL}/#/reset-password/${resetToken}`;

    console.log('reset----',resetLink);
    // ✅ Reference image file
    const imgLogo = path.join(__dirname, "../utils/logoJobZilla.png");

    const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f5f7; padding: 40px 0;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%"
      style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="background-color: #3be267ff; text-align: center; padding: 15px;">
          <img src="cid:jobzilla_logo" alt="JobZilla Logo" style="height: 80px;">
        </td>
      </tr>
      <tr>
        <td style="padding: 30px;">
          <h2 style="color: #1a365d; margin-bottom: 20px;">Reset your password</h2>
          <p style="font-size: 15px; color: #333;">Hi ${user.email},</p>
          <p style="font-size: 15px; color: #333;">
            Forgot your password? No problem. Please click on the button below to reset it.
          </p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; text-decoration: none;
              padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </p>
          <p style="font-size: 14px; color: #666;">
            This link is valid for <strong>15 minutes</strong>.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f4f5f7; text-align: center; padding: 15px;
          font-size: 13px; color: #666;">
          Contact us at 
          <a href="mailto:support@jobzilla.com" style="color: #2563eb; text-decoration: none;">
            support@jobzilla.com
          </a> 
          or call +91-XXXXXXXXXX
        </td>
      </tr>
    </table>
  </div>
  `;

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // ✅ Include logo inline as attachment
    const mailOptions = {
        from: `"JobZilla Support" <${process.env.FROM_EMAIL}>`,
        to: receiverEmail,
        subject: "Reset Your Password - JobZilla",
        html: htmlTemplate,
        attachments: [
            {
                filename: "logoJobZilla.png",
                path: imgLogo,
                cid: "jobzilla_logo", // must match cid used in <img src="cid:jobzilla_logo">
            },
        ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${receiverEmail}`);
}

module.exports = { sendForgetMail };
