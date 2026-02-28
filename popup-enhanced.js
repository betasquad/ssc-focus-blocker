/**
 * Enhanced popup.js - Quick access controls and status display
 * Manages user interactions and communicates with background script
 */

// DOM Elements
const elements = {
  statusText: document.getElementById('statusText'),
  toggleButton: document.getElementById('toggleButton'),
  blockButton: document.getElementById('blockButton'),
  unblockButton: document.getElementById('unblockButton'),
  optionsButton: document.getElementById('optionsButton'),
  dashboardButton: document.getElementById('dashboardButton'),
  currentDomain: document.getElementById('currentDomain'),
  blockedCount: document.getElementById('blockedCount'),
};

/**
 * Initialize popup on open
 */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadStatus();
    setupEventListeners();
  } catch (error) {
    console.error('Popup initialization error:', error);
    showError('Error loading popup');
  }
});

/**
 * Load and display extension status
 */
async function loadStatus() {
  try {
    const response = await sendMessage({ type: 'getStatus' });
    
    if (response.success) {
      const status = response.data;
      updateStatusUI(status);
      
      const currentTab = await getCurrentTab();
      if (currentTab) {
        updateDomainUI(currentTab.url, status.blockedDomains);
      }
    }
  } catch (error) {
    console.error('Error loading status:', error);
    showError('Failed to load status');
  }
}

/**
 * Send message to background script
 * @param {Object} message - Message to send
 * @returns {Promise}
 */
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Get current active tab
 * @returns {Promise}
 */
function getCurrentTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

/**
 * Update status UI based on extension state
 * @param {Object} status - Status object
 */
function updateStatusUI(status) {
  if (elements.statusText) {
    elements.statusText.textContent = status.isEnabled ? 'Enabled' : 'Disabled';
    elements.statusText.className = status.isEnabled ? 'enabled' : 'disabled';
  }

  if (elements.blockedCount) {
    elements.blockedCount.textContent = `${status.blockedCount || 0} sites blocked`;
  }
}

/**
 * Update domain UI based on current tab
 * @param {string} url - Current tab URL
 * @param {Array} blockedDomains - List of blocked domains
 */
function updateDomainUI(url, blockedDomains = []) {
  try {
    const domain = new URL(url).hostname;
    if (elements.currentDomain) {
      elements.currentDomain.textContent = domain;
    }

    const isBlocked = blockedDomains.includes(domain);
    updateBlockButtons(isBlocked);
  } catch (error) {
    console.error('Error updating domain UI:', error);
    if (elements.currentDomain) {
      elements.currentDomain.textContent = 'N/A';
    }
    disableBlockButtons();
  }
}

/**
 * Update block/unblock button visibility
 * @param {boolean} isBlocked - Whether domain is blocked
 */
function updateBlockButtons(isBlocked) {
  if (isBlocked) {
    if (elements.blockButton) elements.blockButton.style.display = 'none';
    if (elements.unblockButton) elements.unblockButton.style.display = 'block';
  } else {
    if (elements.blockButton) elements.blockButton.style.display = 'block';
    if (elements.unblockButton) elements.unblockButton.style.display = 'none';
  }
}

/**
 * Disable block buttons
 */
function disableBlockButtons() {
  if (elements.blockButton) elements.blockButton.disabled = true;
  if (elements.unblockButton) elements.unblockButton.disabled = true;
}

/**
 * Setup event listeners for buttons
 */
function setupEventListeners() {
  if (elements.toggleButton) {
    elements.toggleButton.addEventListener('click', handleToggle);
  }

  if (elements.blockButton) {
    elements.blockButton.addEventListener('click', handleBlockCurrent);
  }

  if (elements.unblockButton) {
    elements.unblockButton.addEventListener('click', handleUnblockCurrent);
  }

  if (elements.optionsButton) {
    elements.optionsButton.addEventListener('click', openOptions);
  }

  if (elements.dashboardButton) {
    elements.dashboardButton.addEventListener('click', openDashboard);
  }
}

/**
 * Handle toggle button click
 */
async function handleToggle() {
  try {
    const response = await sendMessage({ type: 'toggleExtension' });
    if (response.success) {
      showSuccess(response.data.message);
      await loadStatus();
    }
  } catch (error) {
    console.error('Toggle error:', error);
    showError('Error toggling extension');
  }
}

/**
 * Handle block current domain
 */
async function handleBlockCurrent() {
  try {
    const tab = await getCurrentTab();
    if (!tab) return;

    const domain = new URL(tab.url).hostname;
    const response = await sendMessage({ type: 'blockSite', domain });

    if (response.success) {
      showSuccess(`${domain} blocked`);
      await loadStatus();
    } else {
      showError(response.error || 'Error blocking domain');
    }
  } catch (error) {
    console.error('Block error:', error);
    showError('Error blocking domain');
  }
}

/**
 * Handle unblock current domain
 */
async function handleUnblockCurrent() {
  try {
    const tab = await getCurrentTab();
    if (!tab) return;

    const domain = new URL(tab.url).hostname;
    const response = await sendMessage({ type: 'unblockSite', domain });

    if (response.success) {
      showSuccess(`${domain} unblocked`);
      await loadStatus();
    } else {
      showError(response.error || 'Error unblocking domain');
    }
  } catch (error) {
    console.error('Unblock error:', error);
    showError('Error unblocking domain');
  }
}

/**
 * Open options page
 */
function openOptions() {
  chrome.runtime.openOptionsPage();
}

/**
 * Open dashboard page
 */
function openDashboard() {
  chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
}

/**
 * Show success notification
 * @param {string} message - Success message
 */
function showSuccess(message) {
  showNotification(message, 'success');
}

/**
 * Show error notification
 * @param {string} message - Error message
 */
function showError(message) {
  showNotification(message, 'error');
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error)
 */
function showNotification(message, type = 'info') {
  const div = document.createElement('div');
  div.className = `notification ${type}`;
  div.textContent = message;
  document.body.appendChild(div);

  setTimeout(() => {
    div.style.opacity = '0';
    setTimeout(() => div.remove(), 300);
  }, 2000);
}