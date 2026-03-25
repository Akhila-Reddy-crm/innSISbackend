const express = require('express');
const router = express.Router();

module.exports = (transporter) => {
  router.post('/', async (req, res) => {
    try {
      const {
        firstName, lastName, businessEmail, phone, jobTitle,
        companyName, companyWebsite, companySize,
        country, sector, reason, agree,
      } = req.body;

      if (!firstName || !lastName || !businessEmail || !phone || !companyName || !country || !agree) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const emailBody = `INNSIS - Reseller Application Submission
================================

First Name: ${firstName}
Last Name: ${lastName}
Business Email: ${businessEmail}
Phone: ${phone}
Job Title: ${jobTitle || 'N/A'}

Company Name: ${companyName}
Company Website: ${companyWebsite || 'N/A'}
Company Size: ${companySize || 'N/A'}
Country: ${country}
Sector You Serve: ${sector || 'N/A'}

Why do you want to partner with INNSIS?: ${reason || 'N/A'}
Agreed to Privacy/Terms: ${agree ? 'Yes' : 'No'}

================================
Submitted at: ${new Date().toISOString()}
Submitted from: ${req.headers.origin || 'Unknown'}`;

      await transporter.sendMail({
        from: `"${firstName} ${lastName} - ${businessEmail}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'INNSIS - Reseller Application Filled From Website',
        text: emailBody,
        replyTo: businessEmail,
      });

      console.log(`✓ Reseller email sent successfully from ${businessEmail}`);
      return res.status(200).json({
        success: true,
        message: 'Reseller application submitted successfully',
      });
    } catch (error) {
      console.error('Reseller email send error:', error);
      return res.status(500).json({
        error: 'Failed to send email',
        details: error.message,
      });
    }
  });

  return router;
};