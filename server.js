const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Shared transporter instance
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes — transporter injected so each route file stays stateless
app.use('/api/send-contact',  require('./api/send-contact')(transporter));
app.use('/api/send-reseller', require('./api/send-reseller')(transporter));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('POST http://localhost:3001/api/send-contact');
  console.log('POST http://localhost:3001/api/send-reseller');
});