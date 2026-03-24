
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  document.addEventListener('DOMContentLoaded', () => {
    const icon = savedTheme === 'dark' ? '☀️' : '🌙';
    document.querySelectorAll('.theme-toggle').forEach(b => b.textContent = icon);
  });
