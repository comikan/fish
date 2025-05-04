// This runs in the context of Roblox's client
(function() {
  'use strict';
  
  // Hook into Roblox's core functions
  const originalLoad = Roblox?.ClientLoader?.load;
  if (originalLoad) {
    Roblox.ClientLoader.load = function(...args) {
      console.log('Fish: Intercepting Roblox client load');
      
      // Add our custom styles to the client
      const style = document.createElement('style');
      style.textContent = `
        /* Custom Fish styles for Roblox client */
        .fish-enhanced {
          border: 1px solid rgba(0, 255, 255, 0.3) !important;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.2) !important;
        }
        
        .fish-highlight {
          animation: fish-pulse 2s infinite;
        }
        
        @keyframes fish-pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
      
      // Dispatch event that game is launching
      const placeId = args[0]?.placeId;
      window.dispatchEvent(new CustomEvent('Roblox.GameLaunched', {
        detail: { placeId }
      }));
      
      return originalLoad.apply(this, args);
    };
  }
  
  // Hook into Roblox's HTTP service
  const originalHttpRequest = Roblox?.Http?.request;
  if (originalHttpRequest) {
    Roblox.Http.request = function(options) {
      console.log('Fish: Intercepting Roblox HTTP request', options);
      
      // Add custom headers to all requests
      options.headers = options.headers || {};
      options.headers['X-Fish-Extension'] = 'true';
      
      // Example: Modify certain requests
      if (options.url.includes('inventory')) {
        options.url += (options.url.includes('?') ? '&' : '?') + 'fishEnhanced=true';
      }
      
      return originalHttpRequest(options);
    };
  }
  
  // Listen for messages from the extension
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    
    if (event.data.type === 'FISH_EXTENSION_COMMAND') {
      switch (event.data.command) {
        case 'ENHANCE_UI':
          enhanceClientUI();
          break;
        case 'GET_PLAYER_DATA':
          const player = Roblox?.PlayerService?.GetLocalPlayer();
          window.postMessage({
            type: 'FISH_EXTENSION_RESPONSE',
            requestId: event.data.requestId,
            data: player
          }, '*');
          break;
      }
    }
  });
  
  function enhanceClientUI() {
    // Example: Add enhancement class to important UI elements
    document.querySelectorAll('.main-button, .icon-btn').forEach(btn => {
      btn.classList.add('fish-enhanced');
    });
    
    // Example: Highlight premium items
    document.querySelectorAll('.item-container[data-is-premium="true"]').forEach(item => {
      item.classList.add('fish-highlight');
    });
  }
  
  console.log('Fish: Roblox client injection complete');
})();
