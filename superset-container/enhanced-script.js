/**
 * Enhanced N8N Chat with Voice Features
 * Wraps around the existing n8n chat to add voice recording and playback capabilities
 */

// Import the original n8n chat
import { createChat as originalCreateChat } from './script.js';

// Enhanced Chat Configuration
const ENHANCED_CONFIG = {
    voiceEnabled: true,
    textToSpeechEnabled: true,
    autoPlayResponses: true,
    alertModeEnabled: true,
    webhookUrl: '/webhook/9416569c-169b-45cf-b768-60082dd61349'
};

// Complete CSS replacing CDN to avoid problematic selectors
const ENHANCED_VOICE_STYLES = `
    /* Base n8n chat styles - cleaned version without problematic transparent selectors */
    #n8n-chat {
        font-family: Inter, Helvetica, Arial, sans-serif !important;
        position: fixed;
        bottom: 20px;
        right: 20px; /* Align to bottom-right */
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end; /* Align all children to the right */
    }
    
    #n8n-chat .chat-window {
        width: 400px;
        max-height: 600px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        border: 1px solid #e1e5e9;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-bottom: 80px; /* Space for toggle button */
        order: 1; /* Ensure chat window appears before toggle button */
    }
    
    #n8n-chat .chat-header {
        background: #6dc7df;
        padding: 16px;
        color: white;
        font-weight: 600;
        border-radius: 16px 16px 0 0;
        text-align: center;
    }
    
    #n8n-chat .chat-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        max-height: 500px;
    }
    
    #n8n-chat .chat-messages-list {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: 400px;
    }
    
    #n8n-chat .chat-footer {
        padding: 16px;
        border-top: 1px solid #e1e5e9;
        background: white;
        border-radius: 0 0 16px 16px;
    }
    
    #n8n-chat .chat-window-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #6dc7df;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(109, 199, 223, 0.4);
        transition: all 0.2s ease;
        position: absolute;
        bottom: 0;
        right: 0;
        order: 2; /* Ensure toggle button appears after chat window */
    }
    
    #n8n-chat .chat-window-toggle:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(109, 199, 223, 0.6);
    }
    /* Chat message ordering and layout fixes */
    #n8n-chat [class*="message"],
    #n8n-chat [class*="chat"] {
        display: flex !important;
        flex-direction: column !important;
        order: unset !important;
    }
    
    /* EXACT targeting for the input structure - Light DOM */
    #n8n-chat .chat-inputs {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: nowrap !important;
    }
    
    #n8n-chat .chat-inputs textarea[data-test-id="chat-input"] {
        flex: 1 !important;
        min-width: 0 !important;
        height: 40px !important;
        max-height: 40px !important;
        min-height: 40px !important;
        border-radius: 20px !important;
        padding: 10px 14px !important;
        font-size: 14px !important;
        resize: none !important;
        overflow: hidden !important;
        line-height: 20px !important;
        box-sizing: border-box !important;
    }
    
    #n8n-chat .chat-inputs-controls {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 4px !important;
        flex-shrink: 0 !important;
    }
    
    #n8n-chat .chat-inputs-controls button {
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        flex-shrink: 0 !important;
    }
    
    #n8n-chat .enhanced-voice-button {
        background: #229ED9 !important;
        color: white !important;
        border: none !important;
    }
    
    #n8n-chat .chat-input-send-button {
        background: #229ED9 !important;
        color: white !important;
        border: none !important;
    }
    
    #n8n-chat .chat-input-send-button:disabled {
        background: #ccc !important;
    }
    
    /* Ensure messages appear in chronological order */
    .enhanced-user-message,
    .enhanced-bot-message,
    .enhanced-voice-message,
    .enhanced-text-message {
        order: 999 !important; /* Force our messages to appear at the bottom */
        width: 100% !important;
        box-sizing: border-box !important;
    }
    
    /* Telegram-like styling for native messages */
    #n8n-chat .chat-message {
        margin: 6px 0 !important;
        max-width: 80% !important;
        word-wrap: break-word !important;
    }
    
    #n8n-chat .chat-message-from-user {
        align-self: flex-end !important;
        margin-left: auto !important;
        margin-right: 0 !important;
    }
    
    #n8n-chat .chat-message-from-bot {
        align-self: flex-start !important;
        margin-left: 0 !important;
        margin-right: auto !important;
    }
    
    #n8n-chat .chat-message-from-user .chat-message-markdown {
        background: #229ED9 !important;
        color: white !important;
        border-radius: 16px 16px 4px 16px !important;
        padding: 10px 14px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
    }
    
    #n8n-chat .chat-message-from-bot .chat-message-markdown {
        background: #ffffff !important;
        color: #222 !important;
        border: 1px solid #e6eaef !important;
        border-radius: 16px 16px 16px 4px !important;
        padding: 10px 14px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
    }
    
    #n8n-chat .chat-message-markdown p {
        margin: 0 0 8px 0 !important;
        line-height: 1.4 !important;
        font-size: 14px !important;
        font-family: Inter, Helvetica, Arial, sans-serif !important;
    }
    
    #n8n-chat .chat-message-markdown p:last-child {
        margin-bottom: 0 !important;
    }
    
    /* Markdown styling */
    #n8n-chat .chat-message-markdown h1,
    #n8n-chat .chat-message-markdown h2,
    #n8n-chat .chat-message-markdown h3 {
        margin: 12px 0 8px 0 !important;
        font-weight: 600 !important;
        line-height: 1.3 !important;
    }
    
    #n8n-chat .chat-message-markdown h1 {
        font-size: 18px !important;
    }
    
    #n8n-chat .chat-message-markdown h2 {
        font-size: 16px !important;
    }
    
    #n8n-chat .chat-message-markdown h3 {
        font-size: 14px !important;
    }
    
    #n8n-chat .chat-message-markdown code {
        background: rgba(0, 0, 0, 0.08) !important;
        padding: 2px 4px !important;
        border-radius: 3px !important;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace !important;
        font-size: 13px !important;
    }
    
    #n8n-chat .chat-message-from-user .chat-message-markdown code {
        background: rgba(255, 255, 255, 0.2) !important;
        color: #fff !important;
    }
    
    #n8n-chat .chat-message-markdown pre {
        background: rgba(0, 0, 0, 0.05) !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        border-radius: 6px !important;
        padding: 12px !important;
        margin: 8px 0 !important;
        overflow-x: auto !important;
    }
    
    #n8n-chat .chat-message-from-user .chat-message-markdown pre {
        background: rgba(255, 255, 255, 0.15) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
    }
    
    #n8n-chat .chat-message-markdown pre code {
        background: none !important;
        padding: 0 !important;
        color: inherit !important;
    }
    
    #n8n-chat .chat-message-markdown strong {
        font-weight: 600 !important;
    }
    
    #n8n-chat .chat-message-markdown em {
        font-style: italic !important;
    }
    
    #n8n-chat .chat-message-markdown del {
        text-decoration: line-through !important;
    }
    
    #n8n-chat .chat-message-markdown a {
        color: #0066cc !important;
        text-decoration: underline !important;
    }
    
    #n8n-chat .chat-message-from-user .chat-message-markdown a {
        color: #cce7ff !important;
    }
    
    #n8n-chat .chat-message-markdown ul,
    #n8n-chat .chat-message-markdown ol {
        margin: 8px 0 !important;
        padding-left: 20px !important;
    }
    
    #n8n-chat .chat-message-markdown li {
        margin: 2px 0 !important;
    }
    
    /* User voice message styling */
    #n8n-chat .chat-message-from-user .chat-message-markdown {
        background: #229ED9 !important;
        color: white !important;
        border-radius: 16px 16px 4px 16px !important;
        padding: 10px 14px !important;
        align-self: flex-end !important;
    }
    
    /* Audio controls within user messages */  
    #n8n-chat .chat-message-from-user audio {
        max-width: 120px !important;
        height: 30px !important;
    }
    
    /* Simplified audio response styling - always align left for bot responses */
    #n8n-chat .chat-message-from-bot .chat-message-markdown {
        background: #ffffff !important;
        color: #222 !important;
        border: 1px solid #e6eaef !important;
        border-radius: 16px 16px 16px 4px !important;
        padding: 10px 14px !important;
        align-self: flex-start !important;
    }
    
    /* Audio controls within bot messages */
    #n8n-chat .chat-message-from-bot audio {
        max-width: 140px !important;
        height: 30px !important;
    }
    
    /* Hide TTS buttons - not needed in Telegram style */
    .enhanced-play-button {
        display: none !important;
    }
    
    /* Hide empty response - use display none for common patterns */
    #n8n-chat .chat-message[data-empty="true"],
    #n8n-chat .enhanced-empty-response {
        display: none !important;
        height: 0 !important;
        opacity: 0 !important;
        overflow: hidden !important;
    }
    
    /* Clean message styling without problematic selectors */
    #n8n-chat .chat-message {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
        position: relative !important;
        max-width: 80% !important;
        margin: 6px 0 !important;
        word-wrap: break-word !important;
    }
    
    /* Simple message positioning */
    #n8n-chat .chat-message-from-user {
        align-self: flex-end !important;
        margin-left: auto !important;
        margin-right: 0 !important;
    }
    
    #n8n-chat .chat-message-from-bot {
        align-self: flex-start !important;
        margin-left: 0 !important;
        margin-right: auto !important;
    }

    /* Voice control buttons */
    .enhanced-voice-controls {
        display: flex;
        gap: 8px;
        align-items: center;
        margin-top: 8px;
    }

    .enhanced-voice-button {
        background: #28a745;
        border: none;
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
    }

    .enhanced-voice-button:hover {
        background: #218838;
        transform: scale(1.05);
    }

    .enhanced-voice-button.recording {
        background: #dc3545;
        animation: recordingPulse 1s infinite;
    }

    @keyframes recordingPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .enhanced-voice-button:disabled {
        background: #6c757d;
        cursor: not-allowed;
        transform: none;
    }

    /* Alert mode button */
    .enhanced-alert-mode-btn {
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 12px;
        font-size: 12px;
        cursor: pointer;
        margin: 8px 0;
        transition: all 0.2s ease;
        font-weight: 600;
        width: 100%;
        font-family: Inter, Helvetica, Arial, sans-serif;
    }

    .enhanced-alert-mode-btn:hover {
        background: #5a6268;
    }

    .enhanced-alert-mode-btn.active {
        background: #dc3545;
        animation: alertPulse 2s infinite;
    }

    @keyframes alertPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }

    /* Hide TTS play buttons - not needed with native audio controls */
    .enhanced-play-button {
        display: none !important;
    }

    /* Input area enhancements */
    .enhanced-input-container {
        position: relative;
    }

    .enhanced-input-container.alert-mode {
        background: rgba(255, 193, 7, 0.1);
        border-radius: 8px;
        padding: 8px;
    }

    .enhanced-input-container.alert-mode .chat-input {
        background: #fff3cd;
        border-color: #ffc107;
        color: #856404;
    }

    /* Notification system */
    .enhanced-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 320px;
        padding: 16px;
        background: #28a745;
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(40, 167, 69, 0.3);
        z-index: 10001;
        font-family: Inter, Helvetica, Arial, sans-serif;
        font-size: 14px;
        transform: translateX(calc(100% + 20px));
        transition: transform 0.3s ease;
    }

    .enhanced-notification.show {
        transform: translateX(0);
    }

    .enhanced-notification.error {
        background: #dc3545;
        box-shadow: 0 4px 16px rgba(220, 53, 69, 0.3);
    }

    .enhanced-notification.warning {
        background: #ffc107;
        color: #333;
        box-shadow: 0 4px 16px rgba(255, 193, 7, 0.3);
    }

    .enhanced-notification.info {
        background: #17a2b8;
        box-shadow: 0 4px 16px rgba(23, 162, 184, 0.3);
    }

    .enhanced-notification-close {
        position: absolute;
        top: 8px;
        right: 12px;
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }

    .enhanced-notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    /* Loading states */
    .enhanced-loading {
        opacity: 0.6;
        pointer-events: none;
    }

    /* Typing indicator for voice messages */
    .enhanced-voice-typing {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        color: #6c757d;
        font-style: italic;
    }

    .enhanced-voice-typing::before {
        content: "🎤";
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

class EnhancedChatWrapper {
    constructor(options = {}) {
        this.options = { ...ENHANCED_CONFIG, ...options };
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.currentAudio = null;
        this.isAlertMode = false;
        this.chatInstance = null;
        this.notificationTimeout = null;
        
        this.init();
    }

    // Sanitize HTML to prevent XSS while allowing safe markdown elements
    sanitizeHTML(html) {
        // First escape all HTML
        const escaped = html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
        
        // Then restore safe HTML tags that we want to allow
        const allowedTags = ['strong', 'em', 'code', 'pre', 'h1', 'h2', 'h3', 'br', 'p', 'ul', 'ol', 'li', 'del', 'a'];
        let sanitized = escaped;
        
        allowedTags.forEach(tag => {
            // Restore opening and closing tags
            sanitized = sanitized.replace(new RegExp(`&lt;${tag}&gt;`, 'g'), `<${tag}>`);
            sanitized = sanitized.replace(new RegExp(`&lt;/${tag}&gt;`, 'g'), `</${tag}>`);
        });
        
        // Restore safe link attributes
        sanitized = sanitized.replace(/&lt;a href=&quot;([^&quot;]+)&quot; target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;&gt;/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">');
        
        return sanitized;
    }

    // Simple markdown parser for chat messages
    parseMarkdown(text) {
        if (!text || typeof text !== 'string') return text;
        
        // First sanitize the input to prevent XSS
        let html = this.sanitizeHTML(text);
        
        // Handle code blocks first (triple backticks) - preserve content as-is
        html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });
        
        // Handle inline code (single backticks)
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Handle headers (must be done before other formatting)
        html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
        
        // Handle bold text
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        
        // Handle italic text
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');
        
        // Handle strikethrough
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
        
        // Handle links (be extra careful with URLs)
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, text, url) => {
            const cleanUrl = url.trim();
            if (cleanUrl.match(/^https?:\/\//) || cleanUrl.match(/^mailto:/)) {
                return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            }
            return match; // Return original if URL doesn't look safe
        });
        
        // Handle lists - process line by line
        const lines = html.split('\n');
        const processedLines = [];
        let inList = false;
        let listType = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isUnorderedListItem = /^[\*\-] (.+)/.test(line);
            const isOrderedListItem = /^\d+\. (.+)/.test(line);
            
            if (isUnorderedListItem || isOrderedListItem) {
                const content = line.replace(/^[\*\-] /, '').replace(/^\d+\. /, '');
                const newListType = isOrderedListItem ? 'ol' : 'ul';
                
                if (!inList) {
                    processedLines.push(`<${newListType}>`);
                    inList = true;
                    listType = newListType;
                } else if (listType !== newListType) {
                    processedLines.push(`</${listType}>`);
                    processedLines.push(`<${newListType}>`);
                    listType = newListType;
                }
                
                processedLines.push(`<li>${content}</li>`);
            } else {
                if (inList) {
                    processedLines.push(`</${listType}>`);
                    inList = false;
                    listType = '';
                }
                processedLines.push(line);
            }
        }
        
        // Close any remaining list
        if (inList) {
            processedLines.push(`</${listType}>`);
        }
        
        html = processedLines.join('\n');
        
        // Handle paragraphs - split by double newlines, but avoid breaking existing HTML
        const paragraphs = html.split('\n\n');
        const processedParagraphs = paragraphs.map(para => {
            para = para.trim();
            if (!para) return '';
            
            // Don't wrap if it's already HTML (contains tags) or is a list
            if (para.includes('<') || para === '') {
                return para;
            }
            
            // Convert single newlines to <br> within paragraphs
            para = para.replace(/\n/g, '<br>');
            return `<p>${para}</p>`;
        });
        
        html = processedParagraphs.filter(p => p).join('\n\n');
        
        // Clean up any remaining bare newlines
        html = html.replace(/\n/g, '<br>');
        
        return html.trim();
    }

    async init() {
        // Inject enhanced styles
        this.injectStyles();
        
        // Create the original n8n chat
        this.chatInstance = originalCreateChat(this.options);
        
        // Wait for chat to be ready, then enhance it
        setTimeout(() => {
            this.enhanceChat();
        }, 1000);
    }

    injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'enhanced-voice-styles';
        styleSheet.textContent = ENHANCED_VOICE_STYLES;
        document.head.appendChild(styleSheet);
    }

    enhanceChat() {
        // Find the chat container
        const chatContainer = document.querySelector('#n8n-chat');
        if (!chatContainer) {
            console.error('Chat container not found');
            return;
        }

        // Debug: Log what we found
        console.log('Found chat container:', chatContainer);
        console.log('Chat container children:', Array.from(chatContainer.children).map(c => c.className));
        
        // Add voice controls to the chat
        this.addVoiceControls(chatContainer);
        
        // Add alert mode functionality
        this.addAlertMode(chatContainer);
        
        // Enhance message handling
        this.enhanceMessageHandling(chatContainer);
        
        // Add notification system
        this.addNotificationSystem();
        
        // Fix chat toggle functionality with delay
        setTimeout(() => {
            this.fixChatToggle(chatContainer);
        }, 500);
        
        // Try to inject ordering styles into the widget's shadow root (if any)
        this.injectOrderingStylesIntoShadowRootWithRetry();
        
        // Start periodic cleanup of status messages
        this.startPeriodicCleanup();
        
        console.log('Enhanced chat with voice features initialized');
    }

    addVoiceControls(chatContainer) {
        // Wait for the chat interface to be fully loaded
        const checkForInputs = () => {
            // Look for input and send button more broadly
            const inputElement = chatContainer.querySelector('input, textarea');
            const sendButton = chatContainer.querySelector('button[type="submit"], button:last-child');
            
            if (inputElement && sendButton) {
                this.integrateVoiceButton(inputElement, sendButton);
            } else {
                // Retry after a short delay
                setTimeout(checkForInputs, 500);
            }
        };
        
        checkForInputs();
    }

    integrateVoiceButton(inputElement, sendButton) {
        // Find the parent container of the input and send button
        const inputParent = inputElement.parentElement;
        const sendParent = sendButton.parentElement;
        
        // If they're in the same container, add voice button inline
        if (inputParent === sendParent || inputParent.contains(sendButton) || sendParent.contains(inputElement)) {
            const container = inputParent.contains(sendButton) ? inputParent : sendParent;
            
            // Create voice button
            const voiceBtn = document.createElement('button');
            voiceBtn.id = 'enhanced-voice-btn';
            // Use class that matches minimal CSS in index.html
            voiceBtn.className = 'enhanced-voice-button';
            voiceBtn.innerHTML = '🎤';
            voiceBtn.title = 'Record voice message';
            voiceBtn.type = 'button'; // Prevent form submission
            
            // Insert voice button right before the send button
            sendButton.parentNode.insertBefore(voiceBtn, sendButton);
            
            // Bind events
            voiceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleVoiceRecording();
            });
            
            console.log('Voice button integrated inline with send button');
        } else {
            // Fallback: add voice controls as separate container
            this.addVoiceControlsFallback(inputElement.parentElement);
        }
    }

    addVoiceControlsFallback(inputContainer) {
        // Create voice controls wrapper
        const voiceControls = document.createElement('div');
        voiceControls.className = 'enhanced-voice-controls';
        voiceControls.innerHTML = `
            <button class="enhanced-voice-button" id="enhanced-voice-btn" title="Record voice message">
                🎤
            </button>
        `;

        // Add voice controls to input area
        inputContainer.appendChild(voiceControls);

        // Bind voice button events
        const voiceBtn = voiceControls.querySelector('#enhanced-voice-btn');
        voiceBtn.addEventListener('click', () => this.toggleVoiceRecording());
    }

    addAlertMode(chatContainer) {
        // Find the input container
        const inputArea = chatContainer.querySelector('[class*="input"]') || 
                         chatContainer.querySelector('[class*="chat"]');
        
        if (!inputArea) return;

        // Create alert mode button
        const alertModeBtn = document.createElement('button');
        alertModeBtn.className = 'enhanced-alert-mode-btn';
        alertModeBtn.id = 'enhanced-alert-mode-btn';
        alertModeBtn.textContent = '🚨 Alert Mode: OFF';
        alertModeBtn.title = 'Toggle Alert Mode (Voice Only)';

        // Insert before input area
        inputArea.parentNode.insertBefore(alertModeBtn, inputArea);

        // Bind alert mode events
        alertModeBtn.addEventListener('click', () => this.toggleAlertMode());
    }

    enhanceMessageHandling(chatContainer) {
        // Wrap the input container for alert mode styling
        const inputContainer = chatContainer.querySelector('[class*="input"]');
        if (inputContainer) {
            const wrapper = document.createElement('div');
            wrapper.className = 'enhanced-input-container';
            inputContainer.parentNode.insertBefore(wrapper, inputContainer);
            wrapper.appendChild(inputContainer);
        }

        // Intercept the original chat's message sending
        this.interceptOriginalChatRequests(chatContainer);

        // Monitor for new messages and enhance them
        const messageContainer = chatContainer.querySelector('[class*="message"]') || 
                               chatContainer.querySelector('[class*="chat"]');
        
        if (messageContainer) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (!(node instanceof HTMLElement)) continue;
                        
                        // Check if this is an empty response and remove it immediately
                        const content = node.textContent || '';
                        const innerHTML = node.innerHTML || '';
                        const emptyPatterns = [
                            '<Empty response>',
                            '&lt;Empty response&gt;',
                            'Empty response'
                        ];
                        
                        const isEmpty = emptyPatterns.some(pattern => 
                            content.includes(pattern) || innerHTML.includes(pattern)
                        );
                        
                        if (isEmpty) {
                            console.log('Intercepting and removing empty response node');
                            node.remove();
                            continue;
                        }
                        
                        // Skip our own enhanced UI elements and controls
                        if (
                            node.matches('.enhanced-voice-message, .enhanced-play-button, .enhanced-notification, .enhanced-voice-button, .enhanced-input-container, button, audio') ||
                            node.classList.contains('chat-message') // Skip our own messages
                        ) {
                            continue;
                        }
                        
                        // Remove original n8n messages, status messages, and generic error messages
                        if (node.classList && node.classList.contains('chat-message')) {
                            const hasEmptyComments = node.innerHTML.includes('<!---->') && 
                                                   !node.classList.contains('enhanced-bot') &&
                                                   !node.classList.contains('enhanced-user');
                            
                            // Check for unwanted messages
                            const isStatusMessage = content.includes('"handled": true') ||
                                                   content.includes('"status": "processed"') ||
                                                   content.includes('handled') && content.includes('processed');
                                                   
                            const isGenericError = content.includes('Error: Failed to receive response') ||
                                                  content.includes('Failed to receive response');
                            
                            if (hasEmptyComments || isStatusMessage || isGenericError) {
                                // Remove unwanted n8n messages
                                console.log('Removing unwanted n8n message:', content.substring(0, 50));
                                node.remove();
                                continue;
                            }
                        }
                        
                        this.enhanceMessage(node);
                        }
                }
                
                // Also run cleanup after any DOM changes
                setTimeout(() => {
                    this.removeEmptyPlaceholders();
                }, 100);
            });

            observer.observe(messageContainer, {
                childList: true,
                subtree: true
            });
        }
    }

    interceptOriginalChatRequests(chatContainer) {
        // Store original fetch reference with proper binding
        this.originalFetch = window.fetch.bind(window);
        
        // Override the global fetch to intercept n8n chat requests
        window.fetch = async (url, options = {}) => {
            // Check if this is a request to our webhook - be more specific
            const isWebhookRequest = url && (
                url === this.options.webhookUrl || 
                url.includes(this.options.webhookUrl) ||
                (url.includes('/webhook') && options.method === 'POST')
            );
            
            if (isWebhookRequest) {
                console.log('Intercepting chat request to:', url, 'Method:', options.method);
                
                // Prevent n8n from adding its own message by immediately clearing any pending UI updates
                setTimeout(() => {
                    this.cleanupDuplicateMessages();
                }, 100);
                
                return this.handleChatRequest(url, options);
            }
            // For all other requests, use original fetch
            return this.originalFetch(url, options);
        };
    }

    async handleChatRequest(url, options) {
        try {
            console.log('Intercepted request:', { url, options });
            
            // Extract message from the original request
            let messageText = '';
            
            if (options.body) {
                console.log('Request body type:', typeof options.body, options.body);
                
                if (typeof options.body === 'string') {
                    try {
                        const parsed = JSON.parse(options.body);
                        console.log('Parsed JSON body:', parsed);
                        
                        // Extract from n8n chat format
                        messageText = parsed.chatInput || parsed.message || parsed.text || parsed.content || '';
                        
                        // Check for nested message structure
                        if (parsed.data && parsed.data.message) {
                            messageText = parsed.data.message;
                        }
                        if (parsed.chatMessage) {
                            messageText = parsed.chatMessage;
                        }
                    } catch (e) {
                        console.log('Failed to parse JSON, using raw body:', options.body);
                        messageText = options.body;
                    }
                } else if (options.body instanceof FormData) {
                    console.log('FormData request detected');
                    // Already FormData, but we need to reformat it
                    for (let [key, value] of options.body.entries()) {
                        console.log('FormData entry:', key, value);
                        if (key === 'message' || key === 'text' || key === 'content') {
                            if (typeof value === 'string') {
                                try {
                                    const parsed = JSON.parse(value);
                                    messageText = parsed.message || parsed.text || parsed.content || value;
                                } catch (e) {
                                    messageText = value;
                                }
                            } else {
                                messageText = value.toString();
                            }
                        }
                    }
                } else if (options.body instanceof URLSearchParams) {
                    console.log('URLSearchParams detected');
                    messageText = options.body.get('message') || options.body.get('text') || options.body.get('content') || '';
                } else {
                    console.log('Unknown body type, attempting to stringify');
                    try {
                        const bodyStr = JSON.stringify(options.body);
                        const parsed = JSON.parse(bodyStr);
                        messageText = parsed.message || parsed.text || parsed.content || '';
                    } catch (e) {
                        messageText = options.body.toString();
                    }
                }
            }

            console.log('Extracted message text:', messageText);

            if (messageText && messageText.trim()) {
                return this.sendTextMessage(messageText.trim());
            } else {
                console.warn('No message content found in request, falling back to original fetch');
                // Fall back to original fetch if we can't extract the message
                return this.originalFetch(url, options);
            }
        } catch (error) {
            console.error('Error handling chat request:', error);
            throw error;
        }
    }

    async sendTextMessage(message) {
        try {
            console.log('Sending text message:', message);
            
            // Add user message to chat immediately for proper ordering
            this.addUserMessage(message, 'text');
            
            // Show typing indicator for bot response
            const typingIndicator = this.addTypingIndicator();
            
            // Create FormData for text message with your specified format
            const formData = new FormData();
            
            // Format: body.message = {"text":"message"} 
            const messageData = {
                text: message
            };

            // Add alert mode if enabled
            if (this.isAlertMode) {
                messageData.alertMode = true;
            }

            formData.append('message', JSON.stringify(messageData));

            try {
                // Use original fetch to avoid interception
                const response = await this.originalFetch(this.options.webhookUrl, {
                    method: 'POST',
                    body: formData
                });

                // Remove typing indicator
                if (typingIndicator) {
                    typingIndicator.remove();
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Handle the response ourselves and add bot message immediately after user message
                await this.handleResponse(response.clone());
                
            } catch (error) {
                // Remove typing indicator on error
                if (typingIndicator) {
                    typingIndicator.remove();
                }
                
                // Only show meaningful error messages
                if (error.message && error.message !== 'Failed to send message') {
                    this.addBotMessage(`Error: ${error.message}`, 'text');
                }
            }
            
            // Clean up any duplicates that might have been added
            setTimeout(() => {
                this.cleanupDuplicateMessages();
            }, 100);
            
            // Return proper empty success response to prevent n8n from processing anything
            return new Response(null, {
                status: 204
            });
            
        } catch (error) {
            console.error('Error sending text message:', error);
            // Only show meaningful error messages in notifications
            if (!error.message.includes('Failed to construct') && !error.message.includes('Response with null body')) {
                this.showNotification(`Message failed: ${error.message}`, 'error');
            }
            throw error;
        }
    }


    enhanceMessage(messageElement) {
        if (!(messageElement instanceof HTMLElement)) return;
        
        // Guard against enhancing our own controls or non-text elements
        if (
            messageElement.matches('.enhanced-voice-message, .enhanced-play-button, .enhanced-notification, .enhanced-voice-button, .enhanced-input-container, button, audio, .chat-message')
        ) {
            return;
        }
        
        // Only enhance likely message containers
        const text = (messageElement.textContent || '').trim();
        if (text.length < 2) return; // avoid enhancing tiny/emoji-only nodes
        if (messageElement.querySelector('.enhanced-play-button')) return;

        // Since we're hiding TTS buttons, we don't need to add them
        // Just log that we would enhance this message
        console.log('Would enhance message (TTS hidden):', text.substring(0, 50));
    }

    addNotificationSystem() {
        const notification = document.createElement('div');
        notification.className = 'enhanced-notification';
        notification.id = 'enhanced-notification';
        notification.innerHTML = `
            <button class="enhanced-notification-close" onclick="this.parentElement.classList.remove('show')">&times;</button>
            <div class="enhanced-notification-content"></div>
        `;
        document.body.appendChild(notification);
    }

    fixChatToggle(chatContainer) {
        // Debug: Log the chat container structure
        console.log('Chat container:', chatContainer);
        console.log('Chat container HTML:', chatContainer?.outerHTML?.substring(0, 500));
        
        // Try multiple selectors for toggle button
        let toggleButton = chatContainer?.querySelector('.chat-window-toggle') ||
                          document.querySelector('.chat-window-toggle') ||
                          chatContainer?.querySelector('[class*="toggle"]') ||
                          document.querySelector('[class*="toggle"]');
        
        // Try multiple selectors for chat window
        let chatWindow = chatContainer?.querySelector('.chat-window') ||
                        document.querySelector('.chat-window') ||
                        chatContainer?.querySelector('[class*="window"]') ||
                        document.querySelector('[class*="window"]');
        
        console.log('Toggle button found:', toggleButton);
        console.log('Chat window found:', chatWindow);
        
        if (!toggleButton) {
            console.warn('Toggle button not found, searching more broadly');
            // Search for any button or clickable element
            toggleButton = chatContainer?.querySelector('button') ||
                          chatContainer?.querySelector('[role="button"]') ||
                          chatContainer?.querySelector('div[style*="cursor"]');
            console.log('Alternative toggle button:', toggleButton);
        }
        
        if (!chatWindow) {
            console.warn('Chat window not found, using container as fallback');
            // Use any div that might be the main chat interface
            chatWindow = chatContainer?.querySelector('div[style*="flex"]') ||
                        chatContainer?.querySelector('div[class*="chat"]') ||
                        chatContainer;
            console.log('Alternative chat window:', chatWindow);
        }
        
        if (!toggleButton) {
            console.error('No toggle button found at all');
            return;
        }
        
        if (!chatWindow) {
            console.error('No chat window found at all');
            return;
        }

        console.log('Setting up chat toggle functionality');
        
        // Remove any existing click listeners by cloning the element
        const newToggleButton = toggleButton.cloneNode(true);
        toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);
        
        // Add our own click handler
        newToggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Chat toggle clicked!');
            console.log('Current window state - hidden:', chatWindow.hidden, 'display:', chatWindow.style.display);
            
            // Toggle chat window visibility
            const isCurrentlyHidden = chatWindow.hidden || 
                                     chatWindow.style.display === 'none' || 
                                     chatWindow.style.display === '' ||
                                     !chatWindow.offsetParent;
            
            console.log('Is currently hidden:', isCurrentlyHidden);
            
            if (isCurrentlyHidden) {
                // Show the chat window
                chatWindow.style.display = 'flex';
                chatWindow.style.visibility = 'visible';
                chatWindow.style.opacity = '1';
                chatWindow.hidden = false;
                console.log('Chat window opened');
            } else {
                // Hide the chat window
                chatWindow.style.display = 'none';
                chatWindow.style.visibility = 'hidden';
                chatWindow.style.opacity = '0';
                chatWindow.hidden = true;
                console.log('Chat window closed');
            }
        });

        // Ensure chat window starts hidden
        chatWindow.style.display = 'none';
        chatWindow.hidden = true;
        
        console.log('Chat toggle functionality fixed');
    }

    async toggleVoiceRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            await this.startRecording();
        }
    }

    async startRecording() {
        try {
            // Request audio with higher quality constraints
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100,
                    channelCount: 1
                }
            };
            
            console.log('Requesting microphone access...');
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Check if we got audio tracks
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) {
                throw new Error('No audio tracks available');
            }
            
            console.log('Audio track settings:', audioTracks[0].getSettings());
            console.log('Audio track capabilities:', audioTracks[0].getCapabilities());
            
            // Use a supported MIME type for better compatibility
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/webm') 
                ? 'audio/webm'
                : MediaRecorder.isTypeSupported('audio/mp4') 
                ? 'audio/mp4'
                : 'audio/wav';
                
            console.log('Using MIME type:', mimeType);
            
            this.mediaRecorder = new MediaRecorder(stream, { 
                mimeType: mimeType,
                audioBitsPerSecond: 128000
            });
            this.audioChunks = [];

            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                console.log('Data available, size:', event.data.size);
                if (event.data.size > 0) {
                this.audioChunks.push(event.data);
                }
            });

            this.mediaRecorder.addEventListener('stop', async () => {
                console.log('Recording stopped, chunks:', this.audioChunks.length);
                if (this.audioChunks.length === 0) {
                    console.error('No audio data recorded');
                    this.showNotification('No audio recorded. Please try again.', 'error');
                    return;
                }
                
                const audioBlob = new Blob(this.audioChunks, { type: mimeType });
                console.log('Created audio blob, size:', audioBlob.size, 'type:', audioBlob.type);
                
                // Test the audio blob by playing it locally first
                this.testAudioBlob(audioBlob);
                
                await this.sendVoiceMessage(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            });

            this.mediaRecorder.start(1000); // Record in 1-second chunks
            this.isRecording = true;
            
            const voiceBtn = document.querySelector('#enhanced-voice-btn');
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '⏹';
            }
            
            this.showNotification('Recording... Click to stop', 'info');
            
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.showNotification('Microphone access denied. Please check your browser permissions.', 'error');
        }
    }

    testAudioBlob(audioBlob) {
        // Create a temporary audio element to test the recorded audio
        const audioUrl = URL.createObjectURL(audioBlob);
        const testAudio = new Audio(audioUrl);
        
        testAudio.addEventListener('loadedmetadata', () => {
            console.log('Test audio duration:', testAudio.duration, 'seconds');
            if (testAudio.duration === 0) {
                console.warn('Audio duration is 0 - recording might be silent');
                this.showNotification('Warning: Audio might be silent', 'warning', 3000);
            }
        });
        
        testAudio.addEventListener('error', (e) => {
            console.error('Test audio error:', e);
        });
        
        // Clean up URL after a short time
        setTimeout(() => {
            URL.revokeObjectURL(audioUrl);
        }, 5000);
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            const voiceBtn = document.querySelector('#enhanced-voice-btn');
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '🎤';
            }
            
            this.showNotification('Processing voice message...', 'info');
        }
    }

    async sendVoiceMessage(audioBlob) {
        try {
            console.log('Sending voice message, size:', audioBlob.size);
            
            // Add user voice message to chat immediately for proper ordering
            this.addUserMessage(audioBlob, 'voice');
            
            // Show typing indicator for bot response
            const typingIndicator = this.addTypingIndicator();
            
            try {
                // Send to webhook with proper format
                const formData = new FormData();
                formData.append('audio', audioBlob, 'voice-message.wav');

                const messageData = { voice: true };
                // Add alertMode flag if in alert mode
                if (this.isAlertMode) {
                    messageData.alertMode = true;
                }

                formData.append('message', JSON.stringify(messageData));

                // Use original fetch to avoid interception
                const response = await this.originalFetch(this.options.webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg, audio/*;q=0.9, application/json;q=0.8, */*;q=0.5'
                    },
                    body: formData
                });

                // Remove typing indicator
                if (typingIndicator) {
                    typingIndicator.remove();
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Handle the response ourselves and add bot message immediately after user message
                await this.handleResponse(response.clone());
                
                this.showNotification('Voice message sent successfully!', 'success', 2000);
                
            } catch (error) {
                // Remove typing indicator on error
                if (typingIndicator) {
                    typingIndicator.remove();
                }
                
                // Only show meaningful error messages
                if (error.message && error.message !== 'Failed to send voice message') {
                    this.addBotMessage(`Error: ${error.message}`, 'text');
                }
                throw error;
            }
            
        } catch (error) {
            console.error('Error sending voice message:', error);
            // Only show meaningful error messages in notifications
            if (!error.message.includes('Failed to construct') && !error.message.includes('Response with null body')) {
                this.showNotification(`Voice message failed: ${error.message}`, 'error');
            }
        }
    }

    async handleResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        console.log('Response content-type:', contentType);
        
        if (contentType.includes('audio/')) {
            // Handle binary audio response
            console.log('Handling audio response');
            await this.handleAudioResponse(response);
        } else {
            await this.handleJSONResponse(response);
        }
    }

    async handleAudioResponse(response) {
        const audioBlob = await response.blob();
        
        if (audioBlob.size > 0) {
            console.log('Received audio blob, size:', audioBlob.size);
            const audioUrl = URL.createObjectURL(audioBlob);
            this.addBotMessage(audioUrl, 'audio');
            this.showNotification('Voice response received!', 'success', 3000);
        } else {
            throw new Error('Received empty audio response');
        }
    }

    async handleJSONResponse(response) {
        const responseText = await response.text();
        
        if (!responseText.trim()) {
            console.warn('Empty response from server - adding error message');
            this.addBotMessage('Error: Failed to receive response', 'text');
            return;
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (jsonError) {
            console.error('Invalid JSON response:', responseText.substring(0, 100));
            this.addBotMessage(`Error: Invalid response format`, 'text');
            return;
        }

        console.log('Parsed response data:', data);

        // Handle text responses
        if (data.text && data.text.trim()) {
            console.log('Adding text message to chat:', data.text);
            this.addBotMessage(data.text, 'text');
            this.showNotification('Response received!', 'success', 2000);
        }
        // Handle voice responses
        else if (data.voice && data.voiceUrl) {
            this.addBotMessage(data.voiceUrl, 'audio');
            this.showNotification('Voice response received!', 'success', 3000);
        }
        // If no text or voice, show what we got
        else {
            console.warn('No text or voice response found in data:', data);
            this.addBotMessage('Error: No response content received', 'text');
        }
    }

    removeEmptyPlaceholders() {
        try {
            const container = document.querySelector('#n8n-chat');
            if (!container) return;
            
            // More aggressive approach - remove various forms of empty responses
            const selectors = [
                '.chat-message',
                '.enhanced-bot-message', 
                '.enhanced-user-message',
                '[class*="message"]'
            ];
            
            selectors.forEach(selector => {
                const elements = container.querySelectorAll(selector);
                elements.forEach((element) => {
                    const content = element.textContent || '';
                    const innerHTML = element.innerHTML || '';
                    
                    // Check for various forms of empty response
                    const emptyPatterns = [
                        '<Empty response>',
                        '&lt;Empty response&gt;',
                        'Empty response',
                        '{"status": "handled"}',
                        '{ "status": "handled" }'
                    ];
                    
                    const isEmpty = emptyPatterns.some(pattern => 
                        content.includes(pattern) || innerHTML.includes(pattern)
                    );
                    
                    // Also check if content is essentially empty (only whitespace/symbols)
                    const trimmedContent = content.trim().replace(/[^\w\s]/g, '');
                    const isEssentiallyEmpty = trimmedContent.length < 3;
                    
                    if (isEmpty) {
                        console.log('Marking empty response for removal:', content.substring(0, 50));
                        element.setAttribute('data-empty', 'true');
                        element.classList.add('enhanced-empty-response');
                        element.style.display = 'none';
                        // Also remove it from DOM
                        setTimeout(() => element.remove(), 100);
                    } else if (isEssentiallyEmpty && element.children.length === 0) {
                        console.log('Removing essentially empty element:', content.substring(0, 50));
                        element.remove();
                    }
                });
            });
            
            // Also hide messages via CSS that might appear later
            this.injectEmptyResponseCSS();
            
        } catch (e) {
            console.warn('Placeholder cleanup error:', e);
        }
    }

    injectEmptyResponseCSS() {
        const hideEmptyCSS = `
            /* Mark and hide empty response elements */
            #n8n-chat .enhanced-empty-response,
            #n8n-chat .chat-message[data-empty="true"] {
                display: none !important;
                height: 0 !important;
                opacity: 0 !important;
                overflow: hidden !important;
                position: absolute !important;
                left: -9999px !important;
            }
        `;
        
        const existingStyle = document.getElementById('hide-empty-responses');
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = 'hide-empty-responses';
            style.textContent = hideEmptyCSS;
            document.head.appendChild(style);
        }
    }

    // Simplified single messages container
    getMessagesContainer() {
        return document.querySelector('#n8n-chat .chat-messages-list');
    }
    
    cleanupDuplicateMessages() {
        const container = this.getMessagesContainer();
        if (!container) return;
        
        const allMessages = Array.from(container.querySelectorAll('.chat-message'));
        const messagesToRemove = [];
        
        allMessages.forEach(message => {
            const content = message.textContent.trim();
            const hasComments = message.innerHTML.includes('<!---->') && !message.innerHTML.includes('enhanced');
            
            // Remove status messages
            const isStatusMessage = content.includes('"handled": true') ||
                                   content.includes('"status": "processed"') ||
                                   (content.includes('handled') && content.includes('processed')) ||
                                   content.includes('{ "handled": true, "status": "processed" }');
            
            // Remove generic error messages from original n8n
            const isGenericError = content.includes('Error: Failed to receive response') ||
                                 content.includes('Failed to receive response');
            
            if (isStatusMessage || (hasComments && isGenericError)) {
                console.log('Removing unwanted message:', content.substring(0, 50));
                messagesToRemove.push(message);
                return;
            }
            
            // Remove original n8n messages that have duplicates
            if (hasComments) {
                const enhancedMessages = allMessages.filter(m => 
                    m !== message && 
                    (m.classList.contains('enhanced-user') || m.classList.contains('enhanced-bot')) &&
                    m.textContent.trim() === content
                );
                
                if (enhancedMessages.length > 0) {
                    console.log('Removing duplicate original message:', content.substring(0, 50));
                    messagesToRemove.push(message);
                }
            }
        });
        
        // Remove all unwanted messages
        messagesToRemove.forEach(msg => msg.remove());
    }
    
    startPeriodicCleanup() {
        // Clean up status messages every 500ms
        setInterval(() => {
            this.removeStatusMessages();
        }, 500);
    }
    
    removeStatusMessages() {
        const container = this.getMessagesContainer();
        if (!container) return;
        
        const allMessages = container.querySelectorAll('.chat-message');
        allMessages.forEach(message => {
            const content = message.textContent.trim();
            const hasComments = message.innerHTML.includes('<!---->') && !message.innerHTML.includes('enhanced');
            
            // Check for various unwanted message types
            const isStatusMessage = content.includes('"handled": true') ||
                                   content.includes('"status": "processed"') ||
                                   (content.includes('handled') && content.includes('processed')) ||
                                   content.includes('{ "handled": true, "status": "processed" }') ||
                                   content === '{"handled": true,"status": "processed"}' ||
                                   content === '{ "handled": true, "status": "processed" }';
                                   
            const isGenericError = content.includes('Error: Failed to receive response') ||
                                 content.includes('Failed to receive response');
            
            // Remove unwanted messages from original n8n system
            if ((hasComments && (isStatusMessage || isGenericError)) || isStatusMessage) {
                console.log('Periodic cleanup: Removing unwanted message:', content.substring(0, 50));
                message.remove();
            }
        });
    }

    // Single unified method to add user messages
    addUserMessage(content, type) {
        const container = this.getMessagesContainer();
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message chat-message-from-user enhanced-user';
        messageDiv.setAttribute('data-timestamp', Date.now());
        
        if (type === 'text') {
            // Escape HTML for user input to prevent XSS, but allow basic markdown
            const safeContent = content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
            
            messageDiv.innerHTML = `
                <div class="chat-message-markdown">
                    <p>${safeContent}</p>
                </div>
            `;
        } else if (type === 'voice') {
            const audioUrl = URL.createObjectURL(content);
            const audioId = `user-audio-${Date.now()}`;
            
            messageDiv.innerHTML = `
                <div class="chat-message-markdown" style="
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                ">
                    <span>🎤 Voice message</span>
                    <audio id="${audioId}" controls preload="metadata" style="max-width: 120px; height: 30px;">
                        <source src="${audioUrl}" type="${content.type}">
                    </audio>
                    <small style="opacity: 0.8; font-size: 11px;">${(content.size / 1024).toFixed(1)}KB</small>
                </div>
            `;
        }
        
        container.appendChild(messageDiv);
        this.scrollToBottom(container);
    }

    // Single unified method to add bot messages  
    addBotMessage(content, type) {
        const container = this.getMessagesContainer();
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message chat-message-from-bot enhanced-bot';
        messageDiv.setAttribute('data-timestamp', Date.now());
        
        if (type === 'text') {
            // Parse markdown and render as HTML
            const htmlContent = this.parseMarkdown(content);
            messageDiv.innerHTML = `
                <div class="chat-message-actions"></div>
                <div class="chat-message-markdown">
                    ${htmlContent}
                </div>
            `;
        } else if (type === 'audio') {
            const audioId = `bot-audio-${Date.now()}`;
            
            messageDiv.innerHTML = `
                <div class="chat-message-actions"></div>
                <div class="chat-message-markdown" style="
                    display: flex !important;
                    align-items: center !important;
                    gap: 8px !important;
                ">
                    <span>🔊 Audio response</span>
                    <audio id="${audioId}" controls preload="metadata" style="max-width: 140px; height: 30px;">
                        <source src="${content}" type="audio/mpeg">
                        <source src="${content}" type="audio/wav">
                    </audio>
                </div>
            `;
            
            // Auto-play audio responses
            setTimeout(() => {
                const audioElement = document.getElementById(audioId);
                if (audioElement) {
                    audioElement.play().catch(e => {
                        console.warn('Auto-play failed (browser policy):', e);
                        this.showNotification('Audio ready - click play button', 'info', 3000);
                    });
                }
            }, 300);
        }
        
        container.appendChild(messageDiv);
        this.scrollToBottom(container);
    }
    
    addTypingIndicator() {
        const container = this.getMessagesContainer();
        if (!container) return null;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message chat-message-from-bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="chat-message-actions"></div>
            <div class="chat-message-markdown">
                <p>Typing...</p>
            </div>
        `;
        
        container.appendChild(typingDiv);
        this.scrollToBottom(container);
        
        return typingDiv;
    }



    scrollToBottom(container) {
        if (!container) return;
        
        // Try multiple scroll methods
        container.scrollTop = container.scrollHeight;
        
        // Also try scrolling parent containers
        let parent = container.parentElement;
        while (parent && parent !== document.body) {
            if (parent.scrollHeight > parent.clientHeight) {
                parent.scrollTop = parent.scrollHeight;
            }
            parent = parent.parentElement;
        }
        
        // Force scroll with a small delay
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 10);
    }

    getWidgetShadowRoot() {
        const hostRoot = document.querySelector('#n8n-chat');
        if (!hostRoot) return null;
        // BFS through descendants to find the first element with a shadowRoot
        const queue = Array.from(hostRoot.children);
        while (queue.length) {
            const el = queue.shift();
            if (!el) break;
            if (el.shadowRoot) return el.shadowRoot;
            queue.push(...el.children);
        }
        return null;
    }

    injectOrderingStylesIntoShadowRootWithRetry(retries = 10) {
        const shadow = this.getWidgetShadowRoot();
        if (shadow) {
            // Inject minimal ordering styles inside the shadow root to override CDN styles
            const styleId = 'enhanced-ordering-styles';
            if (!shadow.getElementById(styleId)) {
                const s = document.createElement('style');
                s.id = styleId;
                s.textContent = `
                    /* Enforce chronological stacking inside shadow DOM */
                    .chat-messages-list {
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 12px !important;
                    }

                    /* EXACT targeting for the input structure */
                    .chat-inputs {
                        display: flex !important;
                        flex-direction: row !important;
                        align-items: center !important;
                        gap: 8px !important;
                        flex-wrap: nowrap !important;
                    }
                    
                    .chat-inputs textarea[data-test-id="chat-input"] {
                        flex: 1 !important;
                        min-width: 0 !important;
                        height: 40px !important;
                        max-height: 40px !important;
                        min-height: 40px !important;
                        border-radius: 20px !important;
                        padding: 10px 14px !important;
                        font-size: 14px !important;
                        resize: none !important;
                        overflow: hidden !important;
                        line-height: 20px !important;
                        box-sizing: border-box !important;
                    }
                    
                    .chat-inputs-controls {
                        display: flex !important;
                        flex-direction: row !important;
                        align-items: center !important;
                        gap: 4px !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .chat-inputs-controls button {
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 50% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        margin: 0 !important;
                        flex-shrink: 0 !important;
                    }
                    
                    .enhanced-voice-button {
                        background: #229ED9 !important;
                        color: white !important;
                        border: none !important;
                    }
                    
                    .chat-input-send-button {
                        background: #229ED9 !important;
                        color: white !important;
                        border: none !important;
                    }
                    
                    .chat-input-send-button:disabled {
                        background: #ccc !important;
                    }

                    /* Clean shadow DOM styling */
                    .chat-message {
                        display: flex !important;
                        max-width: 80% !important;
                        margin: 6px 0 !important;
                        word-wrap: break-word !important;
                    }
                    
                    .chat-message-from-user {
                        align-self: flex-end !important;
                        margin-left: auto !important;
                        margin-right: 0 !important;
                    }
                    
                    .chat-message-from-bot {
                        align-self: flex-start !important;
                        margin-left: 0 !important;
                        margin-right: auto !important;
                    }

                    /* Our injected bubbles (when appended inside shadow) */
                    .enhanced-user-message {
                        background: #229ED9 !important;
                        color: #fff !important;
                        border-radius: 16px 16px 4px 16px !important;
                        padding: 10px 14px !important;
                        align-self: flex-end !important;
                        margin: 6px 0 !important;
                    }
                    .enhanced-bot-message {
                        background: #ffffff !important;
                        color: #222 !important;
                        border: 1px solid #e6eaef !important;
                        border-radius: 16px 16px 16px 4px !important;
                        padding: 10px 14px !important;
                        align-self: flex-start !important;
                        margin: 6px 0 !important;
                    }
                `;
                shadow.appendChild(s);
                console.log('Injected ordering styles into shadow root');
            }
            return;
        }
        if (retries > 0) {
            setTimeout(() => this.injectOrderingStylesIntoShadowRootWithRetry(retries - 1), 300);
        } else {
            console.warn('Could not inject styles into shadow root (not found)');
        }
    }



    playTextAsVoice(text) {
        if (!this.options.textToSpeechEnabled) {
            this.showNotification('Text-to-speech not supported in this browser', 'warning');
            return;
        }

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Natural') || voice.name.includes('Premium'))
            ) || voices.find(voice => voice.lang.startsWith('en'));
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            window.speechSynthesis.speak(utterance);
        }
    }

    toggleAlertMode() {
        this.isAlertMode = !this.isAlertMode;
        const alertBtn = document.querySelector('#enhanced-alert-mode-btn');
        const inputContainer = document.querySelector('.enhanced-input-container');
        const textInput = document.querySelector('#n8n-chat input, #n8n-chat textarea');

        if (this.isAlertMode) {
            alertBtn.textContent = '🚨 Alert Mode: ON';
            alertBtn.classList.add('active');
            inputContainer?.classList.add('alert-mode');
            if (textInput) {
                textInput.placeholder = 'Alert mode: Voice only';
                textInput.disabled = true;
            }
            this.showNotification('Alert Mode enabled! Only voice messages allowed.', 'warning', 3000);
        } else {
            alertBtn.textContent = '🚨 Alert Mode: OFF';
            alertBtn.classList.remove('active');
            inputContainer?.classList.remove('alert-mode');
            if (textInput) {
                textInput.placeholder = 'Type your message...';
                textInput.disabled = false;
            }
            this.showNotification('Alert Mode disabled. Text and voice messages enabled.', 'info', 3000);
        }
    }

    showNotification(message, type = 'success', duration = 5000) {
        const notification = document.querySelector('#enhanced-notification');
        const content = notification.querySelector('.enhanced-notification-content');
        
        if (!notification || !content) return;
        
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        notification.className = `enhanced-notification ${type}`;
        content.textContent = message;
        notification.classList.add('show');

        if (duration > 0) {
            this.notificationTimeout = setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        }
    }

    destroy() {
        // Clean up resources
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
        
        if (this.currentAudio) {
            this.currentAudio.pause();
        }
        
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }
        
        // Remove enhanced elements
        document.querySelector('#enhanced-voice-styles')?.remove();
        document.querySelector('#enhanced-notification')?.remove();
        
        // Destroy original chat
        if (this.chatInstance && this.chatInstance.destroy) {
            this.chatInstance.destroy();
        }
    }
}

// Enhanced createChat function that wraps the original
export function createChat(options = {}) {
    // Validate required options
    if (!options.webhookUrl) {
        console.error('Enhanced Chat: webhookUrl is required');
        return null;
    }

    // Create enhanced chat wrapper
    const enhancedChat = new EnhancedChatWrapper(options);
    
    // Make it globally accessible
    window.enhancedChatInstance = enhancedChat;
    
    return enhancedChat;
}

// Export for module usage
export default { createChat, EnhancedChatWrapper };
