/**
 * Profile Routes
 *
 * Handles fetching and updating the current user's profile.
 * All routes require authentication.
 *
 * @module routes/profile
 */

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

// ─── GET Current User Profile (Protected) ────────────────────────────────────

/**
 * Get the currently authenticated user's profile.
 *
 * @route GET /api/profile
 * @access Protected
 * @returns {object} profile object
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Get profile error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ─── GET Any User Profile by ID (Public) ─────────────────────────────────────

/**
 * Get any developer's profile by their ID.
 *
 * @route GET /api/profile/:id
 * @access Public
 * @param {string} req.params.id - User UUID
 * @returns {object} profile object
 */
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Get profile error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ─── PUT Update Profile (Protected) ──────────────────────────────────────────

/**
 * Update the currently authenticated user's profile.
 *
 * @route PUT /api/profile
 * @access Protected
 * @param {string} req.body.bio - Developer bio
 * @param {string} req.body.skills - Comma separated skills string
 * @param {string} req.body.username - Display username
 * @returns {object} updated profile
 */
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { bio, skills, username } = req.body;

    const updates = {};

    if (username !== undefined) {
      if (username.trim().length < 2) {
        return res.status(400).json({
          error: 'Username must be at least 2 characters.'
        });
      }
      updates.username = username.trim();
    }

    if (bio !== undefined) {
      updates.bio = bio.trim();
    }

    if (skills !== undefined) {
      // Convert comma separated string to array
      updates.skills = skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json(data);

  } catch (err) {
    console.error('Update profile error:', err.message);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ─── DELETE Account (Protected) ───────────────────────────────────────────────

/**
 * Permanently deletes the current user's account.
 * Cascades to delete all their projects, comments and milestones.
 * This action cannot be undone.
 *
 * @route DELETE /api/profile
 * @access Protected
 * @returns {object} success message
 */
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete profile first (cascades to projects, comments, milestones)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) throw profileError;

    // Delete the auth user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    return res.status(200).json({
      message: 'Account deleted successfully.'
    });

  } catch (err) {
    console.error('Delete account error:', err.message);
    return res.status(500).json({ error: 'Failed to delete account.' });
  }
});

module.exports = router;