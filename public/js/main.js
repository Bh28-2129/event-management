// Check authentication
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      window.location.href = '/';
      return;
    }
    const data = await response.json();
    document.getElementById('userName').textContent = `Hello, ${data.user.name}`;
  } catch (error) {
    window.location.href = '/';
  }
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
  }
});

checkAuth();
