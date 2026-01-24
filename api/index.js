const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// --- Middlewares Globales ---
app.use(helmet()); 
app.use(express.json());
app.use(cors()); 

// --- Configuración SMTP ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- Configuración del Rate Limiter ---
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    message: 'Demasiados intentos. Por favor, intentá de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Rutas ---
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;
  console.log(`📩 Intento de envío desde: ${email}`);

  const mailOptions = {
    from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`, 
    to: process.env.EMAIL_USER,
    subject: `📩 Nuevo mensaje de ${name}`,
    replyTo: email, 
    text: `Has recibido un nuevo mensaje desde tu portfolio:\n\n` +
          `Nombre: ${name}\n` +
          `Email del remitente: ${email}\n\n` +
          `Mensaje:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email enviado con éxito");
    res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error("❌ Error enviando mail:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// --- Server Start & Export ---

// Esto es lo que corregimos: solo levanta el server si NO estás en Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor local corriendo en http://localhost:${PORT}`);
  });
}

// Exportar para que Vercel lo use como Serverless Function
module.exports = app;