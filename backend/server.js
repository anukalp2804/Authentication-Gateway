const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// ✅ CHANNELS TUNED FOR SECURE METADATA AND GRAPHIC STRINGS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Your Vite deployment port location
  credentials: true                // Crucial for processing secure HttpOnly Cookies
}));

// Route Gateway Registry mapping
app.use('/api/auth', authRoutes);

// Database Cluster Connection Layer
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Safely.'))
  .catch((err) => console.error('DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server blasting off on port ${PORT}`));