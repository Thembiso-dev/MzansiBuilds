/**
 * Project Detail Module
 *
 * Handles loading and rendering a single project page
 * including comments. Reads project ID from the URL.
 *
 * @module projectDetail
 */

// Get project ID from URL query string
const getProjectId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
};

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

    const username = project.profiles?.username || 'Unknown';
    const initials = username.substring(0, 2).toUpperCase();
    const stage = project.stage || 'idea';
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
    `;

    document.title = `${project.title} — MzansiBuilds`;

  } catch (err) {
    console.error('Load project error:', err);
    document.getElementById('project-loading').textContent =
      'Failed to load project.';
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
 * Validates input, posts to API, refreshes comments on success.
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

    // Clear input and reload comments
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
  await loadComments(projectId);
};

document.addEventListener('DOMContentLoaded', initProjectDetail);