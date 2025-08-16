require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// ===== CONNECT TO MONGO =====
const mongoURI =
  process.env.USE_ATLAS === 'true'
    ? process.env.MONGO_URI_ATLAS.replace(
        '<db_password>',
        encodeURIComponent(process.env.DB_PASSWORD || '')
      )
    : process.env.MONGO_URI_LOCAL;

connectDB(mongoURI)
  .then(() => console.log(`✅ Connected to MongoDB: ${process.env.USE_ATLAS === 'true' ? 'Atlas' : 'Local'}`))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ===== MIDDLEWARE =====
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN || 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// ===== ROUTES =====
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

// ===== ERROR HANDLING =====
app.use(notFound);
app.use(errorHandler);

// ===== STATIC FILES =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 AJAY BANGLE API running on port ${PORT}`));
