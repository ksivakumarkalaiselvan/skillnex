/**
 * SKILLNEX Ollama Local AI Service
 * Connects directly to Ollama API running on host (default: http://localhost:11434)
 */

const dotenv = require('dotenv');
dotenv.config();

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Check if local Ollama server is running and fetch installed models
 */
async function checkOllamaStatus() {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { method: 'GET' });
    if (!res.ok) {
      return { online: false, host: OLLAMA_HOST, models: [], error: `Status ${res.status}` };
    }
    const data = await res.json();
    return {
      online: true,
      host: OLLAMA_HOST,
      models: data.models || [],
      defaultModel: DEFAULT_MODEL
    };
  } catch (err) {
    return {
      online: false,
      host: OLLAMA_HOST,
      models: [],
      error: "Ollama is not running locally. Start it with 'ollama serve' or 'ollama run llama3'."
    };
  }
}

/**
 * Send prompt/chat request to local Ollama API
 */
async function queryOllama(prompt, model = DEFAULT_MODEL, systemPrompt = null) {
  const targetModel = model || DEFAULT_MODEL;

  const payload = {
    model: targetModel,
    prompt: prompt,
    stream: false
  };

  if (systemPrompt) {
    payload.system = systemPrompt;
  }

  try {
    const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return {
      success: true,
      model: targetModel,
      response: data.response || "No response received from Ollama."
    };
  } catch (err) {
    console.error("Ollama Query Error:", err.message);
    return {
      success: false,
      model: targetModel,
      error: err.message,
      message: `Failed to connect to local Ollama server at ${OLLAMA_HOST}. Make sure Ollama is installed and running.`
    };
  }
}

module.exports = {
  checkOllamaStatus,
  queryOllama
};
