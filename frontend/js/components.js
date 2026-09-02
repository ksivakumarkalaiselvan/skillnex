const Components = {
    // Toast Notification System
    showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
            achievement: '🏆'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span style="font-size: 1.2rem; font-weight: bold;">${icons[type] || 'ℹ'}</span>
            <div style="flex: 1;">${message}</div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    // Modal Engine
    openModal(title, contentHtml, footerHtml = '') {
        let overlay = document.getElementById('global-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'global-modal-overlay';
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 id="global-modal-title"></h3>
                        <button class="modal-close" onclick="Components.closeModal()">&times;</button>
                    </div>
                    <div id="global-modal-body"></div>
                    <div id="global-modal-footer" style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 12px;"></div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        document.getElementById('global-modal-title').innerText = title;
        document.getElementById('global-modal-body').innerHTML = contentHtml;
        document.getElementById('global-modal-footer').innerHTML = footerHtml;

        setTimeout(() => overlay.classList.add('active'), 10);
    },

    closeModal() {
        const overlay = document.getElementById('global-modal-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },

    // Render Sidebar (Notification Hub link completely removed)
    renderSidebar(activePage) {
        const user = Auth.getUser() || { name: 'Student', role: 'student' };
        const sidebarEl = document.getElementById('sidebar-container');
        if (!sidebarEl) return;

        let menuItems = [];
        if (user.role === 'student') {
            menuItems = [
                { id: 'dashboard', label: 'Dashboard', icon: '📊', href: 'student-dashboard.html' },
                { id: 'planner', label: 'Study Planner', icon: '📅', href: 'study-planner.html' },
                { id: 'assessments', label: 'Assessments', icon: '📝', href: 'assessments.html' },
                { id: 'skills', label: 'Skills Intelligence', icon: '⚡', href: 'skills.html' },
                { id: 'courses', label: 'My Courses', icon: '📚', href: 'courses.html' },
                { id: 'ollama-ai', label: 'Ollama AI 🦙', href: 'ollama-ai.html' }
            ];
        } else if (user.role === 'teacher') {
            menuItems = [
                { id: 'teacher-dashboard', label: 'Teacher Dashboard', icon: '👨‍🏫', href: 'teacher-dashboard.html' },
                { id: 'students', label: 'Student Performance', icon: '👥', href: 'teacher-dashboard.html#students' },
                { id: 'copilot', label: 'AI Teacher Copilot', icon: '🤖', href: 'teacher-dashboard.html#copilot' },
                { id: 'ollama-ai', label: 'Ollama AI 🦙', href: 'ollama-ai.html' }
            ];
        } else {
            menuItems = [
                { id: 'admin-dashboard', label: 'Admin Dashboard', icon: '🏛️', href: 'admin-dashboard.html' },
                { id: 'ollama-ai', label: 'Ollama AI 🦙', href: 'ollama-ai.html' }
            ];
        }

        sidebarEl.innerHTML = `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <a href="index.html" class="logo">
                        <span>SKILL<span class="logo-badge">NEX</span></span>
                    </a>
                </div>
                <ul class="sidebar-menu">
                    ${menuItems.map(item => `
                        <li>
                            <a href="${item.href}" class="sidebar-link ${activePage === item.id ? 'active' : ''}">
                                <span class="sidebar-link-icon">${item.icon || '🦙'}</span>
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
                <div class="sidebar-footer">
                    <button onclick="Auth.logout()" class="btn btn-outline btn-sm" style="width: 100%;">
                        🚪 Logout
                    </button>
                </div>
            </aside>
        `;
    },

    // Render Topbar
    renderTopbar(title, subtitle) {
        const user = Auth.getUser() || { name: 'User', role: 'Student' };
        const topbarEl = document.getElementById('topbar-container');
        if (!topbarEl) return;

        topbarEl.innerHTML = `
            <div class="topbar">
                <div class="topbar-greeting">
                    <h1>${title || `Good Evening, ${user.name} 👋`}</h1>
                    <p>${subtitle || 'Keep learning and growing smarter.'}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                    <button onclick="Components.toggleTheme()" class="btn btn-outline btn-sm" title="Toggle Dark/Light Mode">
                        🌙 Mode
                    </button>
                    <div class="user-profile-badge">
                        <div class="avatar">${user.name ? user.name.charAt(0) : 'U'}</div>
                        <div>
                            <div style="font-weight: 700; font-size: 0.9rem;">${user.name}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize;">${user.role}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('skillnex_theme', nextTheme);
    },

    initTheme() {
        const saved = localStorage.getItem('skillnex_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
    }
};

document.addEventListener('DOMContentLoaded', () => Components.initTheme());
