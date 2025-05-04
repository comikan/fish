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

function sendClientCommand(command, data) {
  return new Promise((resolve) => {
    const requestId = Math.random().toString(36).substring(7);
    
    const listener = (event) => {
      if (event.data.type === 'FISH_EXTENSION_RESPONSE' && 
          event.data.requestId === requestId) {
        window.removeEventListener('message', listener);
        resolve(event.data.data);
      }
    };
    
    window.addEventListener('message', listener);
    window.postMessage({
      type: 'FISH_EXTENSION_COMMAND',
      command,
      data,
      requestId
    }, '*');
  });
}

// Example usage:
async function getPlayerData() {
  try {
    const playerData = await sendClientCommand('GET_PLAYER_DATA');
    console.log('Fish: Player data', playerData);
    return playerData;
  } catch (e) {
    console.error('Fish: Failed to get player data', e);
    return null;
  }
}

// Enhance specific game UI
async function enhanceGameUI(placeId) {
  console.log(`Fish: Enhancing game UI for place ${placeId}`);
  
  // Example: Add custom UI elements
  const gameUI = document.querySelector('.game-ui-container');
  if (gameUI) {
    const fishPanel = document.createElement('div');
    fishPanel.className = 'fish-game-panel';
    fishPanel.innerHTML = `
      <div class="fish-panel-header">
        <h3>Fish Enhancement</h3>
        <div class="fish-place-id">Place ID: ${placeId}</div>
      </div>
      <div class="fish-panel-content"></div>
    `;
    gameUI.appendChild(fishPanel);
    
    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .fish-game-panel {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid rgba(0, 255, 255, 0.3);
        border-radius: 8px;
        padding: 10px;
        color: white;
        z-index: 1000;
        backdrop-filter: blur(5px);
      }
      .fish-panel-header {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 5px;
        margin-bottom: 5px;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Get player data and display it
  const playerData = await getPlayerData();
  if (playerData) {
    const content = document.querySelector('.fish-panel-content');
    if (content) {
      content.innerHTML = `
        <div>Player: ${playerData.Name}</div>
        <div>Health: ${playerData.Health}</div>
        <div>Position: ${JSON.stringify(playerData.Position)}</div>
      `;
    }
  }
}
