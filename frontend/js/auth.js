/**
 * Auth Module
 *
 * Handles all frontend authentication logic including
 * registration, login, logout and token management.
 * Communicates with the backend auth API.
 *
 * @module auth
 */

const API_URL = 'http://localhost:5000/api';

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Displays an alert message on the auth forms.
 *
 * @param {string} message - The message to display
 * @param {string} type - 'error' or 'success'
 */
const showAlert = (message, type) => {
  const alertBox = document.getElementById('alert-box');
  if (!alertBox) return;
  alertBox.textContent = message;
  alertBox.className = `alert ${type}`;
};

/**
 * Saves the JWT token and user info to localStorage.
 *
 * @param {string} token - The JWT access token
 * @param {object} user - The user object from the API
 */
const saveSession = (token, user) => {
  localStorage.setItem('mb_token', token);
  localStorage.setItem('mb_user', JSON.stringify(user));
};

/**
 * Retrieves the stored JWT token from localStorage.
 *
 * @returns {string|null} The token or null if not found
 */
const getToken = () => localStorage.getItem('mb_token');

/**
 * Retrieves the stored user object from localStorage.
 *
 * @returns {object|null} The user object or null
 */
const getUser = () => {
  const user = localStorage.getItem('mb_user');
  return user ? JSON.parse(user) : null;
};

/**
 * Clears the session from localStorage on logout.
 */
const clearSession = () => {
  localStorage.removeItem('mb_token');
  localStorage.removeItem('mb_user');
};

/**
 * Redirects to login if user is not authenticated.
 * Call this at the top of any protected page.
 */
const requireAuth = () => {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
  }
};

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Handles the registration form submission.
 * Validates inputs, calls the API, redirects on success.
 */
const handleRegister = async () => {
  const username = document.getElementById('username')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const password = document.getElementById('password')?.value;
  const btn = document.getElementById('register-btn');

  // Client-side validation
  if (!username || !email || !password) {
    return showAlert('All fields are required.', 'error');
  }

  if (password.length < 6) {
    return showAlert('Password must be at least 6 characters.', 'error');
  }

  // Disable button to prevent double submission
  btn.disabled = true;
  btn.textContent = 'Creating account...';

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return showAlert(data.error || 'Registration failed.', 'error');
    }

    showAlert('Account created! Redirecting to login...', 'success');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);

  } catch (err) {
    showAlert('Network error. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Handles the login form submission.
 * Validates inputs, calls the API, saves session and redirects on success.
 */
const handleLogin = async () => {
  const email = document.getElementById('email')?.value?.trim();
  const password = document.getElementById('password')?.value;
  const btn = document.getElementById('login-btn');

  // Client-side validation
  if (!email || !password) {
    return showAlert('Email and password are required.', 'error');
  }

  // Disable button to prevent double submission
  btn.disabled = true;
  btn.textContent = 'Logging in...';

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return showAlert(data.error || 'Login failed.', 'error');
    }

    // Save session to localStorage
    saveSession(data.token, data.user);

    showAlert('Login successful! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (err) {
    showAlert('Network error. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Login';
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Logs out the current user.
 * Clears session and redirects to login page.
 */
const handleLogout = async () => {
  const token = getToken();

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    clearSession();
    window.location.href = 'login.html';
  }
};