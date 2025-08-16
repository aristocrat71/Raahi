export const updateThemeScript = `
  (function() {
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    document.documentElement.setAttribute(
      'data-theme',
      savedTheme || (prefersDark ? 'dark' : 'light')
    );
  })();
`;
