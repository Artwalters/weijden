/**
 * Weijden Multicare - GSAP Page Transitions & Animations
 * Smooth page transitions and scroll-triggered animations
 */

class PageTransitions {
  constructor() {
    this.isTransitioning = false;
    this.loader = document.getElementById('loader');
    
    this.init();
  }

  init() {
    // Hide all content initially for smooth loading
    this.hideContentOnLoad();
    this.initGSAP();
    this.setupPageTransitions();
    this.setupScrollAnimations();
    this.hideLoader();
  }

  hideContentOnLoad() {
    // Only hide content if GSAP is available, otherwise rely on CSS
    if (typeof gsap !== 'undefined') {
      gsap.set('.header', { opacity: 0, y: -80 });
      gsap.set('.main-content', { opacity: 0, y: 30 });
    }
  }

  initGSAP() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded. Animations will be disabled.');
      return;
    }

    // Register ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Set default GSAP settings
    gsap.defaults({
      duration: 0.6,
      ease: "power2.out"
    });
  }

  hideLoader() {
    if (!this.loader) return;

    // Force hide loader after exactly 1.5 seconds for consistency
    const forceHide = () => {
      this.loader.style.opacity = '0';
      this.loader.style.visibility = 'hidden';
      this.loader.style.pointerEvents = 'none';
      setTimeout(() => {
        this.loader.style.display = 'none';
      }, 300);
      this.animatePageIn();
    };

    // Show loader for 1.5 seconds, then smoothly transition
    setTimeout(() => {
      // Animate loader out slower for better timing
      if (typeof gsap !== 'undefined') {
        gsap.to(this.loader, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            this.loader.style.display = 'none';
            // Start page animation immediately after loader disappears
            this.animatePageIn();
          }
        });
      } else {
        // Fallback without GSAP
        this.loader.classList.add('hidden');
        setTimeout(() => {
          this.loader.style.display = 'none';
          this.animatePageIn();
        }, 400);
      }
    }, 1500);

    // Emergency fallback - force hide loader after 3 seconds
    setTimeout(() => {
      if (this.loader && this.loader.style.display !== 'none') {
        this.loader.style.display = 'none';
        this.animatePageIn();
      }
    }, 3000);
  }

  animatePageIn() {
    if (typeof gsap === 'undefined') return;

    // Ensure page starts completely hidden/white
    gsap.set('.header', { y: -80, opacity: 0 });
    gsap.set('.main-content', { opacity: 0, y: 30 });
    gsap.set('body', { backgroundColor: 'var(--bg-primary)' });

    // Start animations right after loader disappears for seamless transition
    const tl = gsap.timeline({ delay: 0.1 });

    // Step 1: Header slides in smoothly
    tl.to('.header', {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })
    // Step 2: Main content fades in gently
    .to('.main-content', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out"
    }, "-=0.4");

    // Step 3: Hero section elements animate in sequence
    if (document.querySelector('.hero')) {
      tl.from('.hero-title span', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      }, "-=0.3")
      .from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .from('.hero-cta .btn', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.3")
      .from('.hero-visual > div', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "back.out(1.2)"
      }, "-=0.5");
    }

    // Step 4: Page title animation for other pages (gentler)
    if (document.querySelector('.page-title')) {
      tl.from('.page-title', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.5")
      .from('.page-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.6");
    }

    // Step 5: Service cards or other content (gentle stagger)
    if (document.querySelector('.service-card, .services-grid .service-card')) {
      tl.from('.service-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.4");
    }
  }

  setupPageTransitions() {
    // Intercept navigation links for smooth transitions
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      
      if (!link || 
          this.isTransitioning ||
          link.hostname !== window.location.hostname ||
          link.target === '_blank' ||
          link.href.includes('#') ||
          link.href.includes('tel:') ||
          link.href.includes('mailto:')) {
        return;
      }

      e.preventDefault();
      this.navigateToPage(link.href);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      if (!this.isTransitioning) {
        this.navigateToPage(window.location.href, false);
      }
    });
  }

  navigateToPage(url, pushState = true) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;

    if (typeof gsap !== 'undefined') {
      // Show loader first
      this.loader.style.display = 'flex';
      this.loader.style.opacity = '0';
      this.loader.style.visibility = 'visible';

      // Smooth transition timeline
      const tl = gsap.timeline({
        onComplete: () => {
          if (pushState) {
            window.history.pushState({}, '', url);
          }
          window.location.href = url;
        }
      });

      // Step 1: Fade out content smoothly
      tl.to('.main-content', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.inOut"
      })
      // Step 2: Slide header out
      .to('.header', {
        y: -100,
        opacity: 0.7,
        duration: 0.4,
        ease: "power2.inOut"
      }, "-=0.3")
      // Step 3: Fade in loader smoothly
      .to(this.loader, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2");

    } else {
      // Fallback without GSAP
      this.loader.style.display = 'flex';
      document.body.style.opacity = '0.7';
      setTimeout(() => {
        if (pushState) {
          window.history.pushState({}, '', url);
        }
        window.location.href = url;
      }, 300);
    }
  }

  setupScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    // Disable heavy animations on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      return; // Skip scroll animations on mobile
    }

    // Service cards animation
    gsap.utils.toArray('.service-card').forEach(card => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Stats counter animation
    gsap.utils.toArray('.stat-number').forEach(stat => {
      const endValue = parseInt(stat.getAttribute('data-count'));
      
      ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
          gsap.from(stat, {
            innerText: 0,
            duration: 2,
            snap: { innerText: 1 },
            ease: "power2.out",
            onUpdate: function() {
              stat.innerText = Math.floor(this.targets()[0].innerText);
            }
          });
        }
      });
    });

    // Info cards animation
    gsap.utils.toArray('.info-card').forEach((card, index) => {
      gsap.from(card, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // Footer animation
    if (document.querySelector('.footer')) {
      gsap.from('.footer', {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.footer',
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });
    }

    // Parallax effect for hero shapes
    if (document.querySelector('.hero-visual')) {
      gsap.utils.toArray('.hero-shape-1, .hero-shape-2, .hero-shape-3').forEach((shape, index) => {
        gsap.to(shape, {
          y: -50 * (index + 1),
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "none"
        });

        gsap.to(shape, {
          y: 100 * (index + 1),
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        });
      });
    }

    // Smooth reveal animations for slider cards
    if (document.querySelector('.dienst-card')) {
      gsap.utils.toArray('.dienst-card').forEach((card, index) => {
        gsap.from(card, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }

    // Refresh ScrollTrigger on resize (throttled for performance)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  // Public method to refresh animations
  refresh() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Public method to animate element
  animateElement(element, animation = {}) {
    if (typeof gsap === 'undefined') return;

    const defaults = {
      duration: 0.6,
      ease: "power2.out"
    };

    return gsap.to(element, { ...defaults, ...animation });
  }
}

// Utility functions for other scripts
window.animateElement = (element, animation) => {
  if (window.pageTransitions) {
    return window.pageTransitions.animateElement(element, animation);
  }
};

window.refreshAnimations = () => {
  if (window.pageTransitions) {
    window.pageTransitions.refresh();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.pageTransitions = new PageTransitions();
});

// Handle theme changes to update animations
window.addEventListener('themechange', () => {
  if (window.pageTransitions) {
    setTimeout(() => {
      window.pageTransitions.refresh();
    }, 300);
  }
});