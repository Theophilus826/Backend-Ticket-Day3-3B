// server.js (root)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/Db');
const { errorHandler } = require('./middleware/ErrorMiddleware');

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== CORS FIXED FOR RENDER + NETLIFY =====
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://ticket-front.netlify.app'
    ],
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
    credentials: true,
}));

// Preflight requests (IMPORTANT for Render)
app.options('*', cors());

// Test route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Support Desk API' });
});

// Routes
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/tickets', require('./routes/TicketRoutes'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`.cyan);
});
