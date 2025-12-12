// server.js (root)
const express = require('express');
const cors = require('cors'); // <- import cors
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/Db');
const { errorHandler } = require('./middleware/ErrorMiddleware');

dotenv.config();

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // allow only your frontend
    credentials: true // if you need to send cookies/auth headers
}));

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Support Desk API' });
});

// Routes
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/tickets', require('./routes/TicketRoutes'));

// Error handler (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`.cyan);
});
