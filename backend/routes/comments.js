/**
 * Comments Routes
 *
 * Handles comment retrieval and creation.
 * Public routes: GET comments for a project.
 * Protected routes: POST comment requires authentication.
 *
 * @module routes/comments
 */

const express = require('express');
const router = express.Router();
const CommentModel = require('../models/commentModel');
const authMiddleware = require('../middleware/authMiddleware');

// ─── GET Comments for a Project (Public) ─────────────────────────────────────

/**
 * Get all comments for a specific project.
 *
 * @route GET /api/comments/:projectId
 * @access Public
 * @param {string} req.params.projectId - Project UUID
 * @returns {Array} array of comment objects
 */
router.get('/:projectId', async (req, res) => {
  try {
    const comments = await CommentModel.getByProject(req.params.projectId);
    return res.status(200).json(comments);
  } catch (err) {
    console.error('Get comments error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch comments.' });
  }
});

// ─── POST Create Comment (Protected) ─────────────────────────────────────────

/**
 * Post a new comment on a project.
 * Requires authentication.
 *
 * @route POST /api/comments
 * @access Protected
 * @param {string} req.body.project_id - Project UUID
 * @param {string} req.body.content - Comment text
 * @returns {object} created comment
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { project_id, content } = req.body;

    // Input validation
    if (!project_id) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    if (!content || content.trim().length < 2) {
      return res.status(400).json({
        error: 'Comment must be at least 2 characters.'
      });
    }

    if (content.trim().length > 500) {
      return res.status(400).json({
        error: 'Comment cannot exceed 500 characters.'
      });
    }

    const comment = await CommentModel.create(
      project_id,
      req.user.id,
      content
    );

    return res.status(201).json(comment);

  } catch (err) {
    console.error('Create comment error:', err.message);
    return res.status(500).json({ error: 'Failed to post comment.' });
  }
});

// ─── DELETE Comment (Protected) ───────────────────────────────────────────────

/**
 * Delete a comment.
 * Only the comment author can delete it.
 *
 * @route DELETE /api/comments/:id
 * @access Protected
 * @param {string} req.params.id - Comment UUID
 * @returns {object} success message
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await CommentModel.delete(req.params.id, req.user.id);
    return res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    console.error('Delete comment error:', err.message);
    return res.status(500).json({ error: 'Failed to delete comment.' });
  }
});

module.exports = router;