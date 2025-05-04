import { RobloxAPI } from './utils/roblox-api.js';
import { UIEnhancer } from './utils/ui-enhancer.js';
import { AnimationOptimizer } from './utils/animation-optimizer.js';

class FishExtension {
  constructor() {
    this.robloxAPI = new RobloxAPI();
    this.uiEnhancer = new UIEnhancer();
    this.animationOptimizer = new AnimationOptimizer();
    this.settings = {
      darkMode: true,
      enhancedUI: true,
      smoothAnimations: true,
      performanceMode: false,
      customTheme: null
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupMutationObserver();
    this.enhancePage();
    this.setupEventListeners();
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['fishSettings'], (result) => {
        if (result.fishSettings) {
          this.settings = { ...this.settings, ...result.fishSettings };
        }
        resolve();
      });
    });
  }

  saveSettings() {
    chrome.storage.sync.set({ fishSettings: this.settings });
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          this.handleDynamicContent(mutation.addedNodes);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  enhancePage() {
    if (this.settings.enhancedUI) {
      this.uiEnhancer.enhanceNavigation();
      this.uiEnhancer.enhanceGameCards();
      this.uiEnhancer.enhanceProfilePage();
      
      if (this.settings.darkMode) {
        this.uiEnhancer.enableDarkMode();
      }
      
      if (this.settings.customTheme) {
        this.uiEnhancer.applyCustomTheme(this.settings.customTheme);
      }
    }

    if (this.settings.smoothAnimations && !this.settings.performanceMode) {
      this.animationOptimizer.optimizeAllAnimations();
    }

    if (this.settings.performanceMode) {
      this.animationOptimizer.enablePerformanceMode();
    }

    this.robloxAPI.injectCustomFeatures();
  }

  handleDynamicContent(nodes) {
    Array.from(nodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (this.settings.enhancedUI) {
          this.uiEnhancer.enhanceDynamicElements(node);
        }
      }
    });
  }

  setupEventListeners() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'toggleDarkMode':
          this.settings.darkMode = request.value;
          this.uiEnhancer.toggleDarkMode(request.value);
          this.saveSettings();
          break;
        case 'togglePerformanceMode':
          this.settings.performanceMode = request.value;
          if (request.value) {
            this.animationOptimizer.enablePerformanceMode();
          } else {
            this.animationOptimizer.disablePerformanceMode();
          }
          this.saveSettings();
          break;
        case 'applyTheme':
          this.settings.customTheme = request.theme;
          this.uiEnhancer.applyCustomTheme(request.theme);
          this.saveSettings();
          break;
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new FishExtension());
} else {
  new FishExtension();
}
