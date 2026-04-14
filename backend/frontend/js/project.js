/**
 * Project Module
 *
 * Handles project creation form on the dashboard.
 * API_URL is declared in auth.js which loads first.
 *
 * @module project
 */

// ─── Toggle Form ──────────────────────────────────────────────────────────────

/**
 * Toggles the new project form open and closed.
 */
const toggleProjectForm = () => {
  const form = document.getElementById('project-form');
  if (form) form.classList.toggle('hidden');
};

// ─── Show Form Alert ──────────────────────────────────────────────────────────

/**
 * Shows an alert message inside the project form.
 *
 * @param {string} message - Message to display
 * @param {string} type - 'error' or 'success'
 */
const showFormAlert = (message, type) => {
  const alertEl = document.getElementById('form-alert');
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.className = `alert ${type}`;
};

// ─── Create Project ───────────────────────────────────────────────────────────

/**
 * Handles project creation form submission.
 * Validates inputs, posts to API, refreshes feed on success.
 */
const handleCreateProject = async () => {
  const title = document.getElementById('proj-title')?.value?.trim();
  const description = document.getElementById('proj-desc')?.value?.trim();
  const stage = document.getElementById('proj-stage')?.value;
  const support_needed = document.getElementById('proj-support')?.value?.trim();
  const btn = document.getElementById('submit-project-btn');
  const token = getToken();

  // Client side validation
  if (!title || title.length < 3) {
    return showFormAlert('Title must be at least 3 characters.', 'error');
  }

  if (!description || description.length < 10) {
    return showFormAlert('Description must be at least 10 characters.', 'error');
  }

  if (!token) {
    return showFormAlert('You must be logged in to post a project.', 'error');
  }

  btn.disabled = true;
  btn.textContent = 'Posting...';

  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, stage, support_needed })
    });

    const data = await response.json();

    console.log('Create project response:', data);

    if (!response.ok) {
      return showFormAlert(data.error || 'Failed to create project.', 'error');
    }

    showFormAlert('Project posted successfully!', 'success');

    // Reset form fields
    document.getElementById('proj-title').value = '';
    document.getElementById('proj-desc').value = '';
    document.getElementById('proj-support').value = '';
    document.getElementById('proj-stage').value = 'idea';

    // Reload feed to show new project
    setTimeout(async () => {
      toggleProjectForm();
      await loadFeed();
    }, 1500);

  } catch (err) {
    console.error('Create project error:', err);
    showFormAlert('Network error. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Post Project';
  }
};