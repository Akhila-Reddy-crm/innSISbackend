const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass:  process.env.EMAIL_PASS, // Your Gmail App Password (NOT regular password)
  },
});

app.post('/api/send-contact', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      help,
      institution,
      jobTitle,
      schoolUrl,
      schoolType,
      questions,
      consent,
    } = req.body;
console.log(req.body,"body::::")
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !institution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format email body with each field on separate line
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
How Can We Help: ${help || 'N/A'}
Questions/Comments: ${questions || 'N/A'}
Consent to Contact: ${consent ? 'Yes' : 'No'}

================================
Submitted at: ${new Date().toISOString()}
Submitted from: ${req.headers.origin || 'Unknown'}`;
console.log(process.env.EMAIL_USER,"process.env.EMAIL_USER::::")
console.log(process.env.EMAIL_USER,"process.env.EMAIL_USER::::")
    // Send email
    await transporter.sendMail({
      // Gmail must send from the authenticated account, but we
      // surface the submitter's email prominently in the from name
      from: `"${firstName} ${lastName} - ${email}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'INNSIS - Request Form Filled From Website',
      text: emailBody,
      replyTo: email,
    });

    console.log(`✓ Email sent successfully from ${email}`);
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully to areddy@crmwebx.com' 
    });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Email endpoint: POST http://localhost:3001/api/send-contact');
});
