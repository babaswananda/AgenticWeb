const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings
  getSetting: (key, defaultValue) => ipcRenderer.invoke('get-setting', key, defaultValue),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),

  // File operations
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),

  // External links
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Protocol operations
  onInitializeProtocol: (callback) => ipcRenderer.on('initialize-protocol', callback),
  onParseWebsiteRequest: (callback) => ipcRenderer.on('parse-website-request', callback),
  onOfflineModeChanged: (callback) => ipcRenderer.on('offline-mode-changed', callback),

  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// Expose Agentic Web specific APIs
contextBridge.exposeInMainWorld('agenticWeb', {
  // Version info
  version: process.env.npm_package_version || '1.0.0',
  platform: process.platform,
  
  // Offline capabilities
  isOffline: () => !navigator.onLine,
  
  // Local storage wrapper for protocol data
  protocol: {
    store: (key, data) => {
      try {
        localStorage.setItem(`agentic_${key}`, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('Failed to store protocol data:', error);
        return false;
      }
    },
    
    retrieve: (key) => {
      try {
        const data = localStorage.getItem(`agentic_${key}`);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Failed to retrieve protocol data:', error);
        return null;
      }
    },
    
    remove: (key) => {
      try {
        localStorage.removeItem(`agentic_${key}`);
        return true;
      } catch (error) {
        console.error('Failed to remove protocol data:', error);
        return false;
      }
    }
  },

  // AI capabilities for offline mode
  ai: {
    // Placeholder for local AI model integration
    isAvailable: () => false, // Will be true when local AI is implemented
    
    summarize: async (text) => {
      // Placeholder for local AI summarization
      return `Summary: ${text.substring(0, 100)}...`;
    },
    
    enhance: async (content) => {
      // Placeholder for local AI content enhancement
      return {
        ...content,
        ai_enhanced: true,
        ai_summary: `AI Enhanced: ${content.content_text?.substring(0, 50)}...`
      };
    }
  },

  // Crypto/Protocol utilities
  crypto: {
    // Placeholder for crypto operations
    generateHandle: () => {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${result}.agentic`;
    },
    
    validateHandle: (handle) => {
      return /^[a-z0-9]+\.agentic$/.test(handle);
    }
  }
});

// Add desktop-specific styling
document.addEventListener('DOMContentLoaded', () => {
  // Add desktop class to body for specific styling
  document.body.classList.add('desktop-app');
  
  // Handle window controls on Windows/Linux
  if (process.platform !== 'darwin') {
    document.body.classList.add('non-darwin');
  }
  
  // Add offline indicator
  const updateOnlineStatus = () => {
    document.body.classList.toggle('offline', !navigator.onLine);
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
});
