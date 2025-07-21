/**
 * Weijden Multicare - Main JavaScript
 * Core functionality and utilities
 */

// WebP Detection - Add 'webp' class to HTML element if supported
(function() {
  const webP = new Image();
  webP.onload = webP.onerror = function() {
    if (webP.height === 2) {
      document.documentElement.classList.add('webp');
    }
  };
  webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
})();

class WeijdenMulticare {
  constructor() {
    this.isInitialized = false;
    this.components = {};
    
    // EmailJS Configuration
    this.emailJSConfig = {
      publicKey: 'xWTP2b06khXRsP1K8',
      serviceId: 'service_x1k0ond',
      templateId: 'template_sn6ip4e'
    };
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // Initialize EmailJS
    this.initializeEmailJS();
    
    this.setupGlobalEventListeners();
    this.initializeComponents();
    this.setupSmoothScroll();
    this.setupFormHandling();
    this.setupPartnersSlider();
    this.setupPerformanceOptimizations();
    
    this.isInitialized = true;
    
    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('weijdenmulticare:ready'));
  }

  initializeEmailJS() {
    // Initialize EmailJS with public key
    if (typeof emailjs !== 'undefined') {
      emailjs.init(this.emailJSConfig.publicKey);
    }
  }

  setupGlobalEventListeners() {
    // Handle external links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Handle form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.classList.contains('contact-form')) {
        this.handleContactForm(e);
      }
    });

    // Keyboard navigation improvements
    document.addEventListener('keydown', (e) => {
      // Skip to main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 100);
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handlePageHidden();
      } else {
        this.handlePageVisible();
      }
    });
  }

  initializeComponents() {
    // Initialize scroll to top button
    this.initScrollToTop();
    
    // Initialize lazy loading
    this.initLazyLoading();
    
    // Initialize tooltips
    this.initTooltips();
    
    // Initialize contact info
    this.initContactInfo();
  }

  initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15L12 9L6 15"/>
      </svg>
    `;
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border: none;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
      transform: scale(0);
      opacity: 0;
      box-shadow: var(--shadow-lg);
    `;

    document.body.appendChild(scrollButton);

    // Show/hide based on scroll position
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 300;
          if (shouldShow) {
            scrollButton.style.transform = 'scale(1)';
            scrollButton.style.opacity = '1';
          } else {
            scrollButton.style.transform = 'scale(0)';
            scrollButton.style.opacity = '0';
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // Handle click
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    this.components.scrollToTop = scrollButton;
  }

  initLazyLoading() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      this.components.imageObserver = imageObserver;
    }
  }

  initTooltips() {
    // Simple tooltip implementation
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.dataset.tooltip);
      });

      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: var(--bg-dark);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      z-index: 1070;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);

    this.components.activeTooltip = tooltip;
  }

  hideTooltip() {
    if (this.components.activeTooltip) {
      this.components.activeTooltip.remove();
      this.components.activeTooltip = null;
    }
  }

  initContactInfo() {
    // Add click-to-call functionality
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        // Analytics tracking could go here
        console.log('Phone number clicked:', link.href);
      });
    });

    // Add click-to-email functionality
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        // Analytics tracking could go here
        console.log('Email clicked:', link.href);
      });
    });
  }

  setupSmoothScroll() {
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Update URL without jumping
        history.pushState(null, null, `#${targetId}`);
      }
    });
  }

  setupFormHandling() {
    // Form validation utilities
    this.validators = {
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      phone: (value) => /^[\+]?[\d\s\-\(\)]{10,}$/.test(value),
      required: (value) => value.trim().length > 0
    };
  }

  handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    const errors = this.validateForm(data);
    if (errors.length > 0) {
      this.showFormErrors(form, errors);
      return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span>Verzenden...</span>';
    submitButton.disabled = true;

    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
      console.error('EmailJS is not loaded');
      this.showFormError(form, 'Er is een technische fout opgetreden. Probeer het later opnieuw.');
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      return;
    }

    // Send email using EmailJS
    emailjs.sendForm(this.emailJSConfig.serviceId, this.emailJSConfig.templateId, form)
      .then(() => {
        // Success
        this.showFormSuccess(form);
        form.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      })
      .catch((error) => {
        // Error
        console.error('EmailJS error:', error);
        this.showFormError(form, 'Er is een fout opgetreden bij het verzenden. Probeer het opnieuw of neem telefonisch contact op.');
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      });
  }

  validateForm(data) {
    const errors = [];
    
    if (!this.validators.required(data.name || '')) {
      errors.push('Naam is verplicht');
    }
    
    if (!this.validators.required(data.email || '')) {
      errors.push('E-mail is verplicht');
    } else if (!this.validators.email(data.email)) {
      errors.push('Ongeldig e-mailadres');
    }
    
    if (!this.validators.required(data.message || '')) {
      errors.push('Bericht is verplicht');
    }
    
    return errors;
  }

  showFormErrors(form, errors) {
    // Remove existing error messages
    form.querySelectorAll('.form-error').forEach(error => error.remove());
    
    // Show errors
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    `;
    errorContainer.innerHTML = errors.map(error => `<div>• ${error}</div>`).join('');
    
    form.appendChild(errorContainer);
  }

  showFormSuccess(form) {
    // Remove existing messages
    form.querySelectorAll('.form-error, .form-success').forEach(msg => msg.remove());
    
    // Show success message
    const successContainer = document.createElement('div');
    successContainer.className = 'form-success';
    successContainer.style.cssText = `
      color: var(--primary);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      padding: 1rem;
      background: var(--bg-accent);
      border-radius: 0.5rem;
    `;
    successContainer.textContent = 'Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.';
    
    form.appendChild(successContainer);
  }

  showFormError(form, message) {
    // Remove existing messages
    form.querySelectorAll('.form-error, .form-success').forEach(msg => msg.remove());
    
    // Show error message
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.style.cssText = `
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      padding: 1rem;
      background: #f8d7da;
      border-radius: 0.5rem;
      border: 1px solid #f5c6cb;
    `;
    errorContainer.textContent = message;
    
    form.appendChild(errorContainer);
  }

  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Setup intersection observers for performance
    this.setupIntersectionObservers();
  }

  preloadCriticalResources() {
    // Preload critical CSS
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = font;
      document.head.appendChild(link);
    });
  }

  setupIntersectionObservers() {
    // Observe sections for analytics
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.id || entry.target.className;
            console.log('Section viewed:', sectionName);
            // Analytics tracking could go here
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
      });
    }
  }

  handleResize() {
    // Refresh components on resize
    if (window.refreshAnimations) {
      window.refreshAnimations();
    }
    
    // Update viewport height for mobile
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }

  handlePageHidden() {
    // Pause animations or videos when page is hidden
    document.querySelectorAll('video').forEach(video => {
      if (!video.paused) {
        video.pause();
        video.dataset.wasPlaying = 'true';
      }
    });
  }

  handlePageVisible() {
    // Resume paused content when page becomes visible
    document.querySelectorAll('video[data-was-playing]').forEach(video => {
      video.play();
      delete video.dataset.wasPlaying;
    });
  }

  // Public API methods
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--primary);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      z-index: 1080;
      box-shadow: var(--shadow-lg);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    if (type === 'error') {
      notification.style.background = '#dc3545';
    } else if (type === 'success') {
      notification.style.background = 'var(--primary)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  scrollToElement(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset + rect.top - offset;
    
    window.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
  }

  setupPartnersSlider() {
    // Disabled: Using scroll-based animation instead
    // The scroll-based partners animation is handled in the page-specific JavaScript
    console.log('Partners slider disabled - using scroll-based animation');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.weijdenMulticare = new WeijdenMulticare();
  
});

// Export utilities for global use
window.showNotification = (message, type) => {
  if (window.weijdenMulticare) {
    window.weijdenMulticare.showNotification(message, type);
  }
};

window.scrollToElement = (element, offset) => {
  if (window.weijdenMulticare) {
    window.weijdenMulticare.scrollToElement(element, offset);
  }
};