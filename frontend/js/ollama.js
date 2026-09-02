const OllamaUI = {
    selectedModel: 'llama3',

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
        const badgeEl = document.getElementById('ollama-status-badge');
        const selectEl = document.getElementById('ollama-model-select');

        try {
            const res = await API.getOllamaStatus();
            const data = res.data;

            if (data.online) {
                if (badgeEl) {
                    badgeEl.className = 'badge badge-emerald';
                    badgeEl.innerHTML = `● Ollama Active (${data.host})`;
                }

                if (selectEl && data.models && data.models.length > 0) {
                    selectEl.innerHTML = data.models.map(m => `
                        <option value="${m.name}" ${m.name.includes('llama3') ? 'selected' : ''}>
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
        } catch (e) {
            if (badgeEl) {
                badgeEl.className = 'badge badge-rose';
                badgeEl.innerHTML = `✕ Ollama Offline`;
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
            this.appendMessage('ai', `⚠️ Connection error: Could not reach Ollama server at http://localhost:11434.\n\nMake sure Ollama is installed and running:\n1. Open terminal and run: ollama serve\n2. Run your model: ollama run llama3`);
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
