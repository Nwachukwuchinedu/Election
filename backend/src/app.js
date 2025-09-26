const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const http = require("http");
const { Server } = require("socket.io");
const { checkElectionStatuses } = require("./controllers/electionController");
const {
  securityHeaders,
  requestLogger,
} = require("./middleware/securityMiddleware");
const {
  encryptAllResponses,
  decryptAllRequests,
} = require("./middleware/encryptionMiddleware");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require("./routes/auth");
const voterRoutes = require("./routes/voters");
const candidateRoutes = require("./routes/candidates");
const adminRoutes = require("./routes/admin");
const electionRoutes = require("./routes/election"); // Add election routes

const app = express();

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Encrypted-Request, X-Encrypted-Response"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Security middleware
app.use(securityHeaders);
app.use(requestLogger);

// Enable CORS for all routes with specific configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://speuniben-election.vercel.app",
    "https://election-p1lx.onrender.com",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser middleware (before decryption)
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ limit: "10mb", type: "text/plain" }));

// Decryption middleware (after body parser)
app.use(decryptAllRequests);

// Encryption middleware (before routes)
app.use(encryptAllResponses);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Store io instance for use in controllers
app.set("io", io);

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/voters", voterRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/election", electionRoutes); // Add election routes

app.get("/", (req, res) => {
  res.send("API is running...");
});

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
