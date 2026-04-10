/**
 * Collaborations Routes
 *
 * Handles collaboration requests between developers.
 * Developers can raise a hand to collaborate on a project.
 * Project owners can accept or decline requests.
 *
 * @module routes/collaborations
 */

const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

// ─── GET Collaborations for a Project (Protected) ─────────────────────────────

/**
 * Get all collaboration requests for a project.
 * Only the project owner should see these.
 *
 * @route GET /api/collaborations/:projectId
 * @access Protected
 * @param {string} req.params.projectId - Project UUID
 * @returns {Array} array of collaboration requests
 */
router.get('/:projectId', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('project_id', req.params.projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data || []);

  } catch (err) {
    console.error('Get collaborations error:', err.message);
    return res.status(500).json({
      error: 'Failed to fetch collaboration requests.'
    });
  }
});
// ─── POST Create Collaboration Request (Protected) ────────────────────────────

/**
 * Raise a collaboration request on a project.
 * A developer cannot request to collaborate on their own project.
 *
 * @route POST /api/collaborations
 * @access Protected
 * @param {string} req.body.project_id - Project UUID
 * @param {string} req.body.message - Optional message to the project owner
 * @returns {object} created collaboration request
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { project_id, message } = req.body;

    // Input validation
    if (!project_id) {
      return res.status(400).json({ error: 'Project ID is required.' });
    }

    // Check the project exists and get the owner
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('user_id, title')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Prevent owner from requesting to collaborate on own project
    if (project.user_id === req.user.id) {
      return res.status(400).json({
        error: 'You cannot request to collaborate on your own project.'
      });
    }

    // Check if a request already exists from this user
    const { data: existing } = await supabase
      .from('collaborations')
      .select('id, status')
      .eq('project_id', project_id)
      .eq('requester_id', req.user.id)
      .single();

    if (existing) {
      return res.status(400).json({
        error: `You already have a ${existing.status} request for this project.`
      });
    }

    // Create the collaboration request
    const { data, error } = await supabase
      .from('collaborations')
      .insert({
        project_id,
        requester_id: req.user.id,
        message: message?.trim() || '',
        status: 'pending'
      })
      .select(`
        *,
        profiles!collaborations_requester_id_fkey (
          username,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    return res.status(201).json(data);

  } catch (err) {
    console.error('Create collaboration error:', err.message);
    return res.status(500).json({
      error: 'Failed to create collaboration request.'
    });
  }
});

// ─── PUT Update Collaboration Status (Protected) ──────────────────────────────

/**
 * Accept or decline a collaboration request.
 * Only the project owner can update the status.
 *
 * @route PUT /api/collaborations/:id
 * @access Protected
 * @param {string} req.params.id - Collaboration UUID
 * @param {string} req.body.status - 'accepted' or 'declined'
 * @returns {object} updated collaboration request
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['accepted', 'declined'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Status must be either accepted or declined.'
      });
    }

    // Get the collaboration request with project info
    const { data: collab, error: collabError } = await supabase
      .from('collaborations')
      .select(`
        *,
        projects (user_id)
      `)
      .eq('id', req.params.id)
      .single();

    if (collabError || !collab) {
      return res.status(404).json({
        error: 'Collaboration request not found.'
      });
    }

    // Only the project owner can accept or decline
    if (collab.projects.user_id !== req.user.id) {
      return res.status(403).json({
        error: 'Only the project owner can respond to collaboration requests.'
      });
    }

    // Update the status
    const { data, error } = await supabase
      .from('collaborations')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json(data);

  } catch (err) {
    console.error('Update collaboration error:', err.message);
    return res.status(500).json({
      error: 'Failed to update collaboration request.'
    });
  }
});

module.exports = router;