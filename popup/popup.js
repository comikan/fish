document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.sync.get(['uiEnhance', 'animations'], (data) => {
    document.getElementById('ui-enhance').checked = data.uiEnhance !== false;
    document.getElementById('animations').checked = data.animations !== false;
  });

  // Save settings when toggled
  document.getElementById('ui-enhance').addEventListener('change', (e) => {
    chrome.storage.sync.set({ uiEnhance: e.target.checked });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "toggleUI", value: e.target.checked});
    });
  });

  document.getElementById('animations').addEventListener('change', (e) => {
    chrome.storage.sync.set({ animations: e.target.checked });
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "toggleAnimations", value: e.target.checked});
    });
  });

  // Advanced settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    // Implement advanced settings logic
  });
});
