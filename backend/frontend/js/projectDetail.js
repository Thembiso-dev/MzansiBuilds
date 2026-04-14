/**
 * Project Detail Module
 *
 * Handles loading and rendering a single project page
 * including milestones, comments, edit and delete.
 *
 * @module projectDetail
 */

// Get project ID from URL query string
const getProjectId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

// Store current project in memory
let currentProject = null;

// ─── Time Helper ──────────────────────────────────────────────────────────────

/**
 * Converts timestamp to human readable relative time.
 *
 * @param {string} timestamp - ISO timestamp
 * @returns {string} relative time string
 */
const timeAgo = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} days ago`;
};

// ─── Stage Label ──────────────────────────────────────────────────────────────

/**
 * Returns display label for a project stage.
 *
 * @param {string} stage - Stage value
 * @returns {string} human readable label
 */
const stageLabel = (stage) => {
  const labels = {
    idea: 'Idea',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  return labels[stage] || stage;
};

// ─── Load Project ─────────────────────────────────────────────────────────────

/**
 * Loads and renders the project detail section.
 * Shows edit and delete buttons only to the project owner.
 *
 * @param {string} projectId - Project UUID
 */
const loadProject = async (projectId) => {
  try {
    const res = await fetch(`${API_URL}/projects/${projectId}`);
    const project = await res.json();

    if (!res.ok) {
      document.getElementById('project-loading').textContent =
        'Project not found.';
      return;
    }

    currentProject = project;

    const username = project.profiles?.username || 'Unknown';
    const initials = username.substring(0, 2).toUpperCase();
    const stage = project.stage || 'idea';
    const user = getUser();

    // Only show edit/delete if current user owns the project
    const isOwner = user && user.id === project.user_id;

  // Show correct collaboration section based on ownership
// Show correct collaboration section based on ownership
// Show correct collaboration section based on ownership
const collabSection = document.getElementById('collab-section');
const ownerCollabSection = document.getElementById('owner-collab-section');

if (isOwner) {
  // Owner sees incoming requests — hide raise hand button
  if (collabSection) collabSection.classList.add('hidden');
  if (ownerCollabSection) {
    ownerCollabSection.classList.remove('hidden');
    loadCollaborations(project.id);
  }
} else {
  // Non-owner sees raise hand button — completely hide owner section
  if (collabSection) collabSection.classList.remove('hidden');
  if (ownerCollabSection) {
    ownerCollabSection.classList.add('hidden');
    ownerCollabSection.innerHTML = '';
  }
}
    const ownerActions = isOwner ? `
      <div class="project-owner-actions">
        <button class="btn-edit" onclick="showEditForm()">
          Edit Project
        </button>
        <button class="btn-delete" onclick="handleDeleteProject()">
          Delete Project
        </button>
      </div>
    ` : '';

    const supportBadge = project.support_needed
      ? `<span class="card-support">Needs: ${project.support_needed}</span>`
      : '';

    document.getElementById('project-loading').classList.add('hidden');

    const content = document.getElementById('project-content');
    content.classList.remove('hidden');
    content.innerHTML = `
      <a href="/html/dashboard.html" class="back-link">← Back to Feed</a>
      <div class="card-accent ${stage}"></div>
      <div class="project-detail-body">
        <div class="project-detail-header">
          <span class="stage-badge ${stage}">${stageLabel(stage)}</span>
          ${ownerActions}
        </div>
        <div class="project-detail-title">${project.title}</div>
        <div class="project-detail-meta">
          <div class="card-avatar">${initials}</div>
          <div>
            <div class="project-detail-author">${username}</div>
            <div class="project-detail-time">
              ${timeAgo(project.created_at)}
            </div>
          </div>
        </div>
        <div class="project-detail-desc">${project.description}</div>
        ${supportBadge}
      </div>

      <!-- Edit Form (hidden by default) -->
      <div id="edit-form" class="edit-form hidden">
        <div class="edit-form-body">
          <h3 class="edit-form-title">Edit Project</h3>
          <div id="edit-alert" class="alert"></div>

          <div class="form-group">
            <label for="edit-title">Project Title</label>
            <input type="text" id="edit-title"
              value="${project.title}" />
          </div>

          <div class="form-group">
            <label for="edit-desc">Description</label>
            <textarea id="edit-desc" rows="4">${project.description}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="edit-stage">Stage</label>
              <select id="edit-stage">
                <option value="idea"
                  ${stage === 'idea' ? 'selected' : ''}>
                  Idea
                </option>
                <option value="in_progress"
                  ${stage === 'in_progress' ? 'selected' : ''}>
                  In Progress
                </option>
                <option value="completed"
                  ${stage === 'completed' ? 'selected' : ''}>
                  Completed
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="edit-support">Support Needed</label>
              <input type="text" id="edit-support"
                value="${project.support_needed || ''}"
                placeholder="e.g. Design, Backend..." />
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" onclick="hideEditForm()">
              Cancel
            </button>
            <button class="btn-primary"
              id="save-edit-btn"
              onclick="handleEditProject()"
              style="width:auto;padding:10px 24px">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    `;

    document.title = `${project.title} — MzansiBuilds`;

  } catch (err) {
    console.error('Load project error:', err);
    document.getElementById('project-loading').textContent =
      'Failed to load project.';
  }
};

// ─── Show / Hide Edit Form ────────────────────────────────────────────────────

/**
 * Shows the edit form below the project detail.
 */
const showEditForm = () => {
  document.getElementById('edit-form').classList.remove('hidden');
  document.getElementById('edit-form').scrollIntoView({ behavior: 'smooth' });
};

/**
 * Hides the edit form.
 */
const hideEditForm = () => {
  document.getElementById('edit-form').classList.add('hidden');
};

// ─── Edit Project ─────────────────────────────────────────────────────────────

/**
 * Handles the edit form submission.
 * Sends PUT request to update the project.
 */
const handleEditProject = async () => {
  const projectId = getProjectId();
  const token = getToken();
  const btn = document.getElementById('save-edit-btn');
  const alertEl = document.getElementById('edit-alert');

  const title = document.getElementById('edit-title')?.value?.trim();
  const description = document.getElementById('edit-desc')?.value?.trim();
  const stage = document.getElementById('edit-stage')?.value;
  const support_needed = document.getElementById('edit-support')?.value?.trim();

  // Validation
  if (!title || title.length < 3) {
    alertEl.textContent = 'Title must be at least 3 characters.';
    alertEl.className = 'alert error';
    return;
  }

  if (!description || description.length < 10) {
    alertEl.textContent = 'Description must be at least 10 characters.';
    alertEl.className = 'alert error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, stage, support_needed })
    });

    const data = await res.json();

    if (!res.ok) {
      alertEl.textContent = data.error || 'Failed to update project.';
      alertEl.className = 'alert error';
      return;
    }

    alertEl.textContent = 'Project updated successfully!';
    alertEl.className = 'alert success';

    // Reload project to show updated content
    setTimeout(async () => {
      hideEditForm();
      await loadProject(projectId);
    }, 1000);

  } catch (err) {
    alertEl.textContent = 'Network error. Please try again.';
    alertEl.className = 'alert error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  }
};

// ─── Delete Project ───────────────────────────────────────────────────────────

/**
 * Handles project deletion.
 * Asks for confirmation before deleting.
 * Redirects to dashboard after successful deletion.
 */
const handleDeleteProject = async () => {
  const confirmed = confirm(
    'Are you sure you want to delete this project? This cannot be undone.'
  );

  if (!confirmed) return;

  const projectId = getProjectId();
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to delete project.');
      return;
    }

    // Redirect to dashboard after deletion
    alert('Project deleted successfully.');
    window.location.href = '/html/dashboard.html';

  } catch (err) {
    alert('Network error. Please try again.');
  }
};

// ─── Load Milestones ──────────────────────────────────────────────────────────

/**
 * Loads and renders milestones for the project.
 *
 * @param {string} projectId - Project UUID
 */
const loadMilestones = async (projectId) => {
  try {
    const res = await fetch(`${API_URL}/milestones/${projectId}`);
    const milestones = await res.json();

    const container = document.getElementById('milestones-container');
    if (!container) return;

    if (!milestones || milestones.length === 0) {
      container.innerHTML = `
        <div class="no-comments">No milestones yet.</div>
      `;
      return;
    }

    container.innerHTML = milestones.map(renderMilestone).join('');

  } catch (err) {
    console.error('Load milestones error:', err);
  }
};

// ─── Render Milestone ─────────────────────────────────────────────────────────

/**
 * Renders a single milestone as HTML.
 *
 * @param {object} milestone - Milestone object from API
 * @returns {string} HTML string
 */
const renderMilestone = (milestone) => {
  const time = timeAgo(milestone.achieved_at);
  return `
    <div class="milestone-card">
      <div class="milestone-dot"></div>
      <div class="milestone-body">
        <div class="milestone-title">${milestone.title}</div>
        ${milestone.description
          ? `<div class="milestone-desc">${milestone.description}</div>`
          : ''}
        <div class="milestone-time">${time}</div>
      </div>
    </div>
  `;
};

// ─── Post Milestone ───────────────────────────────────────────────────────────

/**
 * Handles milestone form submission.
 */
const handlePostMilestone = async () => {
  const projectId = getProjectId();
  const title = document.getElementById('milestone-title')?.value?.trim();
  const description = document.getElementById('milestone-desc')?.value?.trim();
  const btn = document.getElementById('milestone-btn');
  const token = getToken();
  const alertEl = document.getElementById('milestone-alert');

  if (!title || title.length < 3) {
    alertEl.textContent = 'Milestone title must be at least 3 characters.';
    alertEl.className = 'alert error';
    return;
  }

  if (!token) {
    alertEl.textContent = 'You must be logged in to add a milestone.';
    alertEl.className = 'alert error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Adding...';

  try {
    const res = await fetch(`${API_URL}/milestones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ project_id: projectId, title, description })
    });

    const data = await res.json();

    if (!res.ok) {
      alertEl.textContent = data.error || 'Failed to add milestone.';
      alertEl.className = 'alert error';
      return;
    }

    document.getElementById('milestone-title').value = '';
    document.getElementById('milestone-desc').value = '';
    alertEl.className = 'alert';
    await loadMilestones(projectId);

  } catch (err) {
    alertEl.textContent = 'Network error. Please try again.';
    alertEl.className = 'alert error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Add Milestone';
  }
};

// ─── Load Comments ────────────────────────────────────────────────────────────

/**
 * Loads and renders comments for the project.
 *
 * @param {string} projectId - Project UUID
 */
const loadComments = async (projectId) => {
  try {
    const res = await fetch(`${API_URL}/comments/${projectId}`);
    const comments = await res.json();

    const container = document.getElementById('comments-container');

    if (!comments || comments.length === 0) {
      container.innerHTML = `
        <div class="no-comments">
          No comments yet. Be the first to comment!
        </div>
      `;
      return;
    }

    container.innerHTML = comments.map(renderComment).join('');

  } catch (err) {
    console.error('Load comments error:', err);
  }
};

// ─── Render Comment ───────────────────────────────────────────────────────────

/**
 * Renders a single comment card.
 *
 * @param {object} comment - Comment object from API
 * @returns {string} HTML string
 */
const renderComment = (comment) => {
  const username = comment.profiles?.username || 'Unknown';
  const initials = username.substring(0, 2).toUpperCase();
  const time = timeAgo(comment.created_at);

  return `
    <div class="comment-card">
      <div class="comment-avatar">${initials}</div>
      <div class="comment-body">
        <div class="comment-author">
          ${username}
          <span class="comment-time">${time}</span>
        </div>
        <div class="comment-content">${comment.content}</div>
      </div>
    </div>
  `;
};

// ─── Post Comment ─────────────────────────────────────────────────────────────

/**
 * Handles comment form submission.
 */
const handlePostComment = async () => {
  const projectId = getProjectId();
  const content = document.getElementById('comment-input')?.value?.trim();
  const btn = document.getElementById('comment-btn');
  const token = getToken();
  const alertEl = document.getElementById('comment-alert');

  if (!content || content.length < 2) {
    alertEl.textContent = 'Comment must be at least 2 characters.';
    alertEl.className = 'alert error';
    return;
  }

  if (!token) {
    alertEl.textContent = 'You must be logged in to comment.';
    alertEl.className = 'alert error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Posting...';

  try {
    const res = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ project_id: projectId, content })
    });

    const data = await res.json();

    if (!res.ok) {
      alertEl.textContent = data.error || 'Failed to post comment.';
      alertEl.className = 'alert error';
      return;
    }

    document.getElementById('comment-input').value = '';
    alertEl.className = 'alert';
    await loadComments(projectId);

  } catch (err) {
    alertEl.textContent = 'Network error. Please try again.';
    alertEl.className = 'alert error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Post Comment';
  }
};

// ─── Load Collaborations ──────────────────────────────────────────────────────

/**
 * Loads collaboration requests for the project.
 * Only visible to the project owner.
 *
 * @param {string} projectId - Project UUID
 */
const loadCollaborations = async (projectId) => {
  const container = document.getElementById('collaborations-container');
  if (!container) {
    console.log('No collaborations container found');
    return;
  }

  const token = getToken();
  console.log('Token for collab request:', token ? 'exists' : 'MISSING');

  if (!token) return;

  try {
    const url = `${API_URL}/collaborations/${projectId}`;
    console.log('Fetching collaborations from:', url);

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('Collaboration response status:', res.status);

    const collabs = await res.json();
    console.log('Collaborations data:', collabs);

    if (!res.ok) {
      console.error('Collab fetch failed:', collabs);
      container.innerHTML = `
        <div class="no-comments">Could not load requests: ${collabs.error}</div>
      `;
      return;
    }

    if (!collabs || collabs.length === 0) {
      container.innerHTML = `
        <div class="no-comments">No collaboration requests yet.</div>
      `;
      return;
    }

    // Show pending count
    const pending = collabs.filter(c => c.status === 'pending').length;
    const ownerTitle = document.querySelector(
      '#owner-collab-section .comments-title'
    );
    if (ownerTitle && pending > 0) {
      ownerTitle.innerHTML = `
        🤝 Collaboration Requests
        <span class="pending-badge">${pending} pending</span>
      `;
    }

    container.innerHTML = collabs.map(renderCollabRequest).join('');
    console.log('Collaborations rendered successfully');

  } catch (err) {
    console.error('Load collaborations error:', err);
    container.innerHTML = `
      <div class="no-comments">Failed to load requests.</div>
    `;
  }
};
// ─── Render Collaboration Request ─────────────────────────────────────────────

/**
 * Renders a single collaboration request card.
 * Shows accept/decline buttons for pending requests.
 *
 * @param {object} collab - Collaboration object from API
 * @returns {string} HTML string
 */
const renderCollabRequest = (collab) => {
  const username = collab.profiles?.username || 'Unknown';
  const initials = username.substring(0, 2).toUpperCase();
  const time = timeAgo(collab.created_at);

  const statusColors = {
    pending: '#ff9800',
    accepted: '#27ae60',
    declined: '#e74c3c'
  };

  const color = statusColors[collab.status] || '#888';

  const actions = collab.status === 'pending' ? `
    <div class="collab-actions">
      <button class="btn-collab-accept"
        onclick="handleCollabResponse('${collab.id}', 'accepted')">
        Accept
      </button>
      <button class="btn-collab-decline"
        onclick="handleCollabResponse('${collab.id}', 'declined')">
        Decline
      </button>
    </div>
  ` : '';

  return `
    <div class="collab-card">
      <div class="comment-avatar">${initials}</div>
      <div class="comment-body">
        <div class="comment-author">
          ${username}
          <span class="comment-time">${time}</span>
          <span class="collab-status" style="color:${color}">
            ${collab.status}
          </span>
        </div>
        ${collab.message
          ? `<div class="comment-content">${collab.message}</div>`
          : '<div class="comment-content" style="color:#aaa">No message provided</div>'
        }
        ${actions}
      </div>
    </div>
  `;
};

// ─── Handle Collaborate Button ────────────────────────────────────────────────

/**
 * Shows the collaboration request form.
 */
const showCollabForm = () => {
  const form = document.getElementById('collab-form');
  if (form) form.classList.toggle('hidden');
};

// ─── Send Collaboration Request ───────────────────────────────────────────────

/**
 * Sends a collaboration request to the project owner.
 */
const handleRequestCollaboration = async () => {
  const projectId = getProjectId();
  const message = document.getElementById('collab-message')?.value?.trim();
  const btn = document.getElementById('collab-submit-btn');
  const raiseBtn = document.querySelector('.btn-raise-hand');
  const token = getToken();
  const alertEl = document.getElementById('collab-alert');

  if (!token) {
    alertEl.textContent = 'You must be logged in to request collaboration.';
    alertEl.className = 'alert error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(`${API_URL}/collaborations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ project_id: projectId, message })
    });

    const data = await res.json();

    if (!res.ok) {
      alertEl.textContent = data.error || 'Failed to send request.';
      alertEl.className = 'alert error';
      return;
    }

    // Show success state
    alertEl.textContent = '✅ Hand raised! Your request has been sent to the developer.';
    alertEl.className = 'alert success';

    document.getElementById('collab-message').value = '';

    // Update raise hand button to show hand raised
    const raiseHandBtn = document.getElementById('raise-hand-btn');
    if (raiseHandBtn) {
      raiseHandBtn.textContent = '✋ Hand Raised';
      raiseHandBtn.disabled = true;
      raiseHandBtn.style.background = '#e8f5e9';
      raiseHandBtn.style.color = '#27ae60';
      raiseHandBtn.style.borderColor = '#27ae60';
    }

    // Hide form after success
    setTimeout(() => {
      document.getElementById('collab-form').classList.add('hidden');
    }, 2000);

  } catch (err) {
    alertEl.textContent = 'Network error. Please try again.';
    alertEl.className = 'alert error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Send Request';
  }
};

// ─── Accept / Decline Collaboration ──────────────────────────────────────────

/**
 * Handles accepting or declining a collaboration request.
 * Only callable by the project owner.
 *
 * @param {string} collabId - Collaboration UUID
 * @param {string} status - 'accepted' or 'declined'
 */
const handleCollabResponse = async (collabId, status) => {
  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/collaborations/${collabId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Failed to update request.');
      return;
    }

    // Reload collaborations to show updated status
    await loadCollaborations(getProjectId());

  } catch (err) {
    alert('Network error. Please try again.');
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────

/**
 * Initializes the project detail page.
 */
const initProjectDetail = async () => {
  requireAuth();

  const projectId = getProjectId();

  if (!projectId) {
    window.location.href = '/html/dashboard.html';
    return;
  }

  await loadProject(projectId);
  await loadMilestones(projectId);
  await loadComments(projectId);
};

document.addEventListener('DOMContentLoaded', initProjectDetail);