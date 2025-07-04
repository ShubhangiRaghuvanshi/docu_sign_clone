const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/docu_sign', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);
const documentRoutes = require('./routes/document');
app.use('/', documentRoutes);
const signatureRoutes = require('./routes/signature');
app.use('/', signatureRoutes);

// JWT Auth Middleware (for demonstration)
const authMiddleware = require('./middleware/auth');

// Example protected route
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 