/**
 * SKILLNEX PWA & Notification Installation Manager
 * Handles Service Worker registration, Notification-driven installation prompts,
 * deferred install events, and offline status indicators.
 */

(function () {
    'use strict';

    class PWAInstallerManager {
        constructor() {
            this.deferredPrompt = null;
            this.isInstalled = false;
            this.swRegistration = null;

            this.init();
        }

        async init() {
            this.checkStandalone();
            this.registerServiceWorker();
            this.setupEventListeners();
            this.injectPWAStyles();
            this.renderFloatingBadge();
            this.renderNavbarButton();

            // Check if page loaded with install flag from notification click
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('pwa_install') || urlParams.has('pwa_action')) {
                setTimeout(() => {
                    this.promptInstallation();
                }, 800);
            }
        }

        checkStandalone() {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                || window.navigator.standalone 
                || document.referrer.includes('android-app://');
            
            this.isInstalled = isStandalone;
            if (isStandalone) {
                console.log('[PWA] SKILLNEX is running in Standalone PWA mode!');
                document.documentElement.classList.add('pwa-standalone');
            }
        }

        async registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                try {
                    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
                    this.swRegistration = reg;
                    console.log('[PWA] Service Worker registered successfully with scope:', reg.scope);

                    // Listen for SW messages (e.g., from notification click)
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        console.log('[PWA] Message from SW:', event.data);
                        if (event.data && event.data.type === 'PWA_NOTIFICATION_CLICK') {
                            this.handleNotificationClickAction(event.data);
                        }
                    });
                } catch (error) {
                    console.error('[PWA] Service Worker registration failed:', error);
                }
            }
        }

        setupEventListeners() {
            // Capture native browser beforeinstallprompt
            window.addEventListener('beforeinstallprompt', (e) => {
                console.log('[PWA] beforeinstallprompt event captured!');
                e.preventDefault();
                this.deferredPrompt = e;
                this.updateInstallUIState(true);

                // Show notification install banner if not dismissed before
                if (!sessionStorage.getItem('skillnex_pwa_banner_dismissed') && !this.isInstalled) {
                    setTimeout(() => this.renderInstallBanner(), 1500);
                }
            });

            // App install completion event
            window.addEventListener('appinstalled', () => {
                console.log('[PWA] SKILLNEX PWA installed successfully!');
                this.deferredPrompt = null;
                this.isInstalled = true;
                this.updateInstallUIState(false);
                this.showToast('🎉 SKILLNEX App Installed Successfully!', 'success');
                this.removeInstallBanner();
            });

            // Listen to offline / online status
            window.addEventListener('online', () => {
                this.showToast('⚡ Back online! Synced with SKILLNEX servers.', 'info');
            });
            window.addEventListener('offline', () => {
                this.showToast('📶 You are offline. SKILLNEX PWA local cache active.', 'warning');
            });
        }

        // Trigger Notification Download Flow
        async downloadPWAThroughNotification() {
            console.log('[PWA] Initiating Notification-driven PWA download flow...');

            // Step 1: Request Notification Permission if needed
            if ('Notification' in window) {
                let permission = Notification.permission;
                if (permission === 'default') {
                    permission = await Notification.requestPermission();
                }

                if (permission === 'granted') {
                    // Step 2: Show native OS notification via Service Worker
                    this.sendInstallNotification();
                    this.showNotificationInstallModal();
                } else {
                    // Fallback if notifications blocked or denied
                    this.showToast('🔔 Notification permission denied. Opening direct PWA install prompt...', 'info');
                    this.promptInstallation();
                }
            } else {
                // Notifications not supported, fallback to direct install
                this.promptInstallation();
            }
        }

        sendInstallNotification() {
            const title = '📲 Download & Install SKILLNEX App';
            const options = {
                body: 'Click here to complete SKILLNEX PWA download & install to home screen!',
                icon: '/icons/icon-192.png',
                badge: '/icons/badge-96.png',
                tag: 'skillnex-download-notification',
                vibrate: [200, 100, 200],
                data: { url: window.location.href, type: 'INSTALL_PWA' },
                actions: [
                    { action: 'install', title: '⚡ Install PWA Now' },
                    { action: 'dismiss', title: 'Later' }
                ]
            };

            if (this.swRegistration && this.swRegistration.showNotification) {
                this.swRegistration.showNotification(title, options);
            } else if ('Notification' in window && Notification.permission === 'granted') {
                const notif = new Notification(title, options);
                notif.onclick = () => {
                    window.focus();
                    this.promptInstallation();
                    notif.close();
                };
            }
        }

        handleNotificationClickAction(data) {
            console.log('[PWA] Handling notification click action:', data);
            this.showToast('📲 Notification clicked! Preparing PWA installation...', 'info');
            setTimeout(() => {
                this.promptInstallation();
            }, 400);
        }

        // Direct PWA Install Prompt Trigger
        async promptInstallation() {
            if (!this.deferredPrompt) {
                if (this.isInstalled) {
                    this.showToast('✨ SKILLNEX is already installed as a PWA app on your device!', 'success');
                } else {
                    this.showManualInstallGuide();
                }
                return;
            }

            try {
                // Show native browser install prompt
                await this.deferredPrompt.prompt();
                const { outcome } = await this.deferredPrompt.userChoice;
                console.log(`[PWA] Install prompt outcome: ${outcome}`);

                if (outcome === 'accepted') {
                    this.showToast('🚀 Downloading & Installing SKILLNEX PWA...', 'success');
                } else {
                    this.showToast('Installation cancelled. You can install anytime via the Download button.', 'info');
                }
                this.deferredPrompt = null;
            } catch (err) {
                console.error('[PWA] Prompt error:', err);
                this.showManualInstallGuide();
            }
        }

        // Render In-App Floating PWA Download Button (Bottom Right)
        renderFloatingBadge() {
            if (document.getElementById('pwa-floating-badge')) return;

            const badge = document.createElement('div');
            badge.id = 'pwa-floating-badge';
            badge.className = 'pwa-floating-badge glass-card';
            badge.innerHTML = `
                <button id="pwa-floating-btn" class="pwa-floating-btn" title="Download & Install SKILLNEX PWA via Notification">
                    <span class="pwa-badge-icon">📲</span>
                    <span class="pwa-badge-text">Download App</span>
                    <span class="pwa-pulse-dot"></span>
                </button>
            `;

            document.body.appendChild(badge);

            document.getElementById('pwa-floating-btn').addEventListener('click', () => {
                this.downloadPWAThroughNotification();
            });
        }

        // Render Navbar Install Button into Header Navigation
        renderNavbarButton() {
            const navActions = document.querySelector('.nav-actions') || document.querySelector('.nav-links');
            if (!navActions || document.getElementById('pwa-nav-install-btn')) return;

            const navBtn = document.createElement('button');
            navBtn.id = 'pwa-nav-install-btn';
            navBtn.className = 'btn btn-outline btn-sm pwa-nav-btn';
            navBtn.innerHTML = `<span>📲</span> Install App`;
            navBtn.title = "Download SKILLNEX PWA App";

            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadPWAThroughNotification();
            });

            if (navActions.firstChild) {
                navActions.insertBefore(navBtn, navActions.firstChild);
            } else {
                navActions.appendChild(navBtn);
            }
        }

        // Render Notification Banner on Page Top/Bottom
        renderInstallBanner() {
            if (this.isInstalled || document.getElementById('pwa-install-banner')) return;

            const banner = document.createElement('div');
            banner.id = 'pwa-install-banner';
            banner.className = 'pwa-install-banner glass-card animate-slide-up';
            banner.innerHTML = `
                <div class="pwa-banner-content">
                    <div class="pwa-banner-icon">
                        <img src="/icons/icon-192.png" alt="SKILLNEX App Icon" width="42" height="42" style="border-radius: 10px;">
                    </div>
                    <div class="pwa-banner-info">
                        <h4>Install SKILLNEX App via Notification 🔔</h4>
                        <p>Get fast offline access, real-time study alerts & instant desktop performance.</p>
                    </div>
                </div>
                <div class="pwa-banner-actions">
                    <button id="pwa-banner-notif-btn" class="btn btn-primary btn-sm">
                        <span>📲</span> Download via Notification
                    </button>
                    <button id="pwa-banner-direct-btn" class="btn btn-secondary btn-sm">
                        ⚡ Quick Install
                    </button>
                    <button id="pwa-banner-close-btn" class="pwa-close-btn" title="Close Banner">✕</button>
                </div>
            `;

            document.body.appendChild(banner);

            document.getElementById('pwa-banner-notif-btn').addEventListener('click', () => {
                this.downloadPWAThroughNotification();
            });

            document.getElementById('pwa-banner-direct-btn').addEventListener('click', () => {
                this.promptInstallation();
            });

            document.getElementById('pwa-banner-close-btn').addEventListener('click', () => {
                sessionStorage.setItem('skillnex_pwa_banner_dismissed', 'true');
                this.removeInstallBanner();
            });
        }

        removeInstallBanner() {
            const banner = document.getElementById('pwa-install-banner');
            if (banner) {
                banner.classList.add('animate-fade-out');
                setTimeout(() => banner.remove(), 400);
            }
        }

        // Modal triggered when Notification is dispatched
        showNotificationInstallModal() {
            let modal = document.getElementById('pwa-notif-modal');
            if (modal) modal.remove();

            modal = document.createElement('div');
            modal.id = 'pwa-notif-modal';
            modal.className = 'pwa-modal-overlay';
            modal.innerHTML = `
                <div class="pwa-modal-card glass-card">
                    <div class="pwa-modal-header">
                        <div class="pwa-modal-badge">🔔 Notification Sent</div>
                        <button class="pwa-close-btn" id="pwa-modal-close">✕</button>
                    </div>
                    <div class="pwa-modal-body">
                        <div class="pwa-modal-icon-glow">
                            <img src="/icons/icon-512.png" width="72" height="72" alt="SKILLNEX Logo">
                        </div>
                        <h3>Notification Dispatch Triggered!</h3>
                        <p>We've sent a notification to your system tray. <strong>Click the notification</strong> or press the button below to confirm PWA installation.</p>
                        
                        <div class="pwa-install-steps">
                            <div class="pwa-step"><span class="step-num">1</span> Check system notification area / toast alert</div>
                            <div class="pwa-step"><span class="step-num">2</span> Tap <strong>"Install PWA Now"</strong> in the notification</div>
                            <div class="pwa-step"><span class="step-num">3</span> Confirm app download to your home screen!</div>
                        </div>

                        <div class="pwa-modal-actions">
                            <button id="pwa-modal-confirm-btn" class="btn btn-primary btn-block btn-lg">
                                📲 Complete PWA Download Now
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            document.getElementById('pwa-modal-close').addEventListener('click', () => modal.remove());
            document.getElementById('pwa-modal-confirm-btn').addEventListener('click', () => {
                modal.remove();
                this.promptInstallation();
            });
        }

        // Manual installation guide fallback for iOS / unsupported browsers
        showManualInstallGuide() {
            let guide = document.getElementById('pwa-install-guide');
            if (guide) guide.remove();

            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

            guide = document.createElement('div');
            guide.id = 'pwa-install-guide';
            guide.className = 'pwa-modal-overlay';
            guide.innerHTML = `
                <div class="pwa-modal-card glass-card">
                    <div class="pwa-modal-header">
                        <h3>📲 How to Download SKILLNEX PWA</h3>
                        <button class="pwa-close-btn" id="pwa-guide-close">✕</button>
                    </div>
                    <div class="pwa-modal-body">
                        ${isIOS ? `
                            <p>To install SKILLNEX on your iOS device:</p>
                            <ol class="pwa-guide-list">
                                <li>Tap the <strong>Share</strong> button <span style="font-size:1.2rem;">Square with arrow</span> in Safari.</li>
                                <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                                <li>Tap <strong>Add</strong> in top right.</li>
                            </ol>
                        ` : `
                            <p>To install SKILLNEX on your Desktop or Mobile device:</p>
                            <ol class="pwa-guide-list">
                                <li>Click the <strong>Install / Download Icon</strong> in your browser's address bar (top right).</li>
                                <li>Or open browser menu (⋮ / ⋯) and select <strong>"Install SKILLNEX App"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                            </ol>
                        `}
                        <button class="btn btn-primary btn-block" style="margin-top: 20px;" id="pwa-guide-ok">Got it!</button>
                    </div>
                </div>
            `;

            document.body.appendChild(guide);

            document.getElementById('pwa-guide-close').addEventListener('click', () => guide.remove());
            document.getElementById('pwa-guide-ok').addEventListener('click', () => guide.remove());
        }

        updateInstallUIState(available) {
            const navBtn = document.getElementById('pwa-nav-install-btn');
            if (navBtn) {
                if (this.isInstalled) {
                    navBtn.innerHTML = `<span>⚡</span> Installed`;
                    navBtn.classList.add('disabled');
                } else if (available) {
                    navBtn.innerHTML = `<span>📲</span> Install App`;
                    navBtn.classList.add('highlight-pulse');
                }
            }

            const floatBtn = document.getElementById('pwa-floating-badge');
            if (floatBtn && this.isInstalled) {
                floatBtn.style.display = 'none';
            }
        }

        showToast(message, type = 'info') {
            let toastContainer = document.getElementById('pwa-toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'pwa-toast-container';
                toastContainer.className = 'pwa-toast-container';
                document.body.appendChild(toastContainer);
            }

            const toast = document.createElement('div');
            toast.className = `pwa-toast pwa-toast-${type} glass-card animate-slide-up`;
            toast.innerHTML = `<span>${message}</span>`;
            toastContainer.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('animate-fade-out');
                setTimeout(() => toast.remove(), 400);
            }, 4000);
        }

        injectPWAStyles() {
            if (document.getElementById('pwa-dynamic-css')) return;
            const link = document.createElement('link');
            link.id = 'pwa-dynamic-css';
            link.rel = 'stylesheet';
            link.href = '/css/pwa.css';
            document.head.appendChild(link);
        }
    }

    // Initialize globally
    window.SKILLNEX_PWA = new PWAInstallerManager();
})();
