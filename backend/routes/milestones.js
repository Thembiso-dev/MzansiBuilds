/**
 * Milestones Routes
 *
 * Handles milestone retrieval and creation.
 * Public routes: GET milestones for a project.
 * Protected routes: POST milestone requires authentication.
 *
 * @module routes/milestones
 */

const express = require('express');
const router = express.Router();
const MilestoneModel = require('../models/milestoneModel');
const authMiddleware = require('../middleware/authMiddleware');

// ─── GET Milestones for a Project (Public) ────────────────────────────────────

/**
 * Get all milestones for a specific project.
 *
 * @route GET /api/milestones/:projectId
 * @access Public
 * @param {string} req.params.projectId - Project UUID
 * @returns {Array} array of milestone objects
 */
router.get('/:projectId', async (req, res) => {
  try {
    const milestones = await MilestoneModel.getByProject(req.params.projectId);
    return res.status(200).json(milestones);
  } catch (err) {
    console.error('Get milestones error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch milestones.' });
  }
});

// ─── POST Create Milestone (Protected) ───────────────────────────────────────

/**
 * Add a new milestone to a project.
 * Requires authentication.
 * Only the project owner should add milestones to their project.
 *
 * @route POST /api/milestones
 * @access Protected
 * @param {string} req.body.project_id - Project UUID
 * @param {string} req.body.title - Milestone title
 * @param {string} req.body.description - Optional description
 * @returns {object} created milestone
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { project_id, title, description } = req.body;

    // Input validation
    if (!project_id) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        error: 'Milestone title must be at least 3 characters.'
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        error: 'Milestone title cannot exceed 200 characters.'
      });
    }

    const milestone = await MilestoneModel.create(
      project_id,
      req.user.id,
      title,
      description || ''
    );

    return res.status(201).json(milestone);

  } catch (err) {
    console.error('Create milestone error:', err.message);
    return res.status(500).json({ error: 'Failed to create milestone.' });
  }
});

module.exports = router;