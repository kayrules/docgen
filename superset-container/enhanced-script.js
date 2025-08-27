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

// Enhanced styles for voice features
const ENHANCED_VOICE_STYLES = `
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
                        // Skip our own enhanced UI elements and controls
                        if (
                            node.matches('.enhanced-voice-message, .enhanced-play-button, .enhanced-notification, .enhanced-voice-button, .enhanced-input-container, button, audio')
                        ) {
                            continue;
                        }
                        this.enhanceMessage(node);
                    }
                }
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

            // Handle the response ourselves and return a mock response to prevent n8n from displaying it again
            await this.handleResponse(response.clone());
            
            // Return a mock successful response to satisfy n8n but prevent duplicate display
            return new Response(JSON.stringify({status: 'handled'}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
        } catch (error) {
            console.error('Error sending text message:', error);
            this.showNotification(`Message failed: ${error.message}`, 'error');
            throw error;
        }
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
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.audioChunks.push(event.data);
            });

            this.mediaRecorder.addEventListener('stop', async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                await this.sendVoiceMessage(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            });

            this.mediaRecorder.start();
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

        // Handle text responses
        if (data.text) {
            console.log('Adding text message to chat:', data.text);
            this.addTextMessageToChat(data.text);
            this.showNotification('Response received!', 'success', 2000);
        }

        // Handle voice responses
        if (data.voice && data.voiceUrl) {
            this.addAudioMessageToChat('🔊 Voice response', data.voiceUrl);
            this.showNotification('Voice response received!', 'success', 3000);
        }
    }

    addTextMessageToChat(text) {
        const chatMessages = document.querySelector('#n8n-chat [class*="message"]') ||
                           document.querySelector('#n8n-chat [class*="chat"]');
        
        if (!chatMessages) {
            console.warn('Could not find chat messages container');
            return;
        }

        const textMessage = document.createElement('div');
        textMessage.className = 'enhanced-text-message';
        textMessage.style.cssText = `
            background: #f8f9fa;
            border-radius: 12px;
            padding: 12px;
            margin: 8px 0;
            border-left: 4px solid #007bff;
            font-family: Inter, Helvetica, Arial, sans-serif;
        `;
        
        textMessage.innerHTML = `
            <div style="color: #333; line-height: 1.4;">${text}</div>
        `;
        
        chatMessages.appendChild(textMessage);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addVoiceMessageToChat(text, audioBlob) {
        const chatMessages = document.querySelector('#n8n-chat [class*="message"]') ||
                           document.querySelector('#n8n-chat [class*="chat"]');
        
        if (!chatMessages) return;

        const voiceMessage = document.createElement('div');
        voiceMessage.className = 'enhanced-voice-message';
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioId = `user-audio-${Date.now()}`;
        
        voiceMessage.innerHTML = `
            <span>${text}</span>
            <button class="enhanced-play-button" onclick="document.getElementById('${audioId}').play()" title="Play back your voice message">
                ▶
            </button>
            <audio id="${audioId}" style="display: none;" preload="metadata">
                <source src="${audioUrl}" type="audio/wav">
            </audio>
        `;
        
        chatMessages.appendChild(voiceMessage);
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
