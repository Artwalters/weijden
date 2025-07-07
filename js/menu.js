/**
 * Modern Navigation Menu with GSAP Animations
 * Weijden Multicare - Advanced Menu System
 */

class ModernMenu {
  constructor() {
    this.header = document.getElementById('main-header');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    this.themeToggle = document.getElementById('theme-toggle');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    this.isMenuOpen = false;
    this.lastScrollY = 0;
    this.scrollDirection = 'up';
    
    this.init();
  }

  init() {
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupThemeToggle();
    this.setupNavAnimations();
    this.setupActiveStates();
    this.setupScrollSpy();
    this.animateMenuOnLoad();
  }

  animateMenuOnLoad() {
    // Simplified load animation - no hiding/showing of logo and theme toggle
    const navItems = document.querySelectorAll('.nav-item');
    gsap.from(navItems, {
      y: -20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.05,
      delay: 0.2
    });
  }

  setupScrollEffects() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Update scroll direction
      this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
      this.lastScrollY = currentScrollY;

      // Add scrolled class for backdrop effect
      if (currentScrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      // Auto-close mobile menu when scrolling
      if (this.isMenuOpen && Math.abs(currentScrollY - this.lastScrollY) > 10) {
        this.closeMobileMenu();
      }

      // Header scroll hide/show disabled - keeping menu always visible
      // clearTimeout(scrollTimeout);
      // scrollTimeout = setTimeout(() => {
      //   if (this.scrollDirection === 'down' && currentScrollY > 200 && !this.isMenuOpen) {
      //     gsap.to(this.header, {
      //       y: -100,
      //       duration: 0.3,
      //       ease: "power2.out"
      //     });
      //     this.header.classList.add('hidden');
      //   } else if (this.scrollDirection === 'up' || currentScrollY <= 200) {
      //     gsap.to(this.header, {
      //       y: 0,
      //       duration: 0.3,
      //       ease: "power2.out"
      //     });
      //     this.header.classList.remove('hidden');
      //   }
      // }, 100);
    });
  }

  setupMobileMenu() {
    if (!this.mobileMenuBtn || !this.mobileMenuOverlay) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking overlay
    this.mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === this.mobileMenuOverlay) {
        this.closeMobileMenu();
      }
    });

    // Close menu when clicking mobile nav links
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => {
          this.closeMobileMenu();
        }, 300);
      });
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    this.mobileMenuOverlay.classList.add('active');
    document.body.classList.add('mobile-menu-open');

    // Animate mobile menu items
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    gsap.from(mobileNavItems, {
      x: -50,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.08,
      delay: 0.2
    });

    // Animate icons
    const mobileNavIcons = document.querySelectorAll('.mobile-nav-icon');
    gsap.from(mobileNavIcons, {
      scale: 0,
      rotation: -180,
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.05,
      delay: 0.4
    });
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    this.mobileMenuOverlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');
  }

  setupThemeToggle() {
    if (!this.themeToggle) return;

    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Animate theme transition
    gsap.to(this.themeToggle, {
      scale: 0.8,
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animate theme icons
        const lightIcon = document.querySelector('.theme-icon--light');
        const darkIcon = document.querySelector('.theme-icon--dark');
        
        if (newTheme === 'dark') {
          gsap.to(lightIcon, { rotation: -180, scale: 0.8, opacity: 0, duration: 0.3 });
          gsap.to(darkIcon, { rotation: 0, scale: 1, opacity: 1, duration: 0.3 });
        } else {
          gsap.to(darkIcon, { rotation: 180, scale: 0.8, opacity: 0, duration: 0.3 });
          gsap.to(lightIcon, { rotation: 0, scale: 1, opacity: 1, duration: 0.3 });
        }
      }
    });

    // Create theme transition effect
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: ${newTheme === 'dark' ? '#0f172a' : '#ffffff'};
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
    `;
    
    document.body.appendChild(overlay);
    
    gsap.to(overlay, {
      opacity: 0.3,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        overlay.remove();
      }
    });
  }

  setupNavAnimations() {
    // Desktop nav link hover animations
    this.navLinks.forEach(link => {
      const indicator = link.querySelector('.nav-indicator');
      const text = link.querySelector('.nav-text');
      
      link.addEventListener('mouseenter', () => {
        if (!link.classList.contains('nav-link--cta')) {
          gsap.to(text, {
            y: -2,
            duration: 0.2,
            ease: "power2.out"
          });
          
          gsap.to(indicator, {
            scaleX: 1.2,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('nav-link--cta')) {
          gsap.to(text, {
            y: 0,
            duration: 0.2,
            ease: "power2.out"
          });
          
          gsap.to(indicator, {
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

      // Click animation
      link.addEventListener('click', () => {
        gsap.to(link, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      });
    });

    // Mobile nav link animations
    this.mobileNavLinks.forEach(link => {
      const icon = link.querySelector('.mobile-nav-icon');
      
      link.addEventListener('click', () => {
        gsap.to(icon, {
          scale: 1.3,
          rotation: 360,
          duration: 0.4,
          ease: "back.out(1.7)"
        });
      });
    });
  }

  setupActiveStates() {
    const currentPath = window.location.pathname;
    
    // Set active state for current page
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (this.isCurrentPage(href, currentPath)) {
        link.classList.add('active');
      }
    });
    
    this.mobileNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (this.isCurrentPage(href, currentPath)) {
        link.classList.add('active');
      }
    });
  }

  isCurrentPage(href, currentPath) {
    if (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/index.html'))) {
      return true;
    }
    return currentPath.endsWith(href);
  }

  setupScrollSpy() {
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        const headerHeight = this.header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        gsap.to(window, {
          scrollTo: targetPosition,
          duration: 1,
          ease: "power2.out"
        });
        
        // Update URL
        history.pushState(null, null, `#${targetId}`);
      }
    });
  }

  // Public methods
  showHeader() {
    gsap.to(this.header, {
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    this.header.classList.remove('hidden');
  }

  hideHeader() {
    gsap.to(this.header, {
      y: -100,
      duration: 0.3,
      ease: "power2.out"
    });
    this.header.classList.add('hidden');
  }

  refreshAnimations() {
    // Refresh GSAP animations on resize
    ScrollTrigger.refresh();
  }
}

// Initialize menu when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for GSAP to load
  if (typeof gsap !== 'undefined') {
    window.modernMenu = new ModernMenu();
    
    // Refresh animations on resize
    window.addEventListener('resize', () => {
      if (window.modernMenu) {
        window.modernMenu.refreshAnimations();
      }
    });
  } else {
    console.warn('GSAP not loaded. Menu animations disabled.');
  }
});

// Export for global access
window.ModernMenu = ModernMenu;