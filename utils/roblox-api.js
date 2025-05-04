export class AnimationOptimizer {
  constructor() {
    this.performanceMode = false;
    this.optimizedElements = new WeakSet();
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupMutationObserver();
    this.optimizeInitialAnimations();
  }

  loadSettings() {
    chrome.storage.sync.get(['performanceMode'], (result) => {
      this.performanceMode = result.performanceMode || false;
      if (this.performanceMode) {
        this.enablePerformanceMode();
      }
    });
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.optimizeDynamicContent(mutation.addedNodes);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  optimizeInitialAnimations() {
    this.optimizeAllAnimations();
    this.debounceScrollEvents();
    this.lazyLoadImages();
  }

  optimizeDynamicContent(nodes) {
    Array.from(nodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!this.optimizedElements.has(node)) {
          this.optimizeElementAnimations(node);
          this.optimizedElements.add(node);
        }
      }
    });
  }

  optimizeAllAnimations() {
    document.querySelectorAll('*').forEach(el => {
      if (!this.optimizedElements.has(el)) {
        this.optimizeElementAnimations(el);
        this.optimizedElements.add(el);
      }
    });
  }

  optimizeElementAnimations(element) {
    if (this.performanceMode) {
      // In performance mode, disable all animations
      element.style.animation = 'none !important';
      element.style.transition = 'none !important';
    } else {
      // Optimize animations for smooth performance
      if (element.style.animation) {
        element.style.willChange = 'transform, opacity';
        element.style.backfaceVisibility = 'hidden';
      }
      
      // Replace heavy animations with lighter alternatives
      this.replaceHeavyAnimations(element);
    }
  }

  replaceHeavyAnimations(element) {
    const computedStyle = getComputedStyle(element);
    const animationName = computedStyle.animationName;
    
    if (animationName && animationName !== 'none') {
      // Replace blur animations with opacity for better performance
      if (animationName.includes('blur') || computedStyle.filter.includes('blur')) {
        element.style.animation = '';
        element.style.filter = '';
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease';
      }
      
      // Replace complex 3D transforms with simpler 2D versions
      if (animationName.includes('3d') || computedStyle.transform.includes('3d')) {
        const newTransform = computedStyle.transform
          .replace(/rotate3d\([^)]+\)/g, '')
          .replace(/translate3d\([^)]+\)/g, (match) => {
            const values = match.match(/\d+/g);
            return `translate(${values[0]}px, ${values[1]}px)`;
          });
        element.style.transform = newTransform;
      }
    }
  }

  debounceScrollEvents() {
    const scrollHandler = () => {
      // Throttle scroll-heavy operations
    };
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  lazyLoadImages() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            observer.unobserve(img);
          }
        }
      });
    }, { rootMargin: '200px' });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      observer.observe(img);
    });
  }

  enablePerformanceMode() {
    this.performanceMode = true;
    document.documentElement.classList.add('fish-performance-mode');
    
    // Disable all animations
    document.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none !important';
      el.style.transition = 'none !important';
    });
    
    // Reduce visual effects
    document.querySelectorAll('img, video').forEach(media => {
      media.loading = 'lazy';
      if (!media.classList.contains('fish-essential-media')) {
        media.style.opacity = '1';
        media.style.filter = 'none';
      }
    });
    
    // Simplify UI elements
    document.querySelectorAll('.card, .game-tile').forEach(card => {
      card.style.boxShadow = 'none';
      card.style.borderRadius = '0';
    });
  }

  disablePerformanceMode() {
    this.performanceMode = false;
    document.documentElement.classList.remove('fish-performance-mode');
    
    // Restore animations
    this.optimizeAllAnimations();
    
    // Restore visual effects
    document.querySelectorAll('img, video').forEach(media => {
      media.style.opacity = '';
      media.style.filter = '';
    });
    
    // Restore UI elements
    document.querySelectorAll('.card, .game-tile').forEach(card => {
      card.style.boxShadow = '';
      card.style.borderRadius = '';
    });
  }

  togglePerformanceMode(enabled) {
    if (enabled) {
      this.enablePerformanceMode();
    } else {
      this.disablePerformanceMode();
    }
  }
}
