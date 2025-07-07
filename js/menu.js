/**
 * Weijden Multicare - Navigation Menu Component
 * Modern responsive navigation with smooth animations
 */

class NavigationMenu {
  constructor() {
    this.header = document.getElementById('header');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isMenuOpen = false;
    this.scrollThreshold = 100;
    this.lastScrollY = 0;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
    this.setActiveLink();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMenu();
      });
    }

    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.closeMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && 
          !this.navMenu.contains(e.target) && 
          !this.navToggle.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Escape key to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
        this.navToggle.focus();
      }
    });

    // Scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Resize events
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    });

    // Focus management for accessibility
    this.setupFocusTrap();
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isMenuOpen = true;
    this.navToggle.classList.add('active');
    this.navMenu.classList.add('active');
    document.body.classList.add('menu-open');
    
    // Set aria attributes
    this.navToggle.setAttribute('aria-expanded', 'true');
    this.navMenu.setAttribute('aria-hidden', 'false');
    
    // Focus first menu item
    const firstLink = this.navMenu.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }

    // Animate menu items
    this.animateMenuItems(true);
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.navToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    
    // Set aria attributes
    this.navToggle.setAttribute('aria-expanded', 'false');
    this.navMenu.setAttribute('aria-hidden', 'true');

    // Animate menu items
    this.animateMenuItems(false);
  }

  animateMenuItems(show) {
    const items = this.navMenu.querySelectorAll('.nav-item');
    
    if (window.gsap) {
      if (show) {
        gsap.fromTo(items, 
          { 
            opacity: 0, 
            y: 20 
          },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.3, 
            stagger: 0.1,
            ease: "power2.out"
          }
        );
      }
    } else {
      // Fallback for when GSAP is not available
      items.forEach((item, index) => {
        if (show) {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, index * 100);
        } else {
          item.style.opacity = '';
          item.style.transform = '';
        }
      });
    }
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for styling
    if (currentScrollY > this.scrollThreshold) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    // Hide/show header on scroll direction (disabled on mobile)
    if (window.innerWidth > 768 && Math.abs(currentScrollY - this.lastScrollY) > 10) {
      if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
        // Scrolling down
        this.header.classList.add('header-hidden');
      } else {
        // Scrolling up
        this.header.classList.remove('header-hidden');
      }
      this.lastScrollY = currentScrollY;
    } else if (window.innerWidth <= 768) {
      // Ensure header is always visible on mobile
      this.header.classList.remove('header-hidden');
    }

    // Update active link based on scroll position
    this.updateActiveLink();
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const linkPath = link.getAttribute('href');
      
      if (linkPath === currentPage || 
          (currentPage === '' && linkPath === 'index.html') ||
          (currentPage === 'index.html' && linkPath === '../index.html')) {
        link.classList.add('active');
      }
    });
  }

  updateActiveLink() {
    // Only update if we're on a page with sections to scroll to
    if (!document.querySelector('section[id]')) return;

    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset for header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to corresponding link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  setupFocusTrap() {
    // Get all focusable elements in the menu
    const focusableElements = this.navMenu.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.navMenu.addEventListener('keydown', (e) => {
      if (!this.isMenuOpen) return;
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  // Public method to refresh menu state
  refresh() {
    this.setActiveLink();
  }

  // Public method to close menu programmatically
  close() {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.navigationMenu = new NavigationMenu();
});

// Add CSS for mobile menu states
const menuStyles = `
  <style>
    /* Mobile Menu Styles */
    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 80px;
        left: 0;
        width: 100%;
        height: calc(100vh - 80px);
        background: var(--bg-primary);
        backdrop-filter: blur(20px);
        transform: translateX(-100%);
        transition: transform var(--transition-base);
        z-index: var(--z-modal);
        padding: var(--space-2xl) var(--space-lg);
        overflow-y: auto;
      }
      
      .nav-menu.active {
        transform: translateX(0);
      }
      
      .nav-list {
        flex-direction: column;
        gap: var(--space-lg);
        align-items: flex-start;
      }
      
      .nav-link {
        font-size: var(--font-size-lg);
        padding: var(--space-sm) 0;
        width: 100%;
        border-bottom: 1px solid var(--border-color);
      }
      
      .nav-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all var(--transition-base);
      }
      
      .nav-menu.active .nav-item {
        opacity: 1;
        transform: translateY(0);
      }
      
      .nav-toggle {
        display: flex;
      }
      
      .menu-open {
        overflow: hidden;
      }
      
      /* Header hide on scroll */
      .header-hidden {
        transform: translateY(-100%);
      }
      
      .header {
        transition: transform var(--transition-base);
      }
    }
    
    @media (min-width: 769px) {
      .nav-toggle {
        display: none;
      }
      
      .nav-menu {
        position: static;
        background: transparent;
        backdrop-filter: none;
        transform: none;
        height: auto;
        width: auto;
        padding: 0;
      }
    }
  </style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', menuStyles);