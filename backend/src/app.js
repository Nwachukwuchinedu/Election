const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const http = require('http');
const { Server } = require('socket.io');
const { checkElectionStatuses } = require('./controllers/electionController');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const voterRoutes = require('./routes/voters');
const candidateRoutes = require('./routes/candidates');
const adminRoutes = require('./routes/admin');
const electionRoutes = require('./routes/election'); // Add election routes

const app = express();

// Body parser middleware
app.use(express.json());

// Cors middleware
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store io instance for use in controllers
app.set('io', io);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/voters', voterRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/election', electionRoutes); // Add election routes

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Run election status check every 30 seconds
setInterval(() => {
  checkElectionStatuses(io);
}, 30000);

// Export io for use in controllers
module.exports = { app, io };