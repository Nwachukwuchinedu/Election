const rateLimit = require("express-rate-limit");
const xss = require("xss");

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Set CORS headers
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://speuniben-election.vercel.app",
    "https://election-p1lx.onrender.com",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Encrypted-Request, X-Encrypted-Response"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`
  );
  next();
};

// XSS sanitization middleware
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key]);
      }
    }
  }
  next();
};

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Brute force protection middleware
const bruteForceProtection = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for login
  skipSuccessfulRequests: true,
  message: {
    status: "error",
    message: "Too many login attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  securityHeaders,
  requestLogger,
  sanitizeInput,
  rateLimiter,
  bruteForceProtection,
};
