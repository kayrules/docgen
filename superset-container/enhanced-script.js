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
    webhookUrl: '/webhook/3157e7f7-34a4-4c1e-a9af-b0b0c077e2aa'
};

// Complete CSS replacing CDN to avoid problematic selectors
const ENHANCED_VOICE_STYLES = `
    /* Base n8n chat styles - cleaned version without problematic transparent selectors */
    #n8n-chat {
        font-family: Inter, Helvetica, Arial, sans-serif !important;
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
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
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: #6dc7df;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(109, 199, 223, 0.4);
        transition: all 0.2s ease;
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
        margin: 0 !important;
        line-height: 1.4 !important;
        font-size: 14px !important;
        font-family: Inter, Helvetica, Arial, sans-serif !important;
    }
    
    /* Voice message styling - same as text */
    .enhanced-voice-message {
        background: #229ED9 !important;
        color: white !important;
        border-radius: 16px 16px 4px 16px !important;
        padding: 10px 14px !important;
        margin: 6px 0 !important;
        margin-left: auto !important;
        margin-right: 0 !important;
        max-width: 80% !important;
        align-self: flex-end !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
    }
    
    /* Audio response styling */
    .enhanced-audio-message {
        background: #ffffff !important;
        color: #222 !important;
        border: 1px solid #e6eaef !important;
        border-radius: 16px 16px 16px 4px !important;
        padding: 10px 14px !important;
        margin: 6px 0 !important;
        margin-left: 0 !important;
        margin-right: auto !important;
        max-width: 80% !important;
        align-self: flex-start !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
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

    /* Voice message styling */
    .enhanced-voice-message {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: rgba(40, 167, 69, 0.1);
        border-radius: 12px;
        margin: 4px 0;
    }

    .enhanced-play-button {
        background: #28a745;
        border: none;
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.2s ease;
    }

    .enhanced-play-button:hover {
        background: #218838;
        transform: scale(1.05);
    }

    .enhanced-audio-player {
        flex: 1;
        height: 32px;
        max-width: 200px;
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

        // Add voice controls to the chat
        this.addVoiceControls(chatContainer);
        
        // Add alert mode functionality
        this.addAlertMode(chatContainer);
        
        // Enhance message handling
        this.enhanceMessageHandling(chatContainer);
        
        // Add notification system
        this.addNotificationSystem();
        
        // Try to inject ordering styles into the widget's shadow root (if any)
        this.injectOrderingStylesIntoShadowRootWithRetry();
        
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
                        
                        // No need to check for transparent classes since we're not using CDN CSS
                        
                        // Skip our own enhanced UI elements and controls
                        if (
                            node.matches('.enhanced-voice-message, .enhanced-play-button, .enhanced-notification, .enhanced-voice-button, .enhanced-input-container, button, audio')
                        ) {
                            continue;
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

            // Use original fetch to avoid interception
            const response = await this.originalFetch(this.options.webhookUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle the response ourselves and return a 204 to prevent n8n from displaying anything
            await this.handleResponse(response.clone());
            
            // Return No Content so the original chat does not attempt to render a response bubble
            return new Response(null, { status: 204 });
            
        } catch (error) {
            console.error('Error sending text message:', error);
            this.showNotification(`Message failed: ${error.message}`, 'error');
            throw error;
        }
    }

    addUserMessageToChat(message) {
        const chatMessages = this.getChatMessagesContainer();
        if (!chatMessages) return;

        const userMessage = document.createElement('div');
        userMessage.className = 'enhanced-user-message';
        userMessage.setAttribute('data-timestamp', Date.now());
        
        userMessage.innerHTML = `
            <div style="line-height: 1.4;">${message}</div>
        `;
        
        chatMessages.appendChild(userMessage);
        this.scrollToBottom(chatMessages);
    }

    enhanceMessage(messageElement) {
        if (!(messageElement instanceof HTMLElement)) return;
        // Guard against enhancing our own controls or non-text elements
        if (
            messageElement.matches('.enhanced-voice-message, .enhanced-play-button, .enhanced-notification, .enhanced-voice-button, .enhanced-input-container, button, audio')
        ) {
            return;
        }
        // Only enhance likely message containers
        const text = (messageElement.textContent || '').trim();
        if (text.length < 2) return; // avoid enhancing tiny/emoji-only nodes
        if (messageElement.querySelector('.enhanced-play-button')) return;

        // Add TTS button to message elements
            const playBtn = document.createElement('button');
            playBtn.className = 'enhanced-play-button';
            playBtn.innerHTML = '🔊';
            playBtn.title = 'Play message';
        playBtn.onclick = () => this.playTextAsVoice(text);
            
            messageElement.appendChild(playBtn);
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
            
            // Add voice message to chat
            this.addVoiceMessageToChat('🎤 Voice message sent', audioBlob);
            
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle the response ourselves to control display
            await this.handleResponse(response.clone());
            
            // Voice messages don't need to return anything to the original chat
            this.showNotification('Voice message sent successfully!', 'success', 2000);
            
        } catch (error) {
            console.error('Error sending voice message:', error);
            this.showNotification(`Voice message failed: ${error.message}`, 'error');
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
            this.addAudioMessageToChat('🔊 Audio response', audioUrl);
            this.showNotification('Voice response received!', 'success', 3000);
        } else {
            throw new Error('Received empty audio response');
        }
    }

    async handleJSONResponse(response) {
        const responseText = await response.text();
        
        if (!responseText.trim()) {
            throw new Error('Empty response from server');
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (jsonError) {
            throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
        }

        console.log('Parsed response data:', data);

        // Always clean up empty responses first
        this.removeEmptyPlaceholders();

        // Handle text responses
        if (data.text && data.text.trim()) {
            console.log('Adding text message to chat:', data.text);
            this.addBotMessageToNativeContainer(data.text);
            this.showNotification('Response received!', 'success', 2000);
        }

        // Handle voice responses
        if (data.voice && data.voiceUrl) {
            this.addAudioMessageToChat('🔊 Voice response', data.voiceUrl);
            this.showNotification('Voice response received!', 'success', 3000);
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

    addBotMessageToNativeContainer(text) {
        const messagesContainer = document.querySelector('#n8n-chat .chat-messages-list');
        if (!messagesContainer) {
            console.warn('Could not find native messages container');
            return;
        }

        // Create a message using the native structure
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message chat-message-from-bot enhanced-native-bot';
        messageDiv.innerHTML = `
            <div class="chat-message-actions"></div>
            <div class="chat-message-markdown">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom(messagesContainer);
    }

    addTextMessageToChat(text) {
        const chatMessages = this.getChatMessagesContainer();
        if (!chatMessages) return;

        const textMessage = document.createElement('div');
        textMessage.className = 'enhanced-bot-message';
        textMessage.setAttribute('data-timestamp', Date.now());
        
        textMessage.innerHTML = `
            <div style="color: #333; line-height: 1.4;">🤖 ${text}</div>
        `;
        
        chatMessages.appendChild(textMessage);
        this.scrollToBottom(chatMessages);
    }

    getChatMessagesContainer() {
        // 1) Prefer the widget shadow root if present
        const shadow = this.getWidgetShadowRoot();
        if (shadow) {
            const shadowSelectors = [
                '[class*="messages"]',
                '[class*="message-list"]',
                '[data-testid*="messages"]',
                '[role="log"]',
                'main',
                'section'
            ];
            for (const sel of shadowSelectors) {
                const node = shadow.querySelector(sel);
                if (node) {
                    console.log('Using shadow messages container:', sel);
                    return node;
                }
            }
        }

        // 2) Fallback to light DOM containers
        const selectors = [
            '#n8n-chat [class*="message"]',
            '#n8n-chat [class*="chat"]',
            '#n8n-chat [class*="conversation"]',
            '#n8n-chat [class*="body"]',
            '#n8n-chat div[style*="flex-direction"]',
            '#n8n-chat div[style*="display: flex"]'
        ];
        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container) {
                console.log('Using light DOM messages container:', selector);
                return container;
            }
        }
        console.warn('Could not find chat messages container');
        return null;
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

    addVoiceMessageToChat(text, audioBlob) {
        const chatMessages = this.getChatMessagesContainer();
        if (!chatMessages) return;

        const voiceMessage = document.createElement('div');
        voiceMessage.className = 'enhanced-voice-message enhanced-user-message';
        voiceMessage.setAttribute('data-timestamp', Date.now());
        voiceMessage.style.cssText = `
            background: rgba(23, 162, 184, 0.1) !important;
            border-radius: 12px !important;
            padding: 12px !important;
            margin: 8px 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            border-left: 4px solid #17a2b8 !important;
            margin-left: 10% !important;
            align-self: flex-end !important;
        `;
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioId = `user-audio-${Date.now()}`;
        
        voiceMessage.innerHTML = `
            <span style="color: #333; font-family: Inter, Helvetica, Arial, sans-serif;">${text}</span>
            <button class="enhanced-play-button" onclick="document.getElementById('${audioId}').play()" title="Play back your voice message" style="
                background: #17a2b8;
                border: none;
                color: white;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            ">
                ▶
            </button>
            <audio id="${audioId}" controls preload="metadata" style="max-width: 150px;">
                <source src="${audioUrl}" type="${audioBlob.type}">
            </audio>
            <small style="color: #666; font-size: 11px;">Size: ${(audioBlob.size / 1024).toFixed(1)}KB</small>
        `;
        
        chatMessages.appendChild(voiceMessage);
        this.scrollToBottom(chatMessages);
    }

    addAudioMessageToChat(text, audioUrl) {
        const chatMessages = document.querySelector('#n8n-chat [class*="message"]') ||
                           document.querySelector('#n8n-chat [class*="chat"]');
        
        if (!chatMessages) return;

        const audioMessage = document.createElement('div');
        audioMessage.className = 'enhanced-voice-message';
        audioMessage.style.cssText = `
            background: rgba(40, 167, 69, 0.1);
            border-radius: 12px;
            padding: 12px;
            margin: 8px 0;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const audioId = `bot-audio-${Date.now()}`;
        
        audioMessage.innerHTML = `
            <button class="enhanced-play-button" onclick="document.getElementById('${audioId}').play()" style="
                background: #28a745;
                border: none;
                color: white;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            ">
                ▶
            </button>
            <audio id="${audioId}" class="enhanced-audio-player" controls preload="metadata" style="flex: 1; max-width: 200px;">
                <source src="${audioUrl}" type="audio/mpeg">
                <source src="${audioUrl}" type="audio/wav">
            </audio>
            <span style="color: #333; font-family: Inter, Helvetica, Arial, sans-serif;">${text}</span>
        `;
        
        chatMessages.appendChild(audioMessage);
        
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
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
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
