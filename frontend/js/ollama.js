const OllamaUI = {
    selectedModel: 'llama3',
    isLocalDirect: false,

    async init() {
        const user = Auth.requireAuth();
        if (!user) return;

        Components.renderSidebar('ollama-ai');
        Components.renderTopbar('Ollama Local AI Workspace 🦙', 'Connect to private local LLM models running on your machine');

        this.attachEventListeners();
        await this.checkStatus();
    },

    attachEventListeners() {
        const sendBtn = document.getElementById('ollama-send-btn');
        const inputEl = document.getElementById('ollama-input');
        const modelSelect = document.getElementById('ollama-model-select');

        if (sendBtn && inputEl) {
            sendBtn.addEventListener('click', () => this.sendPrompt());
            inputEl.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendPrompt();
            });
        }

        if (modelSelect) {
            modelSelect.addEventListener('change', (e) => {
                this.selectedModel = e.target.value;
                Components.showToast(`Selected model: ${this.selectedModel}`, 'info');
            });
        }
    },

    async checkStatus() {
        // 1. Attempt direct client-side fetch from browser to local Ollama (http://localhost:11434)
        try {
            const localRes = await fetch('http://localhost:11434/api/tags', { method: 'GET' });
            if (localRes.ok) {
                const data = await localRes.json();
                this.isLocalDirect = true;
                this.updateStatusUI(true, 'http://localhost:11434 (Direct Local)', data.models || []);
                return;
            }
        } catch (localErr) {
            console.log("Direct local fetch failed/blocked by CORS, trying backend API proxy...");
        }

        // 2. Fallback to Backend Proxy API
        try {
            const res = await API.getOllamaStatus();
            if (res && res.data && res.data.online) {
                this.isLocalDirect = false;
                this.updateStatusUI(true, res.data.host, res.data.models || []);
            } else {
                this.updateStatusUI(false);
            }
        } catch (e) {
            this.updateStatusUI(false);
        }
    },

    updateStatusUI(online, host = 'http://localhost:11434', models = []) {
        const badgeEl = document.getElementById('ollama-status-badge');
        const selectEl = document.getElementById('ollama-model-select');

        if (online) {
            if (badgeEl) {
                badgeEl.className = 'badge badge-emerald';
                badgeEl.innerHTML = `● Ollama Active (${host})`;
            }

            if (selectEl && models.length > 0) {
                selectEl.innerHTML = models.map(m => `
                    <option value="${m.name}" ${m.name.includes('qwen') || m.name.includes('llama3') ? 'selected' : ''}>
                        ${m.name} (${(m.size / (1024 * 1024 * 1024)).toFixed(1)} GB)
                    </option>
                `).join('');
                this.selectedModel = selectEl.value;
            }
        } else {
            if (badgeEl) {
                badgeEl.className = 'badge badge-amber';
                badgeEl.innerHTML = `⚠️ Ollama Offline`;
            }
        }
    },

    async sendPrompt() {
        const inputEl = document.getElementById('ollama-input');
        if (!inputEl) return;
        const text = inputEl.value.trim();
        if (!text) return;

        const emptyState = document.getElementById('ollama-empty-state');
        if (emptyState) emptyState.style.display = 'none';

        this.appendMessage('user', text);
        inputEl.value = '';

        this.showThinkingIndicator();

        // Method A: Direct Client-Side Browser Request to Local Ollama
        if (this.isLocalDirect) {
            try {
                const localResponse = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: this.selectedModel,
                        prompt: text,
                        stream: false
                    })
                });

                if (localResponse.ok) {
                    const data = await localResponse.json();
                    this.hideThinkingIndicator();
                    if (data && data.response) {
                        this.appendMessage('ai', data.response, this.selectedModel);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Direct local query failed, falling back to backend API...", err);
            }
        }

        // Method B: Fallback Proxy via Backend Server
        try {
            const res = await API.askOllama(text, this.selectedModel);
            this.hideThinkingIndicator();

            if (res && res.response) {
                this.appendMessage('ai', res.response, res.model);
            } else {
                this.appendMessage('ai', 'Unable to get response from Ollama.');
            }
        } catch (e) {
            this.hideThinkingIndicator();
            this.appendMessage('ai', `⚠️ **Ollama Connection Troubleshooting Guide**:\n\nWhen hosted on Vercel/Render, your local Ollama must allow web origin connections.\n\n**Quick Fix for Windows**:\n1. Close Ollama from system tray (bottom-right toolbar).\n2. Open Command Prompt / PowerShell and run:\n   \`setx OLLAMA_ORIGINS "*"\`\n3. Start Ollama again:\n   \`ollama serve\`\n4. Click **🔄 Refresh** above!`);
        }
    },

    appendMessage(sender, text, modelUsed = null) {
        const chatBox = document.getElementById('chat-messages');
        if (!chatBox) return;

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble chat-bubble-${sender}`;
        
        let formattedText = text
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.5); padding: 12px; border-radius: 6px; font-family: Fira Code, monospace; overflow-x: auto; margin: 8px 0;"><code>$1</code></pre>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; font-family: Fira Code, monospace;">$1</code>')
            .replace(/\n/g, '<br>');

        if (sender === 'ai' && modelUsed) {
            formattedText = `<div style="font-size: 0.75rem; color: #a5b4fc; margin-bottom: 4px; font-weight: 700;">🦙 ${modelUsed}</div>` + formattedText;
        }

        bubble.innerHTML = formattedText;
        chatBox.appendChild(bubble);
        chatBox.scrollTop = chatBox.scrollHeight;
    },

    showThinkingIndicator() {
        const chatBox = document.getElementById('chat-messages');
        if (!chatBox) return;
        let indicator = document.getElementById('typing-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'typing-indicator';
            indicator.className = 'chat-bubble chat-bubble-ai';
            indicator.innerHTML = `<span class="animate-pulse" style="font-style: italic; color: var(--text-muted);">Ollama is generating response (${this.selectedModel})...</span>`;
            chatBox.appendChild(indicator);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    },

    hideThinkingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
};
