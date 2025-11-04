
const nodemailer = require("nodemailer");
const path = require("path");
const User = require("../model/user");
const { customError } = require("../utils/errorClass");
const { tokenGen } = require("../utils/generateJWT_Token");
const Brevo = require("@getbrevo/brevo");
const otp = require("../model/otp");
const Otp = require("../model/otp");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;



async function mailHandler(receiverEmail, htmlTemplate) {
    const email = new Brevo.SendSmtpEmail();
    email.subject = "Your JobZilla verification code";
    email.sender = { name: "JobZilla", email: process.env.FROM_EMAIL };
    email.to = [{ email: receiverEmail }];
    email.htmlContent = htmlTemplate;

    try {
        await apiInstance.sendTransacEmail(email);
        console.log(`✅ verify email sent to ${receiverEmail}`);
    } catch (err) {
        console.error("❌ Brevo API failed:", err);
    }
    await apiInstance.sendTransacEmail(email);
}

// utils/generateOTP.js
function generateOTP(length = 6) {
    // returns string like "483291"
    return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

async function verifyOtp(receiverEmail, passwordX, receiverOtp) {
  try {
    const otpRecord = await Otp.findOne({ email: receiverEmail });
    console.log('otpre', otpRecord);

    if (!otpRecord) {
      throw new customError('OTP not found or expired', 400);
    }

    if (otpRecord.otp !== receiverOtp) {
      throw new customError('Incorrect OTP', 400);
    }

    const newUser = await User.create({
      email: receiverEmail,
      password: passwordX,
      role: 'jobseeker',
    });

    const token = tokenGen(newUser._id);

    await Otp.deleteOne({ email: receiverEmail }); // cleanup

    return { newUser, token }; // ✅ Always return object
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    throw error; // ✅ rethrow so otpCheck receives it
  }
}


async function sendForgetMailX(receiverEmail) {

    
        console.log('forget pass-shub', receiverEmail)
        const user = await User.findOne({ email: receiverEmail });
        if (user) throw new customError("Email already exists", 404);
        const otpX = generateOTP();
        const ok = await Otp.findOneAndUpdate(
            { email: receiverEmail },
            { email: receiverEmail, otp: otpX, expireAt: new Date(Date.now() + 10 * 60 * 1000) },
            { upsert: true, new: true }
        );



        //    Otp.create({email:receiverEmail,otp:otpX});
        console.log('reset----', ok);


        // ✅ Reference image file
        const imgLogo = path.join(__dirname, "../utils/logoJobZilla.png");
        console.log('reset----', ok);





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
          <h2 style="color: #1a365d; margin-bottom: 20px;">Verify your Email</h2>
          <p style="font-size: 15px; color: #333;">Hi ${receiverEmail},</p>
          <p style="font-size: 15px; color: #333;">
            we are excited to have you onboard at jobzilla!
          </p>
          <br>
          <p>Verify your email address by using the following one-Time-Password</p>
          <p style="text-align: center; margin: 30px 0;">
           ${otpX}
          </p>
          <p style="font-size: 14px; color: #666;">
            This otp is valid for <strong>15 minutes</strong>.
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


        await mailHandler(receiverEmail, htmlTemplate);
  


}

module.exports = { sendForgetMailX, verifyOtp };


