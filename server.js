const express = require('express');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Explicit HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'main.html'));
});

app.get('/booking', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'booking.html'));
});

app.get('/confirmation', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'confirmation.html'));
});

module.exports = app;
