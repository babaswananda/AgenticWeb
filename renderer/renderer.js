// Agentic Web Desktop Renderer
class AgenticWebRenderer {
    constructor() {
        this.isOfflineMode = false;
        this.currentContent = null;
        
        this.init();
    }

    async init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize offline status
        this.updateOfflineStatus();
        
        // Load saved settings
        await this.loadSettings();
        
        // Set version info
        document.getElementById('versionInfo').textContent = `v${window.agenticWeb?.version || '1.0.0'}`;
    }

    setupEventListeners() {
        // Button event listeners
        document.getElementById('startDemoBtn').addEventListener('click', () => this.startDemo());
        document.getElementById('parseUrlBtn').addEventListener('click', () => this.parseWebsite());
        document.getElementById('offlineModeBtn').addEventListener('click', () => this.toggleOfflineMode());
        document.getElementById('initProtocolBtn').addEventListener('click', () => this.initializeProtocol());
        document.getElementById('parseWebsiteBtn').addEventListener('click', () => this.parseWebsite());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());

        // Online/offline status
        window.addEventListener('online', () => this.updateOfflineStatus());
        window.addEventListener('offline', () => this.updateOfflineStatus());

        // Electron IPC listeners
        if (window.electronAPI) {
            window.electronAPI.onInitializeProtocol(() => this.initializeProtocol());
            window.electronAPI.onParseWebsiteRequest(() => this.parseWebsite());
            window.electronAPI.onOfflineModeChanged((event, isOffline) => {
                this.isOfflineMode = isOffline;
                this.updateOfflineStatus();
            });
        }

        // Handle external links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.href.startsWith('http')) {
                e.preventDefault();
                if (window.electronAPI) {
                    window.electronAPI.openExternal(e.target.href);
                } else {
                    window.open(e.target.href, '_blank');
                }
            }
        });
    }

    async loadSettings() {
        if (window.electronAPI) {
            this.isOfflineMode = await window.electronAPI.getSetting('offlineMode', false);
        }
    }

    updateOfflineStatus() {
        const isOnline = navigator.onLine && !this.isOfflineMode;
        const statusDot = document.getElementById('connectionStatus');
        const statusText = document.getElementById('connectionText');
        
        if (isOnline) {
            statusDot.classList.remove('offline');
            statusText.textContent = 'Connected';
            document.body.classList.remove('offline');
        } else {
            statusDot.classList.add('offline');
            statusText.textContent = this.isOfflineMode ? 'Offline Mode' : 'Disconnected';
            document.body.classList.add('offline');
        }
    }

    async startDemo() {
        this.showLoading();
        
        try {
            // Load demo content
            const demoContent = await this.loadDemoContent();
            this.renderChatStream(demoContent);
        } catch (error) {
            console.error('Failed to start demo:', error);
            this.showError('Failed to load demo content');
        }
    }

    async parseWebsite() {
        const url = prompt('Enter website URL to parse:', 'https://example.com');
        if (!url) return;

        this.showLoading();
        
        try {
            const content = await this.parseWebsiteContent(url);
            this.renderChatStream(content);
        } catch (error) {
            console.error('Failed to parse website:', error);
            this.showError('Failed to parse website');
        }
    }

    async toggleOfflineMode() {
        this.isOfflineMode = !this.isOfflineMode;
        
        if (window.electronAPI) {
            await window.electronAPI.setSetting('offlineMode', this.isOfflineMode);
        }
        
        this.updateOfflineStatus();
        
        // Update button text
        const btn = document.getElementById('offlineModeBtn');
        btn.innerHTML = this.isOfflineMode ? 
            '<span>🌐</span><span>Online Mode</span>' : 
            '<span>💾</span><span>Offline Mode</span>';
    }

    initializeProtocol() {
        // Generate a demo handle
        const handle = window.agenticWeb?.crypto?.generateHandle() || 'demo.agentic';
        
        alert(`🚀 Protocol Initialized!\n\nYour Handle: ${handle}\n\nYou can now access:\n• AI Agent deployment\n• .CryptoCard integration\n• Fugio Protocol staking\n• VibeCoder IDE\n• ForkD terminal`);
        
        document.getElementById('protocolStatus').textContent = 'Initialized';
    }

    showSettings() {
        // Create a simple settings modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="background: #111; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%;">
                <h2 style="margin-bottom: 1rem; color: var(--accent);">Settings</h2>
                <div style="margin-bottom: 1rem;">
                    <label style="display: flex; align-items: center; gap: 8px; color: var(--platinum);">
                        <input type="checkbox" ${this.isOfflineMode ? 'checked' : ''} id="offlineToggle">
                        Offline Mode
                    </label>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button id="cancelSettings" style="padding: 8px 16px; background: transparent; border: 1px solid var(--neural-blue); color: var(--neural-blue); border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button id="saveSettings" style="padding: 8px 16px; background: var(--neural-blue); color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle modal events
        modal.querySelector('#cancelSettings').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#saveSettings').addEventListener('click', async () => {
            const offlineToggle = modal.querySelector('#offlineToggle');
            this.isOfflineMode = offlineToggle.checked;
            
            if (window.electronAPI) {
                await window.electronAPI.setSetting('offlineMode', this.isOfflineMode);
            }
            
            this.updateOfflineStatus();
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showLoading() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('chatStreamContent').style.display = 'none';
        document.getElementById('loadingScreen').style.display = 'flex';
    }

    showError(message) {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'flex';
        alert(`Error: ${message}`);
    }

    async loadDemoContent() {
        // Simulate loading demo content
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return [
            {
                id: 1,
                type: 'header',
                content: '<h1>🚀 Welcome to Agentic Web Desktop</h1><p>Experience the future of AI-powered web interaction</p>'
            },
            {
                id: 2,
                type: 'content',
                content: '<p>This desktop application brings the power of the Agentic Web directly to your computer, with offline capabilities and enhanced AI integration.</p>'
            },
            {
                id: 3,
                type: 'feature',
                content: '<div style="background: rgba(0, 212, 255, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(0, 212, 255, 0.3);"><h3>🤖 Offline AI Processing</h3><p>Process content locally without internet connection</p></div>'
            }
        ];
    }

    async parseWebsiteContent(url) {
        // Simulate parsing website content
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return [
            {
                id: 1,
                type: 'header',
                content: `<h1>📄 Parsed Content from ${url}</h1>`
            },
            {
                id: 2,
                type: 'content',
                content: '<p>This content was parsed and converted into a conversational scroll experience.</p>'
            }
        ];
    }

    renderChatStream(content) {
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'none';
        
        const container = document.getElementById('chatStreamContent');
        container.style.display = 'block';
        container.innerHTML = '';
        
        // Render content blocks with animation
        content.forEach((block, index) => {
            setTimeout(() => {
                const blockElement = document.createElement('div');
                blockElement.style.cssText = `
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin: 1rem 2rem;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s ease;
                `;
                
                blockElement.innerHTML = block.content;
                container.appendChild(blockElement);
                
                // Trigger animation
                setTimeout(() => {
                    blockElement.style.opacity = '1';
                    blockElement.style.transform = 'translateY(0)';
                }, 100);
                
            }, index * 800);
        });
        
        // Add back to welcome button
        setTimeout(() => {
            const backButton = document.createElement('div');
            backButton.style.cssText = `
                text-align: center;
                margin: 2rem;
            `;
            backButton.innerHTML = `
                <button style="background: var(--neural-blue); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;" onclick="location.reload()">
                    ← Back to Welcome
                </button>
            `;
            container.appendChild(backButton);
        }, content.length * 800 + 1000);
    }
}

// Initialize the renderer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AgenticWebRenderer();
});
