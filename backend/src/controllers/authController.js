const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwt');
const Voter = require('../models/Voter');
const Admin = require('../models/Admin');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role || 'voter'
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn
    }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Check for voter first
    let user = await Voter.findOne({ email: email.toLowerCase() });
    let role = 'voter';

    // If not found, check for admin
    if (!user) {
      user = await Admin.findOne({ email: email.toLowerCase() });
      role = 'admin';
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: role,
          level: user.level // Only for voters
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user._id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          role: req.user.role || 'voter',
          level: req.user.level // Only for voters
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = { login, verifyToken };