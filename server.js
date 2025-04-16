import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// ✅ Fix CORS: allow local dev and live site
app.use(cors({
  origin: ['http://localhost:5173', 'https://rajitha.site'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// ✅ /api/contact route
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_USER,
    subject: `Contact Form: ${subject}`,
    html: `<h3>Name: ${name}</h3>
           <h4>Email: ${email}</h4>
           <p>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// ✅ Optional: Placeholder for /api/likes to stop 404
app.get('/api/likes', (req, res) => {
  res.json({ likes: 0 });
});

// ✅ Listen on Railway-compatible port
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
