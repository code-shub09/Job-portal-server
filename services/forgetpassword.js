
const nodemailer = require("nodemailer");
const path = require("path");
const User = require("../model/user");
const { customError } = require("../utils/errorClass");
const { tokenGen } = require("../utils/generateJWT_Token");
const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

async function mailHandler(receiverEmail,htmlTemplate){
    const email = new Brevo.SendSmtpEmail();
  email.subject = "Reset Your Password - JobZilla";
  email.sender = { name: "JobZilla Support", email: process.env.FROM_EMAIL };
  email.to = [{ email: receiverEmail }];
  email.htmlContent = htmlTemplate

  try {
    await apiInstance.sendTransacEmail(email);
    console.log(`✅ Password reset email sent to ${receiverEmail}`);
  } catch (err) {
    console.error("❌ Brevo API failed:", err);
  }
    
}
async function sendForgetMail(receiverEmail) {

    console.log('forget pass-shub', receiverEmail)
    const user = await User.findOne({ email: receiverEmail });
    if (!user) throw new customError("Email not exists", 404);


    console.log('reset----', receiverEmail);
    const resetToken = await tokenGen(user);
    console.log('reset----', resetToken);

    user.resetToken = resetToken;
    user.resetTokenExpiredAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    const resetLink = `${process.env.CLIENT_URL}/#/reset-password/${resetToken}`;

    console.log('reset----', resetLink);
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


    await mailHandler(receiverEmail,htmlTemplate);


}

module.exports = { sendForgetMail };


    // ✅ Create transporter
    // console.log('host:', process.env.SMTP_HOST)
    // console.log('host:', process.env.SMTP_PORT)
    // console.log('us:', process.env.SMTP_USER);
    // console.log('pass:', process.env.SMTP_PASS)
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp-relay.brevo.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: '991228001@smtp-brevo.com',
    //         pass: process.env.SMTP_PASS,
    //     },
    // });

    // // ✅ Include logo inline as attachment
    // const mailOptions = {
    //     from: `"JobZilla Support" <${process.env.FROM_EMAIL}>`,
    //     to: receiverEmail,
    //     subject: "Reset Your Password - JobZilla",
    //     html: htmlTemplate,
    //     attachments: [
    //         {
    //             filename: "logoJobZilla.png",
    //             path: imgLogo,
    //             cid: "jobzilla_logo", // must match cid used in <img src="cid:jobzilla_logo">
    //         },
    //     ],
    // };

    // try {
    //      console.log('transporter--');
    //     await transporter.sendMail(mailOptions);
    //     console.log(`✅ Password reset email sent to ${receiverEmail}`);
    // } catch (err) {
    //     console.error("❌ Email send failed:", err);
    // }