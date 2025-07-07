/**
 * Weijden Multicare - Dark/Light Mode Toggle
 * Smooth theme switching with localStorage persistence
 */

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.html = document.documentElement;
    this.storageKey = 'weijden-multicare-theme';
    this.themes = {
      LIGHT: 'light',
      DARK: 'dark'
    };
    
    this.init();
  }

  init() {
    this.setInitialTheme();
    this.bindEvents();
    this.updateToggleIcon();
  }

  setInitialTheme() {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme;
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = systemPrefersDark ? this.themes.DARK : this.themes.LIGHT;
    }
    
    this.setTheme(initialTheme, false);
  }

  bindEvents() {
    // Theme toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });

      // Keyboard support
      this.themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem(this.storageKey)) {
        this.setTheme(e.matches ? this.themes.DARK : this.themes.LIGHT, true);
      }
    });

    // Listen for storage changes (sync across tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey && e.newValue) {
        this.setTheme(e.newValue, true);
      }
    });
  }

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.themes.LIGHT ? this.themes.DARK : this.themes.LIGHT;
    this.setTheme(newTheme, true);
  }

  setTheme(theme, animate = true) {
    // Validate theme
    if (!Object.values(this.themes).includes(theme)) {
      console.warn(`Invalid theme: ${theme}. Using light theme.`);
      theme = this.themes.LIGHT;
    }

    // Add transition class for smooth animation
    if (animate) {
      this.html.classList.add('theme-transitioning');
      
      // Remove transition class after animation
      setTimeout(() => {
        this.html.classList.remove('theme-transitioning');
      }, 300);
    }

    // Set theme
    this.html.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem(this.storageKey, theme);
    
    // Update toggle icon
    this.updateToggleIcon();
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme, previousTheme: this.getCurrentTheme() }
    }));

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  getCurrentTheme() {
    return this.html.getAttribute('data-theme') || this.themes.LIGHT;
  }

  updateToggleIcon() {
    if (!this.themeToggle) return;
    
    const currentTheme = this.getCurrentTheme();
    const sunIcon = this.themeToggle.querySelector('.sun-icon');
    const moonIcon = this.themeToggle.querySelector('.moon-icon');
    
    if (currentTheme === this.themes.DARK) {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  updateMetaThemeColor(theme) {
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    
    // Set appropriate theme color based on current theme
    const colors = {
      [this.themes.LIGHT]: '#ffffff',
      [this.themes.DARK]: '#0a0a0a'
    };
    
    themeColorMeta.content = colors[theme];
  }

  // Public method to get theme
  getTheme() {
    return this.getCurrentTheme();
  }

  // Public method to check if dark mode
  isDarkMode() {
    return this.getCurrentTheme() === this.themes.DARK;
  }

  // Public method to set theme programmatically
  setThemeMode(theme) {
    this.setTheme(theme, true);
  }
}

// Add CSS for smooth theme transitions
const themeStyles = `
  <style>
    /* Theme transition styles */
    .theme-transitioning,
    .theme-transitioning *,
    .theme-transitioning *::before,
    .theme-transitioning *::after {
      transition: background-color 300ms ease, 
                  color 300ms ease, 
                  border-color 300ms ease,
                  box-shadow 300ms ease !important;
    }
    
    /* Prevent flash of unstyled content */
    html:not([data-theme]) {
      visibility: hidden;
    }
    
    html[data-theme] {
      visibility: visible;
    }
    
    /* Theme toggle button enhancements */
    .theme-toggle {
      position: relative;
      overflow: hidden;
    }
    
    .theme-toggle svg {
      transition: all 0.3s ease;
    }
    
    .theme-toggle:hover {
      transform: scale(1.1);
    }
    
    .theme-toggle:active {
      transform: scale(0.95);
    }
    
    /* Focus styles for accessibility */
    .theme-toggle:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
    
    /* Loading state for theme switch */
    .theme-switching {
      pointer-events: none;
    }
    
    /* Reduce motion for users who prefer it */
    @media (prefers-reduced-motion: reduce) {
      .theme-transitioning,
      .theme-transitioning *,
      .theme-transitioning *::before,
      .theme-transitioning *::after {
        transition: none !important;
      }
    }
  </style>
`;

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Inject styles
  document.head.insertAdjacentHTML('beforeend', themeStyles);
  
  // Initialize theme manager
  window.themeManager = new ThemeManager();
  
  // Make theme available globally for other scripts
  window.getTheme = () => window.themeManager.getTheme();
  window.isDarkMode = () => window.themeManager.isDarkMode();
  window.setTheme = (theme) => window.themeManager.setThemeMode(theme);
});

// Handle theme preference detection before DOM loads
(function() {
  // Prevent flash of wrong theme
  const savedTheme = localStorage.getItem('weijden-multicare-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', initialTheme);
})();