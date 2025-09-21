const crypto = require('crypto');

// Simple base64 encryption/decryption
class SimpleEncryption {
  encrypt(data) {
    try {
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      return Buffer.from(dataString, 'utf8').toString('base64');
    } catch (error) {
      throw new Error('Encryption failed: ' + error.message);
    }
  }

  decrypt(encryptedData) {
    try {
      return Buffer.from(encryptedData, 'base64').toString('utf8');
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }
}

const encryption = new SimpleEncryption();

// Middleware to encrypt all responses
const encryptAllResponses = (req, res, next) => {
  // Skip encryption for static files and non-API routes
  if (req.path.includes('.') || !req.path.startsWith('/api')) {
    return next();
  }
  
  // Override json method for response encryption
  const originalJson = res.json;
  res.json = function(data) {
    try {
      const encryptedData = encryption.encrypt(data);
      
      // Set header to indicate encrypted response
      res.setHeader('X-Encrypted-Response', 'true');
      
      return originalJson.call(this, encryptedData);
    } catch (error) {
      console.error('Encryption error:', error);
      return originalJson.call(this, data);
    }
  };
  
  next();
};

// Middleware to decrypt all requests
const decryptAllRequests = (req, res, next) => {
  // Skip decryption for static files and non-API routes
  if (req.path.includes('.') || !req.path.startsWith('/api')) {
    return next();
  }
  
  // Only process POST, PUT, PATCH requests with body data
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') && req.body) {
    // Check if body is a string (encrypted data)
    if (typeof req.body === 'string') {
      try {
        const decryptedData = encryption.decrypt(req.body);
        req.body = JSON.parse(decryptedData);
      } catch (error) {
        console.error('Decryption error:', error);
        // If decryption fails, continue with original body
      }
    }
  }
  
  next();
};

module.exports = {
  encryptAllResponses,
  decryptAllRequests,
  encryption
};