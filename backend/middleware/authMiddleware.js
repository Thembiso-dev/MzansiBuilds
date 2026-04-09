/**
 * Authentication Middleware
 *
 * Verifies the JWT token on every protected route.
 * Attaches the authenticated user to req.user if valid.
 * Returns 401 if the token is missing or invalid.
 *
 * @module middleware/authMiddleware
 */

const supabase = require('../supabaseClient');

/**
 * Middleware to protect routes that require authentication.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * @returns {void}
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. Token is malformed.'
      });
    }

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Access denied. Invalid or expired token.'
      });
    }

    // Attach user to request for use in route handlers
    req.user = user;
    next();

  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({
      error: 'Access denied. Token verification failed.'
    });
  }
};

module.exports = authMiddleware;