// backend/routes/chat.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to your docs folder
const docsDir = path.join(__dirname, '..', '..', 'docupilot', 'docs');

// Load all docs into memory once at server startup
function loadDocsContent() {
  try {
    const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));
    const allContent = files.map(file =>
      fs.readFileSync(path.join(docsDir, file), 'utf-8')
    ).join('\n\n');
    return allContent;
  } catch (err) {
    console.error('❌ Failed to load docs:', err.message);
    return '';
  }
}

const docsContent = loadDocsContent();

// POST /api/chat
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Please enter a question.' });
    }

    // Here is a super simple "search" — just finds matching lines from docs
    const lowerMessage = message.toLowerCase();
    const matchingLines = docsContent
      .split('\n')
      .filter(line => line.toLowerCase().includes(lowerMessage));

    let reply;
    if (matchingLines.length > 0) {
      reply = matchingLines.slice(0, 5).join('\n'); // Limit to first 5 matches
    } else {
      reply = `I couldn't find anything about "${message}" in the docs.`;
    }

    res.json({ reply });
  } catch (err) {
    console.error('❌ Chat API error:', err.message);
    res.status(500).json({ reply: '⚠️ Error fetching reply.' });
  }
});

module.exports = router;
