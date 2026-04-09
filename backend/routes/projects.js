/**
 * Projects Routes
 *
 * Handles all project CRUD operations.
 * Public routes: GET all projects, GET single project.
 * Protected routes: POST, PUT, DELETE require authentication.
 *
 * @module routes/projects
 */

const express = require('express');
const router = express.Router();
const ProjectModel = require('../models/projectModel');
const authMiddleware = require('../middleware/authMiddleware');

// ─── Validation Helper ────────────────────────────────────────────────────────

/**
 * Valid project stages allowed by the database constraint.
 */
const VALID_STAGES = ['idea', 'in_progress', 'completed'];

/**
 * Validates project input fields.
 *
 * @param {object} body - Request body
 * @returns {string|null} error message or null if valid
 */
const validateProject = (body) => {
  const { title, description, stage } = body;

  if (!title || title.trim().length < 3) {
    return 'Title is required and must be at least 3 characters.';
  }

  if (!description || description.trim().length < 10) {
    return 'Description is required and must be at least 10 characters.';
  }

  if (stage && !VALID_STAGES.includes(stage)) {
    return `Stage must be one of: ${VALID_STAGES.join(', ')}`;
  }

  return null;
};

// ─── GET All Projects (Public) ────────────────────────────────────────────────

/**
 * Get all projects for the live feed.
 * Returns newest projects first.
 *
 * @route GET /api/projects
 * @access Public
 * @returns {Array} array of project objects
 */
router.get('/', async (req, res) => {
  try {
    const projects = await ProjectModel.getAll();
    return res.status(200).json(projects);
  } catch (err) {
    console.error('Get projects error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch projects.' });
  }
});

// ─── GET Single Project (Public) ──────────────────────────────────────────────

/**
 * Get a single project by ID.
 *
 * @route GET /api/projects/:id
 * @access Public
 * @param {string} req.params.id - Project UUID
 * @returns {object} project object
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await ProjectModel.getById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    return res.status(200).json(project);
  } catch (err) {
    console.error('Get project error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch project.' });
  }
});

// ─── POST Create Project (Protected) ─────────────────────────────────────────

/**
 * Create a new project.
 * Requires authentication.
 *
 * @route POST /api/projects
 * @access Protected
 * @param {string} req.body.title - Project title
 * @param {string} req.body.description - Project description
 * @param {string} req.body.stage - Project stage (idea/in_progress/completed)
 * @param {string} req.body.support_needed - Type of support needed
 * @returns {object} created project
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const validationError = validateProject(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const project = await ProjectModel.create(req.body, req.user.id);
    return res.status(201).json(project);

  } catch (err) {
    console.error('Create project error:', err.message);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
});

// ─── PUT Update Project (Protected) ──────────────────────────────────────────

/**
 * Update an existing project.
 * Only the project owner can update it.
 *
 * @route PUT /api/projects/:id
 * @access Protected
 * @param {string} req.params.id - Project UUID
 * @returns {object} updated project
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, stage, support_needed } = req.body;

    if (stage && !VALID_STAGES.includes(stage)) {
      return res.status(400).json({
        error: `Stage must be one of: ${VALID_STAGES.join(', ')}`
      });
    }

    const updates = {};
    if (title) updates.title = title.trim();
    if (description) updates.description = description.trim();
    if (stage) updates.stage = stage;
    if (support_needed !== undefined) updates.support_needed = support_needed;

    const project = await ProjectModel.update(
      req.params.id,
      req.user.id,
      updates
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found or you do not have permission to update it.'
      });
    }

    return res.status(200).json(project);

  } catch (err) {
    console.error('Update project error:', err.message);
    return res.status(500).json({ error: 'Failed to update project.' });
  }
});

// ─── DELETE Project (Protected) ───────────────────────────────────────────────

/**
 * Delete a project.
 * Only the project owner can delete it.
 *
 * @route DELETE /api/projects/:id
 * @access Protected
 * @param {string} req.params.id - Project UUID
 * @returns {object} success message
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await ProjectModel.delete(req.params.id, req.user.id);
    return res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Delete project error:', err.message);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
});

module.exports = router;