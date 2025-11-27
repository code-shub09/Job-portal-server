
function shortlistTemplate(name){
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
          <h2 style="color: #1a365d; margin-bottom: 20px;">congratulation !!!!</h2>
          <p style="font-size: 15px; color: #333;">Hi ${name},</p>
          <p style="font-size: 15px; color: #333;">
            You have been shortlisted for your job application.
          </p>
          <br>
         
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

  return htmlTemplate;
}

module.exports={shortlistTemplate}
  