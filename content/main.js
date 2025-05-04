// Wait for Roblox page to load
function enhanceRoblox() {
  // Observe DOM changes for dynamic content
  const observer = new MutationObserver((mutations) => {
    applyEnhancements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial enhancement
  applyEnhancements();
}

function applyEnhancements() {
  // Load settings
  chrome.storage.sync.get(['uiEnhance', 'animations'], (data) => {
    const uiEnabled = data.uiEnhance !== false;
    const animationsEnabled = data.animations !== false;

    // Apply UI enhancements
    if (uiEnabled) {
      // Navigation bar enhancement
      const navBar = document.querySelector('.navbar-container');
      if (navBar) {
        navBar.style.backdropFilter = 'blur(10px)';
        navBar.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        navBar.style.transition = 'all 0.3s ease';
      }

      // Game cards enhancement
      const gameCards = document.querySelectorAll('.game-card');
      gameCards.forEach(card => {
        card.style.transform = 'perspective(1000px)';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'perspective(1000px) rotateX(5deg) scale(1.02)';
          card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0) scale(1)';
          card.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
      });
    }

    // Apply animations
    if (animationsEnabled) {
      // Add smooth transitions to buttons
      const buttons = document.querySelectorAll('button, .btn, [role="button"]');
      buttons.forEach(btn => {
        btn.style.transition = 'all 0.2s ease';
        
        btn.addEventListener('mousedown', () => {
          btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', () => {
          btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'scale(1)';
        });
      });

      // Page transition effect
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 100);
    }
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleUI" || request.action === "toggleAnimations") {
    applyEnhancements();
  }
});

// Start enhancement when page loads
if (document.readyState === 'complete') {
  enhanceRoblox();
} else {
  window.addEventListener('load', enhanceRoblox);
}
