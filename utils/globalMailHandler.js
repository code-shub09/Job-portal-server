


const nodemailer = require("nodemailer");
const path = require("path");
const Brevo = require("@getbrevo/brevo");


const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;


 async function mailHandler(receiverEmail, htmlTemplate, subject) {
    const email = new Brevo.SendSmtpEmail();
    email.subject = subject;
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


module.exports={
    mailHandler
}