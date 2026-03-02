// Vercel Serverless Function to send emails via SMTP
// Deploy this to Vercel or similar serverless platform

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !institution) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Configure your email service (Gmail, SendGrid, etc.)
    // For Gmail: Use an App Password (not your regular password)
    // For SendGrid: Use SG.xxx token
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Set in Vercel environment variables
        pass: process.env.EMAIL_PASS, // Set in Vercel environment variables
      },
    });

    // Format the email body
    const emailBody = `
INNSIS - Request Form Submission
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
This form was submitted from: ${req.headers.referer || 'Unknown'}
Submitted at: ${new Date().toISOString()}
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'areddy@crmwebx.com',
      subject: 'INNSIS - Request Form Filled From Website',
      text: emailBody,
      replyTo: email,
    });

    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
