// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = '/main', 1000);
    } else {
      showMessage(result.error || 'Login failed', 'danger');
    }
  } catch (error) {
    showMessage('An error occurred', 'danger');
  }
});

// Signup Form
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Registration successful! Redirecting...', 'success');
      setTimeout(() => window.location.href = '/main', 1000);
    } else {
      showMessage(result.error || 'Registration failed', 'danger');
    }
  } catch (error) {
    showMessage('An error occurred', 'danger');
  }
});

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}
