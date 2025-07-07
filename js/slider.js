/**
 * Weijden Multicare - Diensten Slider
 * Based on Center-Mode Productivity Slider
 */

(() => {
  const track = document.getElementById("track");
  if (!track) return; // Exit if slider track doesn't exist on this page

  const wrap = track.parentElement;
  const cards = Array.from(track.children);
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const dotsBox = document.getElementById("dots");

  const isMobile = () => matchMedia("(max-width:767px)").matches;

  // Create dots for navigation
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "slider-dot";
    dot.onclick = () => activate(i, true);
    dot.setAttribute('aria-label', `Ga naar dienst ${i + 1}`);
    dotsBox.appendChild(dot);
  });
  const dots = Array.from(dotsBox.children);

  let current = 0;

  /**
   * Center the specified card in view
   * @param {number} i - Index of card to center
   */
  function center(i) {
    const card = cards[i];
    const axis = isMobile() ? "top" : "left";
    const size = isMobile() ? "clientHeight" : "clientWidth";
    const start = isMobile() ? card.offsetTop : card.offsetLeft;
    
    wrap.scrollTo({
      [axis]: start - (wrap[size] / 2 - card[size] / 2),
      behavior: "smooth"
    });
  }

  /**
   * Update UI elements for the active card
   * @param {number} i - Index of active card
   */
  function toggleUI(i) {
    // Update card active states
    cards.forEach((c, k) => {
      if (k === i) {
        c.setAttribute('active', '');
      } else {
        c.removeAttribute('active');
      }
    });

    // Update dots
    dots.forEach((d, k) => d.classList.toggle("active", k === i));

    // Update navigation buttons
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
  }

  /**
   * Activate a specific card
   * @param {number} i - Index of card to activate
   * @param {boolean} scroll - Whether to scroll to center the card
   */
  function activate(i, scroll) {
    if (i === current) return;
    current = i;
    toggleUI(i);
    if (scroll) center(i);
  }

  /**
   * Navigate by step amount
   * @param {number} step - Number of steps to move (-1 or 1)
   */
  function go(step) {
    const newIndex = Math.min(Math.max(current + step, 0), cards.length - 1);
    activate(newIndex, true);
  }

  // Event listeners for navigation buttons
  if (prev) prev.onclick = () => go(-1);
  if (next) next.onclick = () => go(1);

  // Keyboard navigation
  addEventListener(
    "keydown",
    (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        go(1);
      }
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    },
    { passive: false }
  );

  // Mouse interactions
  cards.forEach((card, i) => {
    // Hover activation for desktop
    card.addEventListener(
      "mouseenter",
      () => {
        if (matchMedia("(hover:hover)").matches) {
          activate(i, true);
        }
      }
    );
    
    // Click activation
    card.addEventListener("click", () => activate(i, true));

    // Add keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Bekijk dienst: ${card.querySelector('.dienst-card__title').textContent}`);
    
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(i, true);
      }
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = touchEndTime - touchStartTime;
      
      // Only process swipes that are fast enough and long enough
      if (deltaTime < 500) {
        const minSwipeDistance = 50;
        
        if (isMobile()) {
          // Vertical swipes on mobile
          if (Math.abs(deltaY) > minSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)) {
            go(deltaY > 0 ? -1 : 1);
          }
        } else {
          // Horizontal swipes on desktop
          if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY)) {
            go(deltaX > 0 ? -1 : 1);
          }
        }
      }
    },
    { passive: true }
  );

  // Hide dots on mobile if needed
  if (window.matchMedia("(max-width:767px)").matches) {
    dotsBox.hidden = true;
  }

  // Handle window resize
  let resizeTimeout;
  addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      center(current);
      
      // Toggle dots visibility based on screen size
      if (window.matchMedia("(max-width:767px)").matches) {
        dotsBox.hidden = true;
      } else {
        dotsBox.hidden = false;
      }
    }, 150);
  });

  // Initialize
  toggleUI(0);
  center(0);

  // Add smooth animation class after initialization
  setTimeout(() => {
    track.classList.add('initialized');
  }, 100);

  // Intersection Observer for performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1
    });

    cards.forEach(card => observer.observe(card));
  }

  // Auto-play functionality (optional, can be enabled)
  let autoPlayInterval;
  const autoPlayDelay = 5000; // 5 seconds

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      const nextIndex = current === cards.length - 1 ? 0 : current + 1;
      activate(nextIndex, true);
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Auto-play controls (disabled by default)
  // Uncomment to enable auto-play
  /*
  startAutoPlay();

  // Pause auto-play on hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);

  // Pause auto-play on focus
  track.addEventListener('focusin', stopAutoPlay);
  track.addEventListener('focusout', startAutoPlay);
  */

  // Cleanup function
  window.addEventListener('beforeunload', () => {
    stopAutoPlay();
  });

})();