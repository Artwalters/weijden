// Temporary script to clean up old theme localStorage
(function() {
  // Remove old theme key if it exists
  if (localStorage.getItem('theme')) {
    // Get the old value
    const oldTheme = localStorage.getItem('theme');
    
    // If there's no new theme key, migrate the old value
    if (!localStorage.getItem('weijden-multicare-theme')) {
      localStorage.setItem('weijden-multicare-theme', oldTheme);
    }
    
    // Remove the old key
    localStorage.removeItem('theme');
    
    console.log('Migrated theme settings to new storage key');
  }
})();