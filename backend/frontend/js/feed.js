/**
 * Feed Module
 *
 * Handles fetching and rendering the live project feed.
 * Manages filtering by project stage.
 *
 * @module feed
 */



// Shared in-memory store — used by project.js too
window.allProjects = [];

// ─── Time Helper ──────────────────────────────────────────────────────────────

/**
 * Converts a timestamp to a human readable relative time.
 *
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} human readable time
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

// ─── Stage Label Helper ───────────────────────────────────────────────────────

/**
 * Returns display label for a project stage.
 * Polymorphic — returns different output based on stage value.
 *
 * @param {string} stage - The stage value
 * @returns {string} human readable label
 */
const stageLabel = (stage) => {
  const labels = {
    idea: 'Idea',
    in_progress: 'In Progress',
    completed: 'Completed'
  };
  return labels[stage] || 'Unknown';
};

// ─── Render Project Card ──────────────────────────────────────────────────────

/**
 * Renders a single project as an HTML card.
 * Appearance changes based on project stage (polymorphism).
 *
 * @param {object} project - Project object from API
 * @returns {string} HTML string
 */
const renderProjectCard = (project) => {
  const username = project.profiles?.username || 'Unknown';
  const initials = username.substring(0, 2).toUpperCase();
  const time = timeAgo(project.created_at);
  const stage = project.stage || 'idea';

  const supportBadge = project.support_needed
    ? `<span class="card-support">Needs: ${project.support_needed}</span>`
    : '';

  return `
    <div class="project-card" data-stage="${stage}" data-id="${project.id}">
      <div class="card-accent ${stage}"></div>
      <div class="card-body">
        <div class="card-header">
          <div class="card-meta">
            <div class="card-avatar">${initials}</div>
            <div>
              <div class="card-author">${username}</div>
              <div class="card-time">${time}</div>
            </div>
          </div>
          <span class="stage-badge ${stage}">${stageLabel(stage)}</span>
        </div>
        <div class="card-title">${project.title}</div>
        <div class="card-desc">${project.description}</div>
        ${supportBadge}
        <div class="card-footer">
          <button class="card-action"
            onclick="window.location.href='/html/project.html?id=${project.id}'">
            View Project
          </button>
          <span class="card-action-time">${time}</span>
        </div>
      </div>
    </div>
  `;
};

// ─── Render Feed ──────────────────────────────────────────────────────────────

/**
 * Renders all projects into the feed container.
 *
 * @param {Array} projects - Array of project objects
 */
const renderFeed = (projects) => {
  const container = document.getElementById('feed-container');
  if (!container) return;

  if (!projects || projects.length === 0) {
    container.innerHTML = `
      <div class="feed-empty">
        <h3>No projects yet</h3>
        <p>Be the first to share what you are building!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(renderProjectCard).join('');
};

// ─── Filter Feed ──────────────────────────────────────────────────────────────

/**
 * Filters the feed by stage using in-memory data.
 * No extra API call needed.
 *
 * @param {string} stage - Stage to filter by
 * @param {HTMLElement} tabEl - The clicked tab
 */
const filterFeed = (stage, tabEl) => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');

  const filtered = stage === 'all'
    ? window.allProjects
    : window.allProjects.filter(p => p.stage === stage);

  renderFeed(filtered);
};

// ─── Load Feed ────────────────────────────────────────────────────────────────

/**
 * Fetches all projects from the API and renders them.
 */
const loadFeed = async () => {
  const container = document.getElementById('feed-container');
  if (container) {
    container.innerHTML = '<div class="feed-loading">Loading projects...</div>';
  }

  try {
    const res = await fetch(`${API_URL}/projects`);
    const data = await res.json();

    console.log('Feed loaded:', data);

    if (!res.ok) throw new Error(data.error || 'Failed to load projects');

    window.allProjects = data;
    renderFeed(window.allProjects);

  } catch (err) {
    console.error('Feed error:', err);
    if (container) {
      container.innerHTML = `
        <div class="feed-empty">
          <h3>Could not load feed</h3>
          <p>${err.message}</p>
        </div>
      `;
    }
  }
};

// ─── Load Sidebar Profile ─────────────────────────────────────────────────────

/**
 * Loads current user info into the sidebar from localStorage.
 */
const loadSidebarProfile = () => {
  const user = getUser();
  if (!user) return;

  const username = user.username || user.email.split('@')[0];
  const initials = username.substring(0, 2).toUpperCase();

  const avatarEl = document.getElementById('sidebar-avatar');
  const nameEl = document.getElementById('sidebar-username');
  const bioEl = document.getElementById('sidebar-bio');

  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = username;
  if (bioEl) bioEl.textContent = `Welcome back, ${username}!`;
};

// ─── Init ─────────────────────────────────────────────────────────────────────

/**
 * Initializes the dashboard.
 * Checks auth, loads profile and feed.
 */
const initDashboard = () => {
  requireAuth();
  loadSidebarProfile();
  loadFeed();
};

document.addEventListener('DOMContentLoaded', initDashboard);