const express = require('express');
const router = express.Router();
const ollamaService = require('../services/ollamaService');

// GET /api/ollama/status
router.get('/status', async (req, res) => {
  try {
    const status = await ollamaService.checkOllamaStatus();
    return res.json({ success: true, data: status });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ollama/chat
router.post('/chat', async (req, res) => {
  try {
    const { prompt, message, model, system } = req.body;
    const userPrompt = prompt || message;

    if (!userPrompt) {
      return res.status(400).json({ success: false, message: 'Prompt or message is required' });
    }

    const systemInstruction = system || "You are SKILLNEX Ollama AI Assistant. Provide clear, accurate, and concise answers to the user's prompt.";

    const result = await ollamaService.queryOllama(userPrompt, model, systemInstruction);

    if (!result.success) {
      return res.status(503).json({
        success: false,
        message: result.message || result.error,
        model: result.model
      });
    }

    return res.json({
      success: true,
      model: result.model,
      response: result.response
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
