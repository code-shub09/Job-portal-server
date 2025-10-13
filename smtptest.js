require("dotenv").config();
const nodemailer = require("nodemailer");

(async () => {
  try {
    // 1️⃣ Create transporter with Brevo credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp-relay.brevo.com
      port: process.env.SMTP_PORT, // 587
      secure: false, // true for 465, false for 587 (TLS)
      auth: {
        user: process.env.SMTP_USER, // e.g. 991228001@smtp-brevo.com
        pass: process.env.SMTP_PASS, // xsmtpsib-...
      },
    });

    // 2️⃣ Verify connection first
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!");

    // 3️⃣ Compose a simple test email
    const mailOptions = {
      from: `"JobZilla Test" <${process.env.FROM_EMAIL}>`,
      to: "shubk362@gmail.com", // 👈 change this to your email to test
      subject: "Test Email from JobZilla via Brevo SMTP",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2 style="color:#1a365d;">Hello from JobZilla 👋</h2>
          <p>This is a test email sent using <strong>Brevo SMTP + Nodemailer</strong>.</p>
          <p>If you see this in your inbox, your SMTP setup is working perfectly 🎉</p>
          <hr/>
          <p style="font-size:12px;color:#666;">Sent at ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    // 4️⃣ Send the test email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent successfully!");
    console.log("📨 Message ID:", info.messageId);
    console.log("📬 Response:", info.response);
  } catch (error) {
    console.error("❌ Failed to send test email:");
    console.error(error);
  }
})();
