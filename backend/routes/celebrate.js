/**
 * Celebration Wall Routes
 *
 * Returns all completed projects with their authors.
 * This is a public endpoint — no authentication required.
 * Developers are celebrated when they mark a project as completed.
 *
 * @module routes/celebrate
 */

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// ─── GET Celebration Wall (Public) ────────────────────────────────────────────

/**
 * Get all completed projects for the celebration wall.
 * Orders by completion date, most recent first.
 *
 * @route GET /api/celebrate
 * @access Public
 * @returns {Array} array of completed project objects with profiles
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('stage', 'completed')
      .order('completed_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data || []);

  } catch (err) {
    console.error('Celebrate error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch celebration wall.' });
  }
});

module.exports = router;