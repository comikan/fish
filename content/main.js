// Enhanced version with Roblox API access and client injection
const ROBLOX_API_BASE = 'https://api.roblox.com/';
const ROBLOX_ECONOMY_API = 'https://economy.roblox.com/';

// Inject our script into the Roblox client
function injectScript() {
  try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('injection/robloxInject.js');
    script.onload = function() {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  } catch (e) {
    console.error('Fish extension injection failed:', e);
  }
}

// Intercept Roblox API requests
function setupAPIInterceptors() {
  const originalFetch = window.fetch;
  
  window.fetch = async function(...args) {
    const [input, init] = args;
    const url = typeof input === 'string' ? input : input.url;
    
    // Modify API requests as needed
    if (url.includes('roblox.com/')) {
      // Example: Add custom headers to requests
      const modifiedInit = init || {};
      modifiedInit.headers = {
        ...modifiedInit.headers,
        'X-Fish-Extension': 'true',
        'X-Fish-Version': '1.0.0'
      };
      
      // Process response
      try {
        const response = await originalFetch(input, modifiedInit);
        if (response.ok) {
          const data = await response.clone().json();
          
          // Example: Enhance user data responses
          if (url.includes('/users/') && data) {
            data.fishEnhanced = true;
            return new Response(JSON.stringify(data), {
              status: response.status,
              headers: response.headers
            });
          }
        }
        return response;
      } catch (e) {
        console.error('Fish API intercept error:', e);
        return originalFetch(...args);
      }
    }
    return originalFetch(...args);
  };
}

// Access Roblox APIs directly
class RobloxAPI {
  static async getUserInfo(userId) {
    try {
      const response = await fetch(`${ROBLOX_API_BASE}users/${userId}`);
      return await response.json();
    } catch (e) {
      console.error('Fish: Failed to get user info', e);
      return null;
    }
  }

  static async getAssetInfo(assetId) {
    try {
      const response = await fetch(`${ROBLOX_API_BASE}marketplace/productinfo?assetId=${assetId}`);
      return await response.json();
    } catch (e) {
      console.error('Fish: Failed to get asset info', e);
      return null;
    }
  }

  static async getGroupFunds(groupId) {
    try {
      const response = await fetch(`${ROBLOX_ECONOMY_API}v1/groups/${groupId}/currency`);
      return await response.json();
    } catch (e) {
      console.error('Fish: Failed to get group funds', e);
      return null;
    }
  }
}

// Main enhancement function
async function enhanceRoblox() {
  // Inject into Roblox client
  injectScript();
  
  // Setup API interceptors
  setupAPIInterceptors();
  
  // Apply UI enhancements
  applyEnhancements();
  
  // Add event listeners for Roblox client events
  window.addEventListener('Roblox.GameLaunched', (e) => {
    console.log('Fish: Game launched', e.detail);
    enhanceGameUI(e.detail.placeId);
  });
  
  // Example: Enhance the current page based on URL
  if (window.location.href.includes('games')) {
    enhanceGamesPage();
  } else if (window.location.href.includes('catalog')) {
    enhanceCatalogPage();
  }
  
  // Expose API to the page
  window.FishExtension = {
    version: '1.0.0',
    API: RobloxAPI,
    enhance: applyEnhancements
  };
}

// Start enhancement when page loads
if (document.readyState === 'complete') {
  enhanceRoblox();
} else {
  window.addEventListener('load', enhanceRoblox);
  document.addEventListener('DOMContentLoaded', enhanceRoblox);
}
