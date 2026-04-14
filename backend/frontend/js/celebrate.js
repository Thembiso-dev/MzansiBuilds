/**
 * Celebration Wall Module
 *
 * Loads and renders all completed projects on the
 * celebration wall. Shows developers who have shipped.
 *
 * @module celebrate
 */

// ─── Time Helper ──────────────────────────────────────────────────────────────

/**
 * Formats a date to a readable string.
 *
 * @param {string} timestamp - ISO timestamp
 * @returns {string} formatted date
 */
const formatDate = (timestamp) => {
  if (!timestamp) return 'Recently';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// ─── Render Celebration Card ──────────────────────────────────────────────────

/**
 * Renders a single celebration card for a completed project.
 * Each card looks different based on its position — polymorphic rendering.
 *
 * @param {object} project - Completed project object
 * @param {number} index - Position in the list
 * @returns {string} HTML string
 */
const renderCelebrationCard = (project, index) => {
  const username = project.profiles?.username || 'Unknown';
  const initials = username.substring(0, 2).toUpperCase();
  const completedDate = formatDate(project.completed_at);

  // First 3 cards get a gold, silver, bronze accent
  const accents = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const accent = index < 3 ? accents[index] : '#27ae60';
  const medals = ['🥇', '🥈', '🥉'];
  const medal = index < 3 ? medals[index] : '🏆';

  return `
    <div class="celebration-card">
      <div class="celebration-accent"
        style="background: ${accent}"></div>
      <div class="celebration-body">
        <div class="celebration-medal">${medal}</div>
        <div class="celebration-content">
          <div class="celebration-header">
            <div class="card-avatar celebration-avatar">${initials}</div>
            <div>
              <div class="celebration-username">${username}</div>
              <div class="celebration-date">Shipped on ${completedDate}</div>
            </div>
          </div>
          <div class="celebration-project-title">${project.title}</div>
          <div class="celebration-project-desc">${project.description}</div>
          <div class="celebration-footer">
            <span class="stage-badge completed">Completed</span>
            <button class="card-action"
              onclick="window.location.href='/html/project.html?id=${project.id}'"
              style="margin-left: auto">
              View Project →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

// ─── Render Empty State ───────────────────────────────────────────────────────

/**
 * Renders the empty state when no projects are completed yet.
 *
 * @returns {string} HTML string
 */
const renderEmptyState = () => `
  <div class="celebrate-empty">
    <div style="font-size: 48px; margin-bottom: 16px">🌱</div>
    <h3>No completed projects yet</h3>
    <p>
      Be the first to ship your project and appear on the
      celebration wall!
    </p>
    <button class="btn-primary"
      style="width: auto; padding: 12px 28px; margin-top: 20px"
      onclick="window.location.href='/html/dashboard.html'">
      Go to Feed
    </button>
  </div>
`;

// ─── Load Celebration Wall ────────────────────────────────────────────────────

/**
 * Fetches completed projects from the API and renders them.
 * Also updates the stats bar with totals.
 */
const loadCelebrationWall = async () => {
  try {
    const res = await fetch(`${API_URL}/celebrate`);
    const projects = await res.json();

    console.log('Celebration wall loaded:', projects);

    if (!res.ok) {
      throw new Error(projects.error || 'Failed to load celebration wall');
    }

    const container = document.getElementById('celebrate-container');

    if (!projects || projects.length === 0) {
      container.innerHTML = renderEmptyState();
      return;
    }

    // Update stats
    const uniqueDevs = new Set(projects.map(p => p.user_id)).size;
    document.getElementById('total-shipped').textContent = projects.length;
    document.getElementById('total-devs').textContent = uniqueDevs;

    // Render cards
    container.innerHTML = projects
      .map((project, index) => renderCelebrationCard(project, index))
      .join('');

  } catch (err) {
    console.error('Celebration wall error:', err);
    document.getElementById('celebrate-container').innerHTML = `
      <div class="celebrate-empty">
        <h3>Could not load celebration wall</h3>
        <p>${err.message}</p>
      </div>
    `;
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────

/**
 * Initializes the celebration wall page.
 */
const initCelebrate = () => {
  requireAuth();
  loadCelebrationWall();
};

document.addEventListener('DOMContentLoaded', initCelebrate);