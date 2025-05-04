// popup.js
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
    });
  });
  
  // Feature toggle animation
  const featureToggles = document.querySelectorAll('.feature-toggle');
  featureToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const checkbox = this.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      
      // Add animation class
      this.classList.add('toggle-animate');
      setTimeout(() => {
        this.classList.remove('toggle-animate');
      }, 300);
    });
  });
  
  // Load saved settings
  chrome.storage.sync.get(['fishSettings'], function(result) {
    if (result.fishSettings) {
      // Apply saved settings to UI
    }
  });
  
  // Save settings when changed
  document.querySelectorAll('.feature-toggle input').forEach(input => {
    input.addEventListener('change', function() {
      saveSettings();
    });
  });
  
  function saveSettings() {
    const settings = {
      uiModernization: document.querySelector('#ui-modernization').checked,
      // Add other settings
    };
    chrome.storage.sync.set({ fishSettings: settings });
  }
});
