/**
 * Profile Module
 *
 * Handles loading and updating the developer profile page.
 * Shows profile info, skills, bio and the developer's projects.
 *
 * @module profile
 */

// ─── Time Helper ──────────────────────────────────────────────────────────────

/**
 * Formats a date to a readable string.
 *
 * @param {string} timestamp - ISO timestamp
 * @returns {string} formatted date
 */
const formatJoinDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long'
  });
};

// ─── Stage Label ──────────────────────────────────────────────────────────────

/**
 * Returns display label for a project stage.
 * Polymorphic — returns different output based on stage.
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

// ─── Load Profile ─────────────────────────────────────────────────────────────

/**
 * Loads the current user's profile from the API
 * and renders it on the page.
 */
const loadProfile = async () => {
  const token = getToken();
  const user = getUser();

  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const profile = await res.json();

    if (!res.ok) throw new Error(profile.error);

    // Render profile info
    const initials = profile.username
      ? profile.username.substring(0, 2).toUpperCase()
      : '?';

    const initialsEl = document.getElementById('profile-initials');
    const usernameEl = document.getElementById('profile-username');
    const emailEl = document.getElementById('profile-email');
    const joinedEl = document.getElementById('profile-joined');
    const bioEl = document.getElementById('profile-bio-display');
    const skillsEl = document.getElementById('profile-skills-display');

    if (initialsEl) initialsEl.textContent = initials;
    if (usernameEl) usernameEl.textContent = profile.username;
    if (emailEl) emailEl.textContent = user?.email || '';
    if (joinedEl) joinedEl.textContent = `Joined ${formatJoinDate(profile.created_at)}`;
    if (bioEl) {
      bioEl.textContent = profile.bio ||
        'No bio yet. Tell the community about yourself!';
    }

    // Render skills as tags
    if (skillsEl) {
      if (profile.skills && profile.skills.length > 0) {
        skillsEl.innerHTML = profile.skills
          .map(skill => `<span class="skill-tag">${skill}</span>`)
          .join('');
      } else {
        skillsEl.innerHTML = `
          <span style="color:#888;font-size:13px">
            No skills added yet.
          </span>
        `;
      }
    }

    // Pre-fill edit form
    const editUsername = document.getElementById('edit-username');
    const editBio = document.getElementById('edit-bio');
    const editSkills = document.getElementById('edit-skills');

    if (editUsername) editUsername.value = profile.username || '';
    if (editBio) editBio.value = profile.bio || '';
    if (editSkills) {
      editSkills.value = profile.skills ? profile.skills.join(', ') : '';
    }

  } catch (err) {
    console.error('Load profile error:', err);
  }
};

// ─── Load My Projects ─────────────────────────────────────────────────────────

/**
 * Loads all projects belonging to the current user.
 */
const loadMyProjects = async () => {
  const user = getUser();
  const container = document.getElementById('my-projects-container');

  try {
    const res = await fetch(`${API_URL}/projects`);
    const projects = await res.json();

    if (!res.ok) throw new Error(projects.error);

    // Filter to only show current user's projects
    const myProjects = projects.filter(p => p.user_id === user.id);

    if (myProjects.length === 0) {
      container.innerHTML = `
        <div class="feed-empty">
          <p>You have not posted any projects yet.</p>
          <button class="btn-primary"
            onclick="window.location.href='/html/dashboard.html'"
            style="width:auto;padding:10px 24px;margin-top:12px">
            Post Your First Project
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = myProjects.map(renderMyProject).join('');

  } catch (err) {
    console.error('Load my projects error:', err);
    container.innerHTML = `
      <div class="feed-empty">
        <p>Could not load your projects.</p>
      </div>
    `;
  }
};

// ─── Render My Project ────────────────────────────────────────────────────────

/**
 * Renders a compact project card for the profile page.
 *
 * @param {object} project - Project object
 * @returns {string} HTML string
 */
const renderMyProject = (project) => {
  const stage = project.stage || 'idea';
  return `
    <div class="my-project-card">
      <div class="card-accent ${stage}"></div>
      <div class="my-project-body">
        <div class="my-project-header">
          <div class="my-project-title">${project.title}</div>
          <span class="stage-badge ${stage}">${stageLabel(stage)}</span>
        </div>
        <div class="my-project-desc">${project.description}</div>
        <button class="card-action"
          onclick="window.location.href='/html/project.html?id=${project.id}'">
          View Project →
        </button>
      </div>
    </div>
  `;
};

// ─── Show / Hide Edit Form ────────────────────────────────────────────────────

/**
 * Shows the profile edit form.
 */
const showProfileForm = () => {
  const form = document.getElementById('profile-edit-form');
  if (form) {
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth' });
  }
};

/**
 * Hides the profile edit form.
 */
const hideProfileForm = () => {
  const form = document.getElementById('profile-edit-form');
  if (form) form.classList.add('hidden');
};

// ─── Update Profile ───────────────────────────────────────────────────────────

/**
 * Handles the profile update form submission.
 * Sends PUT request to update the profile.
 */
const handleUpdateProfile = async () => {
  const token = getToken();
  const btn = document.getElementById('save-profile-btn');
  const alertEl = document.getElementById('profile-alert');

  const username = document.getElementById('edit-username')?.value?.trim();
  const bio = document.getElementById('edit-bio')?.value?.trim();
  const skills = document.getElementById('edit-skills')?.value?.trim();

  if (!username || username.length < 2) {
    alertEl.textContent = 'Username must be at least 2 characters.';
    alertEl.className = 'alert error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, bio, skills })
    });

    const data = await res.json();

    if (!res.ok) {
      alertEl.textContent = data.error || 'Failed to update profile.';
      alertEl.className = 'alert error';
      return;
    }

    alertEl.textContent = 'Profile updated successfully!';
    alertEl.className = 'alert success';

    // Update localStorage with new username
    const user = getUser();
    if (user) {
      user.username = data.username;
      localStorage.setItem('mb_user', JSON.stringify(user));
    }

    // Reload profile to show updated info
    setTimeout(async () => {
      hideProfileForm();
      await loadProfile();
    }, 1000);

  } catch (err) {
    alertEl.textContent = 'Network error. Please try again.';
    alertEl.className = 'alert error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Profile';
  }
};

// ─── Delete Account ───────────────────────────────────────────────────────────

/**
 * Permanently deletes the current user's account.
 * Asks for confirmation before proceeding.
 * Clears session and redirects to landing page after deletion.
 */
const handleDeleteAccount = async () => {
  const confirmed = confirm(
    'Are you sure you want to delete your account?\n\n' +
    'This will permanently delete:\n' +
    '• Your profile\n' +
    '• All your projects\n' +
    '• All your comments\n' +
    '• All your milestones\n\n' +
    'This action CANNOT be undone.'
  );

  if (!confirmed) return;

  // Ask a second time for safety
  const doubleConfirmed = confirm(
    'Last chance — are you absolutely sure?\n\n' +
    'Type OK to permanently delete your account.'
  );

  if (!doubleConfirmed) return;

  const token = getToken();

  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Failed to delete account.');
      return;
    }

    // Clear session and redirect to landing page
    clearSession();
    alert('Your account has been deleted. Goodbye!');
    window.location.href = '/';

  } catch (err) {
    alert('Network error. Please try again.');
  }
};

// ─── Init ─────────────────────────────────────────────────────────────────────

/**
 * Initializes the profile page.
 */
const initProfile = () => {
  requireAuth();
  loadProfile();
  loadMyProjects();
};

document.addEventListener('DOMContentLoaded', initProfile);