const express = require('express');
const router = express.Router();

module.exports = (transporter) => {
  router.post('/', async (req, res) => {
    try {
      const {
        firstName, lastName, email, phone, country,
        help, institution, jobTitle, schoolUrl,
        schoolType, totalStudentsEnrolled, totalFacultyMembers,
        questions, consent,
      } = req.body;

      console.log(req.body, "body::::");

      if (!firstName || !lastName || !email || !phone || !institution) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const submittedAtEST = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const emailBody = `INNSIS - Request Form Submission
================================

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Country: ${country || 'N/A'}
Institution Name: ${institution}
Job Title: ${jobTitle || 'N/A'}
School URL: ${schoolUrl || 'N/A'}
School Type: ${schoolType || 'N/A'}
Total Students Enrolled: ${totalStudentsEnrolled || 'N/A'}
Total Faculty Members: ${totalFacultyMembers || 'N/A'}
How Can We Help: ${help || 'N/A'}
Questions/Comments: ${questions || 'N/A'}
Consent to Contact: ${consent ? 'Yes' : 'No'}

================================
Submitted at: ${submittedAtEST}
Submitted from: ${req.headers.origin || 'Unknown'}`;

      await transporter.sendMail({
        from: `"${firstName} ${lastName} - ${email}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'INNSIS - Request Form Filled From Website',
        text: emailBody,
        replyTo: email,
      });

      console.log(`✓ Email sent successfully from ${email}`);
      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
      });
    } catch (error) {
      console.error('Email send error:', error);
      return res.status(500).json({
        error: 'Failed to send email',
        details: error.message,
      });
    }
  });

  return router;
};