/**
 * Authentication Routes
 *
 * Handles user registration, login and logout.
 * All inputs are validated before touching the database.
 * Uses Supabase Auth for secure credential management.
 *
 * @module routes/auth
 */

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

// ─── Validation Helper ────────────────────────────────────────────────────────

/**
 * Validates an email address format.
 *
 * @param {string} email - The email to validate
 * @returns {boolean} true if valid
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password meets minimum requirements.
 * Must be at least 6 characters long.
 *
 * @param {string} password - The password to validate
 * @returns {boolean} true if valid
 */
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Register a new developer account.
 *
 * @route POST /api/auth/register
 * @access Public
 * @param {string} req.body.email - User email address
 * @param {string} req.body.password - User password (min 6 chars)
 * @param {string} req.body.username - Display username
 * @returns {object} user object and session token
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // ── Input Validation (Secure by Design) ──
    if (!email || !password || !username) {
      return res.status(400).json({
        error: 'Email, password and username are required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address.'
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long.'
      });
    }

    if (username.trim().length < 2) {
      return res.status(400).json({
        error: 'Username must be at least 2 characters long.'
      });
    }

    // ── Register with Supabase Auth ──
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { username: username.trim() }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username
      }
    });

  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Log in an existing developer.
 *
 * @route POST /api/auth/login
 * @access Public
 * @param {string} req.body.email - User email address
 * @param {string} req.body.password - User password
 * @returns {object} user object and JWT session token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Input Validation ──
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address.'
      });
    }

   // ── Authenticate with Supabase ──
const { data, error } = await supabase.auth.signInWithPassword({
  email: email.trim().toLowerCase(),
  password
});

if (error || !data.session) {
  return res.status(401).json({
    error: 'Invalid email or password.'
  });
}

return res.status(200).json({
  message: 'Login successful.',
  user: {
    id: data.user.id,
    email: data.user.email,
    username: data.user.user_metadata.username
  },
  token: data.session.access_token
});

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Log out the currently authenticated developer.
 * Requires a valid JWT token in the Authorization header.
 *
 * @route POST /api/auth/logout
 * @access Protected
 * @returns {object} success message
 */
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(500).json({ error: 'Error during logout.' });
    }

    return res.status(200).json({
      message: 'Logged out successfully.'
    });

  } catch (err) {
    console.error('Logout error:', err.message);
    return res.status(500).json({ error: 'Server error during logout.' });
  }
});

module.exports = router;