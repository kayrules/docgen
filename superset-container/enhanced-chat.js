(function () {
    'use strict';

    // Enhanced Chat Widget - Combining n8n styling with voice features
    
    /**
     * Enhanced Chat Widget Library
     * Combines the modern styling of n8n chat with advanced voice features
     */
    
    // Default configuration
    const DEFAULT_CONFIG = {
        webhookUrl: '',
        target: 'body',
        mode: 'window', // 'window' | 'fullscreen'
        theme: {
            primaryColor: '#007bff',
            secondaryColor: '#28a745',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        },
        initialMessages: [],
        showWindowCloseButton: true,
        allowFileUpload: false,
        placeholder: 'Type your message...',
        voiceEnabled: true,
        textToSpeechEnabled: true,
        autoPlayResponses: true,
        i18n: {
            en: {
                title: 'AI Chat',
                placeholder: 'Type your message...',
                sendButton: 'Send',
                voiceButton: 'Voice Message',
                closeButton: 'Close',
                voiceMessageSent: '🎤 Voice message sent',
                audioResponse: '🔊 Audio response',
                errorMessage: 'Something went wrong. Please try again.',
                microphoneError: 'Unable to access microphone. Please check your browser permissions.',
                ttsNotSupported: 'Text-to-speech not supported in this browser'
            }
        }
    };

    // Modern CSS styling inspired by n8n chat but enhanced for voice features
    const ENHANCED_STYLES = `
        .enhanced-chat {
            --chat-primary-color: #007bff;
            --chat-secondary-color: #28a745;
            --chat-danger-color: #dc3545;
            --chat-success-color: #28a745;
            --chat-warning-color: #ffc107;
            --chat-background: #ffffff;
            --chat-text-color: #333333;
            --chat-border-radius: 12px;
            --chat-box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            --chat-border-color: #e1e5e9;
            --chat-hover-bg: #f8f9fa;
            
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: var(--chat-text-color);
        }

        /* Chat Window Wrapper */
        .enhanced-chat-window-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
        }

        .enhanced-chat-window {
            width: 380px;
            height: 600px;
            background: var(--chat-background);
            border-radius: var(--chat-border-radius);
            box-shadow: var(--chat-box-shadow);
            border: 1px solid var(--chat-border-color);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .enhanced-chat-window.minimized {
            height: auto;
        }

        /* Chat Header */
        .enhanced-chat-header {
            background: linear-gradient(135deg, #1e7bb8 0%, #4db6e6 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: var(--chat-border-radius) var(--chat-border-radius) 0 0;
            position: relative;
            overflow: hidden;
        }

        .enhanced-chat-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="rhb-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="none"/><rect x="8" y="8" width="4" height="4" fill="rgba(255,255,255,0.1)" transform="rotate(45 10 10)"/></pattern></defs><rect width="100" height="100" fill="url(%23rhb-pattern)"/></svg>') repeat;
            opacity: 0.3;
            z-index: 0;
        }

        .enhanced-chat-heading {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .enhanced-chat-heading h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }

        .rhb-logo {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
            font-size: 16px;
        }

        .rhb-logo .rhb-diamond-header {
            width: 16px;
            height: 16px;
            background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAkACQAAD/4QCSRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAdqgAwAEAAAAAQAAAfQAAAAAQVNDSUkAAABTY3JlZW5zaG90');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        .enhanced-chat-close-button {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }

        .enhanced-chat-close-button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        /* Chat Body */
        .enhanced-chat-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Messages List */
        .enhanced-chat-messages-list {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scroll-behavior: smooth;
        }

        .enhanced-chat-messages-list::-webkit-scrollbar {
            width: 6px;
        }

        .enhanced-chat-messages-list::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .enhanced-chat-messages-list::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .enhanced-chat-messages-list::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        /* Chat Messages */
        .enhanced-chat-message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            position: relative;
            word-wrap: break-word;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .enhanced-chat-message.user {
            background: var(--chat-primary-color);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }

        .enhanced-chat-message.bot {
            background: var(--chat-hover-bg);
            color: var(--chat-text-color);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            border: 1px solid var(--chat-border-color);
        }

        .enhanced-chat-message.voice {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 12px;
        }

        .enhanced-chat-message.typing {
            background: var(--chat-hover-bg);
            border: 1px solid var(--chat-border-color);
            align-self: flex-start;
            animation: pulse 1.5s infinite;
        }

        /* Message Content Wrapper */
        .enhanced-message-content {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        }

        .enhanced-message-text {
            flex: 1;
        }

        /* Voice/Audio Controls */
        .enhanced-voice-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .enhanced-play-button {
            background: var(--chat-success-color);
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
            flex-shrink: 0;
        }

        .enhanced-play-button:hover {
            background: #218838;
            transform: scale(1.05);
        }

        .enhanced-play-button.user-play {
            background: rgba(255, 255, 255, 0.2);
            width: 24px;
            height: 24px;
            font-size: 10px;
        }

        .enhanced-play-button.user-play:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .enhanced-audio-player {
            flex: 1;
            height: 32px;
            max-width: 200px;
        }

        /* Typing Indicator */
        .enhanced-typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 0;
        }

        .enhanced-typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--chat-primary-color);
            animation: typingDot 1.4s infinite;
        }

        .enhanced-typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .enhanced-typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typingDot {
            0%, 60%, 100% {
                opacity: 0.3;
                transform: scale(0.8);
            }
            30% {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* Input Area */
        .enhanced-chat-inputs {
            padding: 16px;
            border-top: 1px solid var(--chat-border-color);
            background: var(--chat-background);
        }

        .enhanced-chat-input-container {
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }

        .enhanced-chat-input {
            flex: 1;
            border: 1px solid var(--chat-border-color);
            border-radius: 20px;
            padding: 12px 16px;
            resize: none;
            font-size: 14px;
            font-family: inherit;
            max-height: 120px;
            min-height: 20px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .enhanced-chat-input:focus {
            border-color: var(--chat-primary-color);
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }

        .enhanced-chat-input::placeholder {
            color: #999;
        }

        /* Control Buttons */
        .enhanced-chat-button {
            background: var(--chat-primary-color);
            border: none;
            color: white;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }

        .enhanced-chat-button:hover {
            background: #0056b3;
            transform: scale(1.05);
        }

        .enhanced-chat-button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .enhanced-chat-button.voice {
            background: var(--chat-success-color);
        }

        .enhanced-chat-button.voice:hover {
            background: #1e7e34;
        }

        .enhanced-chat-button.voice.recording {
            background: var(--chat-danger-color);
            animation: recordingPulse 1s infinite;
        }

        @keyframes recordingPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        /* Toggle Button (for minimized state) */
        .enhanced-chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1e7bb8;
            border: none;
            color: white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(30, 123, 184, 0.4);
            transition: all 0.3s ease;
            z-index: 9999;
        }

        .enhanced-chat-toggle:hover {
            background: #1661a0;
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(30, 123, 184, 0.6);
        }

        .enhanced-chat-toggle.hidden {
            display: none;
        }

        /* RHB Diamond Icon */
        .rhb-diamond {
            width: 24px;
            height: 24px;
            background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAkACQAAD/4QCSRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAdqgAwAEAAAAAQAAAfQAAAAAQVNDSUkAAABTY3JlZW5zaG90');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        /* Fullscreen Mode */
        .enhanced-chat.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: 100vh;
            z-index: 10000;
            background: var(--chat-background);
        }

        .enhanced-chat.fullscreen .enhanced-chat-window {
            width: 100%;
            height: 100%;
            border-radius: 0;
            box-shadow: none;
            border: none;
        }

        .enhanced-chat.fullscreen .enhanced-chat-header {
            border-radius: 0;
        }

        /* Error States */
        .enhanced-error-message {
            color: var(--chat-danger-color);
            font-size: 12px;
            text-align: center;
            padding: 8px;
            background: rgba(220, 53, 69, 0.1);
            border-radius: 8px;
            margin: 8px 0;
        }

        /* Loading States */
        .enhanced-loading {
            opacity: 0.6;
            pointer-events: none;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
            .enhanced-chat-window-wrapper {
                bottom: 10px;
                right: 10px;
                left: 10px;
            }
            
            .enhanced-chat-window {
                width: 100%;
                height: 70vh;
                max-height: 600px;
            }
        }

        /* Accessibility */
        .enhanced-chat button:focus {
            outline: 2px solid var(--chat-primary-color);
            outline-offset: 2px;
        }

        .enhanced-chat *:focus-visible {
            outline: 2px solid var(--chat-primary-color);
            outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .enhanced-chat {
                --chat-border-color: #000;
                --chat-text-color: #000;
            }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .enhanced-chat * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        /* Alert System */
        .enhanced-chat-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 320px;
            padding: 16px;
            background: var(--chat-success-color);
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(40, 167, 69, 0.3);
            z-index: 10001;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.4;
            transform: translateX(calc(100% + 20px));
            transition: transform 0.3s ease;
            display: none;
        }

        .enhanced-chat-alert.show {
            display: block;
            transform: translateX(0);
        }

        .enhanced-chat-alert.error {
            background: var(--chat-danger-color);
            box-shadow: 0 4px 16px rgba(220, 53, 69, 0.3);
        }

        .enhanced-chat-alert.warning {
            background: var(--chat-warning-color);
            color: #333;
            box-shadow: 0 4px 16px rgba(255, 193, 7, 0.3);
        }

        .enhanced-chat-alert.info {
            background: #17a2b8;
            box-shadow: 0 4px 16px rgba(23, 162, 184, 0.3);
        }

        .enhanced-chat-alert.success {
            background: var(--chat-success-color);
            box-shadow: 0 4px 16px rgba(40, 167, 69, 0.3);
        }

        .enhanced-chat-alert-close {
            position: absolute;
            top: 8px;
            right: 12px;
            background: none;
            border: none;
            color: inherit;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }

        .enhanced-chat-alert-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .enhanced-chat-alert-content {
            margin-right: 24px;
        }

        /* Alert Mode Toggle */
        .enhanced-alert-mode-btn {
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            margin-bottom: 8px;
            transition: all 0.2s ease;
            font-weight: 600;
            width: 100%;
        }

        .enhanced-alert-mode-btn:hover {
            background: #5a6268;
        }

        .enhanced-alert-mode-btn.active {
            background: var(--chat-danger-color);
            animation: alertPulse 2s infinite;
        }

        @keyframes alertPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        .enhanced-chat-input-container.alert-mode .enhanced-chat-input {
            background: #fff3cd;
            border-color: var(--chat-warning-color);
            color: #856404;
        }

        .enhanced-chat-input-container.alert-mode .enhanced-chat-input:focus {
            border-color: var(--chat-danger-color);
            box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
        }

        .enhanced-chat-input-container.alert-mode .enhanced-chat-button:not(.voice) {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;

    // Enhanced Chat Widget Class
    class EnhancedChatWidget {
        constructor(options = {}) {
            this.config = this.mergeConfig(DEFAULT_CONFIG, options);
            this.isOpen = false;
            this.isMinimized = true; // Start minimized by default
            this.isRecording = false;
            this.mediaRecorder = null;
            this.audioChunks = [];
            this.elements = {};
            this.currentAudio = null;
            this.alertTimeout = null;
            this.isAlertMode = false;
            
            this.init();
        }

        mergeConfig(defaultConfig, userConfig) {
            const merged = { ...defaultConfig };
            
            Object.keys(userConfig).forEach(key => {
                if (key === 'theme' && typeof userConfig[key] === 'object') {
                    merged[key] = { ...defaultConfig[key], ...userConfig[key] };
                } else if (key === 'i18n' && typeof userConfig[key] === 'object') {
                    merged[key] = {
                        ...defaultConfig[key],
                        en: { ...defaultConfig[key].en, ...userConfig[key].en }
                    };
                } else {
                    merged[key] = userConfig[key];
                }
            });
            
            return merged;
        }

        init() {
            this.injectStyles();
            this.createWidget();
            this.bindEvents();
            this.addInitialMessages();
            
            if (this.config.mode === 'fullscreen') {
                this.openFullscreen();
            } else {
                // Start in minimized state with toggle button visible
                this.close();
            }
        }

        injectStyles() {
            // Skip style injection - use external n8n CSS instead
            // The external CSS should be loaded before initializing the chat
            if (document.getElementById('enhanced-chat-styles')) return;
            
            // Only inject minimal custom styles that aren't covered by n8n CSS
            const minimalStyles = `
                /* RHB Diamond Icons */
                .rhb-diamond {
                    width: 24px;
                    height: 24px;
                    background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAkACQAAD/4QCSRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAdqgAwAEAAAAAQAAAfQAAAAAQVNDSUkAAABTY3JlZW5zaG90');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
                .rhb-logo .rhb-diamond-header {
                    width: 16px;
                    height: 16px;
                    background-image: url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAkACQAAD/4QCSRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAIdpAAQAAAABAAAATgAAAAAAAACQAAAAAQAAAJAAAAABAAOShgAHAAAAEgAAAHigAgAEAAAAAQAAAdqgAwAEAAAAAQAAAfQAAAAAQVNDSUkAAABTY3JlZW5zaG90');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
                
                /* Alert mode specific styles */
                .enhanced-alert-mode-btn {
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 12px;
                    font-size: 12px;
                    cursor: pointer;
                    margin-bottom: 8px;
                    transition: all 0.2s ease;
                    font-weight: 600;
                    width: 100%;
                }
                .enhanced-alert-mode-btn.active {
                    background: #dc3545;
                    animation: alertPulse 2s infinite;
                }
                @keyframes alertPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'enhanced-chat-styles';
            styleSheet.textContent = minimalStyles;
            document.head.appendChild(styleSheet);
        }

        createWidget() {
            const target = typeof this.config.target === 'string' 
                ? document.querySelector(this.config.target) 
                : this.config.target;

            if (!target) {
                console.error('Enhanced Chat: Target element not found');
                return;
            }

            const widgetHTML = this.getWidgetHTML();
            const widgetContainer = document.createElement('div');
            widgetContainer.innerHTML = widgetHTML;
            
            target.appendChild(widgetContainer.firstElementChild);
            
            // Store element references
            this.elements = {
                wrapper: document.querySelector('.chat-wrapper'),
                window: document.querySelector('.chat-window'),
                header: document.querySelector('.chat-header'),
                closeBtn: document.querySelector('.chat-close-button'),
                messagesList: document.querySelector('.chat-messages-list'),
                input: document.querySelector('.chat-input'),
                sendBtn: document.querySelector('.chat-send-button'),
                voiceBtn: document.querySelector('.chat-voice-button'),
                toggleBtn: document.querySelector('.chat-toggle'),
                alert: document.querySelector('.chat-alert'),
                alertContent: document.querySelector('.chat-alert-content'),
                alertClose: document.querySelector('.chat-alert-close'),
                alertModeBtn: document.querySelector('#enhanced-alert-mode-btn'),
                inputContainer: document.querySelector('.chat-input-container')
            };
        }

        getWidgetHTML() {
            const { i18n } = this.config;
            const t = (key) => i18n.en[key] || key;

            return `
                <div class="chat-wrapper" style="display: none;">
                    <div class="chat-window">
                        <div class="chat-header">
                            <div class="chat-heading">
                                <div class="rhb-logo">
                                    <div class="rhb-diamond-header"></div>
                                    <span>RHB</span>
                                </div>
                                <h1>${t('title')}</h1>
                            </div>
                            ${this.config.showWindowCloseButton ? `
                                <button class="chat-close-button" title="${t('closeButton')}" aria-label="${t('closeButton')}">
                                    ×
                                </button>
                            ` : ''}
                        </div>
                        <div class="chat-body">
                            <div class="chat-messages-list" role="log" aria-live="polite" aria-label="Chat messages">
                            </div>
                        </div>
                        <div class="chat-inputs">
                            <button class="enhanced-alert-mode-btn" id="enhanced-alert-mode-btn" title="Toggle Alert Mode">
                                🚨 Alert Mode: OFF
                            </button>
                            <div class="chat-input-container">
                                <textarea 
                                    class="chat-input" 
                                    placeholder="${t('placeholder')}" 
                                    rows="1"
                                    aria-label="${t('placeholder')}"
                                ></textarea>
                                <button class="chat-button chat-send-button" title="${t('sendButton')}" aria-label="${t('sendButton')}">
                                    →
                                </button>
                                ${this.config.voiceEnabled ? `
                                    <button class="chat-button voice chat-voice-button" title="${t('voiceButton')}" aria-label="${t('voiceButton')}">
                                        🎤
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="chat-alert">
                        <button class="chat-alert-close" aria-label="Close alert">&times;</button>
                        <div class="chat-alert-content"></div>
                    </div>
                    <button class="chat-toggle" title="Open RHB Chat" aria-label="Open RHB Chat">
                        <div class="rhb-diamond"></div>
                    </button>
                </div>
            `;
        }

        bindEvents() {
            // Send button
            this.elements.sendBtn?.addEventListener('click', () => this.sendMessage());
            
            // Voice button
            this.elements.voiceBtn?.addEventListener('click', () => this.toggleVoiceRecording());
            
            // Close button
            this.elements.closeBtn?.addEventListener('click', () => this.close());
            
            // Toggle button (floating diamond button)
            this.elements.toggleBtn?.addEventListener('click', () => this.open());
            
            // Alert close button
            this.elements.alertClose?.addEventListener('click', () => this.hideAlert());
            
            // Alert mode toggle button
            this.elements.alertModeBtn?.addEventListener('click', () => this.toggleAlertMode());
            
            // Input events
            this.elements.input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!this.isAlertMode) {
                        this.sendMessage();
                    }
                }
            });

            this.elements.input?.addEventListener('input', () => {
                this.autoResizeTextarea();
            });

            // Toggle button (for minimized state)
            this.elements.toggleBtn?.addEventListener('click', () => this.toggle());
        }

        autoResizeTextarea() {
            const textarea = this.elements.input;
            if (!textarea) return;
            
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }

        addInitialMessages() {
            if (this.config.initialMessages && this.config.initialMessages.length > 0) {
                this.config.initialMessages.forEach(message => {
                    this.addMessage(message, false);
                });
            }
        }

        addMessage(content, isUser = false, isVoice = false, audioUrl = null, autoPlay = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}${isVoice ? ' voice' : ''}`;
            messageDiv.setAttribute('role', 'article');
            messageDiv.setAttribute('aria-label', `${isUser ? 'User' : 'Bot'} message`);

            if (isVoice && audioUrl) {
                this.createVoiceMessage(messageDiv, content, audioUrl, isUser, autoPlay);
            } else if (isUser && this.config.textToSpeechEnabled) {
                this.createUserMessage(messageDiv, content, audioUrl);
            } else {
                this.createTextMessage(messageDiv, content);
            }

            this.elements.messagesList.appendChild(messageDiv);
            this.scrollToBottom();
            
            return messageDiv;
        }

        createVoiceMessage(messageDiv, content, audioUrl, isUser, autoPlay) {
            const audioId = `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            messageDiv.innerHTML = `
                <div class="enhanced-message-content">
                    <div class="enhanced-voice-controls">
                        <button class="enhanced-play-button" onclick="document.getElementById('${audioId}').play()" aria-label="Play audio message">
                            ▶
                        </button>
                        <audio id="${audioId}" class="enhanced-audio-player" controls preload="metadata">
                            <source src="${audioUrl}" type="audio/mpeg">
                            <source src="${audioUrl}" type="audio/wav">
                            <source src="${audioUrl}" type="audio/mp3">
                            Your browser does not support audio playback.
                        </audio>
                    </div>
                    <span class="enhanced-message-text">${content || 'Voice message'}</span>
                </div>
            `;

            // Auto-play for bot messages if enabled
            if (autoPlay && !isUser && this.config.autoPlayResponses) {
                setTimeout(() => {
                    const audioElement = document.getElementById(audioId);
                    if (audioElement) {
                        this.setupAudioAutoPlay(audioElement);
                    }
                }, 100);
            }
        }

        createUserMessage(messageDiv, content, audioUrl = null) {
            if (audioUrl) {
                // Voice message with playback
                const audioId = `user-audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                messageDiv.innerHTML = `
                    <div class="enhanced-message-content">
                        <span class="enhanced-message-text">${content}</span>
                        <button class="enhanced-play-button user-play" title="Play back your voice message" onclick="document.getElementById('${audioId}').play()" aria-label="Play back voice message">
                            🔊
                        </button>
                        <audio id="${audioId}" style="display: none;" preload="metadata">
                            <source src="${audioUrl}" type="audio/wav">
                            <source src="${audioUrl}" type="audio/mpeg">
                        </audio>
                    </div>
                `;
            } else {
                // Text message with TTS
                messageDiv.innerHTML = `
                    <div class="enhanced-message-content">
                        <span class="enhanced-message-text">${content}</span>
                        <button class="enhanced-play-button user-play" title="Play back your message" onclick="window.enhancedChatWidget.playUserMessage('${content.replace(/'/g, "\\'")}');" aria-label="Play text message">
                            🔊
                        </button>
                    </div>
                `;
            }
        }

        createTextMessage(messageDiv, content) {
            messageDiv.innerHTML = `<span class="enhanced-message-text">${content}</span>`;
        }

        setupAudioAutoPlay(audioElement) {
            // Enhanced audio setup with better error handling
            audioElement.addEventListener('loadstart', () => console.log('Audio load started'));
            audioElement.addEventListener('loadedmetadata', () => console.log('Audio metadata loaded'));
            audioElement.addEventListener('canplay', () => console.log('Audio can play'));
            audioElement.addEventListener('error', (e) => console.error('Audio error:', e));

            audioElement.load();
            
            setTimeout(() => {
                const playPromise = audioElement.play();
                if (playPromise) {
                    playPromise.then(() => {
                        console.log('Audio auto-play succeeded');
                        this.currentAudio = audioElement;
                    }).catch(error => {
                        console.warn('Auto-play failed (user interaction may be required):', error);
                        this.indicateAudioReady(audioElement);
                    });
                }
            }, 300);
        }

        indicateAudioReady(audioElement) {
            const playBtn = audioElement.parentElement.querySelector('.enhanced-play-button');
            if (playBtn) {
                playBtn.style.animation = 'recordingPulse 2s 3';
                playBtn.style.backgroundColor = '#ff6b6b';
                playBtn.title = 'Click to play audio response';
            }
        }

        showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'enhanced-chat-message typing';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="enhanced-typing-indicator">
                    <div class="enhanced-typing-dot"></div>
                    <div class="enhanced-typing-dot"></div>
                    <div class="enhanced-typing-dot"></div>
                </div>
            `;
            
            this.elements.messagesList.appendChild(typingDiv);
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        async sendMessage() {
            // Prevent text messages in alert mode
            if (this.isAlertMode) {
                this.showAlert('Text messages are disabled in Alert Mode. Use voice only.', 'warning');
                return;
            }

            const message = this.elements.input.value.trim();
            if (!message) return;

            this.addMessage(message, true);
            this.elements.input.value = '';
            this.autoResizeTextarea();
            this.setLoading(true);
            this.showTypingIndicator();

            try {
                const messageData = { message: { text: message } };
                // Add alertMode flag if in alert mode
                if (this.isAlertMode) {
                    messageData.message.alertMode = true;
                }
                await this.sendToWebhook(messageData);
            } catch (error) {
                console.error('Error sending message:', error);
                this.addMessage(this.config.i18n.en.errorMessage, false);
                this.showAlert(`Failed to send message: ${error.message}`, 'error');
            } finally {
                this.setLoading(false);
                this.hideTypingIndicator();
            }
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
                this.elements.voiceBtn.classList.add('recording');
                this.elements.voiceBtn.innerHTML = '⏹';
                
            } catch (error) {
                console.error('Error accessing microphone:', error);
                this.addMessage(this.config.i18n.en.microphoneError, false);
                this.showAlert('Microphone access denied. Please check your browser permissions.', 'warning');
            }
        }

        stopRecording() {
            if (this.mediaRecorder && this.isRecording) {
                this.mediaRecorder.stop();
                this.isRecording = false;
                this.elements.voiceBtn.classList.remove('recording');
                this.elements.voiceBtn.innerHTML = '🎤';
            }
        }

        async sendVoiceMessage(audioBlob) {
            const userAudioUrl = URL.createObjectURL(audioBlob);
            this.addMessage(this.config.i18n.en.voiceMessageSent, true, true, userAudioUrl);
            this.setLoading(true);
            this.showTypingIndicator();

            try {
                const messageData = { audio: audioBlob, voice: true };
                // Add alertMode flag if in alert mode
                if (this.isAlertMode) {
                    messageData.alertMode = true;
                }
                await this.sendToWebhook(messageData);
            } catch (error) {
                console.error('Error sending voice message:', error);
                this.addMessage(this.config.i18n.en.errorMessage, false);
                this.showAlert(`Voice message failed: ${error.message}`, 'error');
            } finally {
                this.setLoading(false);
                this.hideTypingIndicator();
            }
        }

        async sendToWebhook(data) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 180000);

            try {
                const formData = new FormData();
                
                if (data.audio) {
                    const messageData = { voice: true };
                    // Add alertMode flag if present
                    if (data.alertMode) {
                        messageData.alertMode = true;
                    }
                    formData.append('audio', data.audio, 'voice-message.wav');
                    formData.append('message', JSON.stringify(messageData));
                } else {
                    formData.append('message', JSON.stringify(data));
                }

                // Support both absolute and relative URLs
                const webhookUrl = this.config.webhookUrl.startsWith('http') 
                    ? this.config.webhookUrl 
                    : `${window.location.origin}${this.config.webhookUrl}`;

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg, audio/*;q=0.9, application/json;q=0.8, */*;q=0.5'
                    },
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                await this.handleResponse(response);
                
            } catch (error) {
                clearTimeout(timeoutId);
                throw error;
            }
        }

        async handleResponse(response) {
            const contentType = response.headers.get('content-type') || '';
            
            if (contentType.includes('audio/')) {
                await this.handleAudioResponse(response, contentType);
            } else {
                await this.handleJSONResponse(response);
            }
        }

        async handleAudioResponse(response, contentType) {
            const audioBlob = await response.blob();
            
            if (audioBlob.size > 0) {
                const typedAudioBlob = new Blob([audioBlob], { type: contentType });
                const audioUrl = URL.createObjectURL(typedAudioBlob);
                this.addMessage(this.config.i18n.en.audioResponse, false, true, audioUrl, true);
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

            // Handle text-only responses
            if (data.textOnly === "true" || data.textOnly === true) {
                if (data.text) {
                    this.addMessage(data.text, false);
                }
                return;
            }

            // Handle regular responses
            if (data.text) {
                this.addMessage(data.text, false);
                this.showAlert('Message sent successfully!', 'success', 3000);
            }

            if (data.voice && data.voiceUrl) {
                this.addMessage('Voice response', false, true, data.voiceUrl, true);
                this.showAlert('Voice response received!', 'success', 3000);
            }
        }

        playUserMessage(text) {
            if (!this.config.textToSpeechEnabled) {
                this.addMessage(this.config.i18n.en.ttsNotSupported, false);
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

        showAlert(message, type = 'success', duration = 5000) {
            if (!this.elements.alert || !this.elements.alertContent) return;
            
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
            }

            // Clear existing classes
            this.elements.alert.className = 'enhanced-chat-alert';
            this.elements.alert.classList.add(type);
            
            this.elements.alertContent.textContent = message;
            this.elements.alert.classList.add('show');

            // Auto-hide after duration
            if (duration > 0) {
                this.alertTimeout = setTimeout(() => {
                    this.hideAlert();
                }, duration);
            }
        }

        hideAlert() {
            if (!this.elements.alert) return;
            
            this.elements.alert.classList.remove('show');
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
                this.alertTimeout = null;
            }
        }

        toggleAlertMode() {
            this.isAlertMode = !this.isAlertMode;

            if (this.isAlertMode) {
                this.elements.alertModeBtn.textContent = '🚨 Alert Mode: ON';
                this.elements.alertModeBtn.classList.add('active');
                this.elements.inputContainer.classList.add('alert-mode');
                this.elements.input.placeholder = 'Alert mode: Voice only';
                this.showAlert('Alert Mode enabled! Only voice messages allowed.', 'warning', 3000);
            } else {
                this.elements.alertModeBtn.textContent = '🚨 Alert Mode: OFF';
                this.elements.alertModeBtn.classList.remove('active');
                this.elements.inputContainer.classList.remove('alert-mode');
                this.elements.input.placeholder = this.config.placeholder;
                this.showAlert('Alert Mode disabled. Text and voice messages enabled.', 'info', 3000);
            }
        }

        setLoading(isLoading) {
            this.elements.sendBtn.disabled = isLoading;
            if (this.elements.voiceBtn) {
                this.elements.voiceBtn.disabled = isLoading;
            }
            
            if (isLoading) {
                this.elements.window.classList.add('enhanced-loading');
            } else {
                this.elements.window.classList.remove('enhanced-loading');
            }
        }

        scrollToBottom() {
            this.elements.messagesList.scrollTop = this.elements.messagesList.scrollHeight;
        }

        close() {
            this.elements.wrapper.style.display = 'none';
            this.elements.toggleBtn.style.display = 'flex';
            this.isOpen = false;
            this.isMinimized = true;
        }

        open() {
            this.elements.wrapper.style.display = 'block';
            this.elements.toggleBtn.style.display = 'none';
            this.isOpen = true;
            this.isMinimized = false;
            
            // Show welcome alert when chat is opened
            setTimeout(() => {
                this.showAlert('Welcome to RHB Enhanced Chat! Try the 🚨 Alert Mode for voice-only communication.', 'info', 4000);
            }, 500);
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        minimize() {
            this.elements.window.classList.add('minimized');
            this.isMinimized = true;
        }

        maximize() {
            this.elements.window.classList.remove('minimized');
            this.isMinimized = false;
        }

        openFullscreen() {
            document.body.classList.add('enhanced-chat', 'fullscreen');
            this.elements.wrapper.classList.add('fullscreen');
        }

        destroy() {
            // Clean up event listeners and elements
            if (this.mediaRecorder) {
                this.mediaRecorder.stop();
            }
            
            if (this.currentAudio) {
                this.currentAudio.pause();
            }
            
            if (this.alertTimeout) {
                clearTimeout(this.alertTimeout);
                this.alertTimeout = null;
            }
            
            this.elements.wrapper?.remove();
            
            const styles = document.getElementById('enhanced-chat-styles');
            if (styles) {
                styles.remove();
            }
        }
    }

    // Export the createChat function similar to n8n
    function createChat(options = {}) {
        // Validate required options
        if (!options.webhookUrl) {
            console.error('Enhanced Chat: webhookUrl is required');
            return null;
        }

        // Create and return the widget instance
        const widget = new EnhancedChatWidget(options);
        
        // Make it globally accessible for debugging
        window.enhancedChatWidget = widget;
        
        return widget;
    }

    // Auto-initialize if script is loaded directly
    if (typeof window !== 'undefined') {
        window.createChat = createChat;
        window.EnhancedChatWidget = EnhancedChatWidget;
    }

    // Module export support
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { createChat, EnhancedChatWidget };
    }

    // ES Module export support
    if (typeof window !== 'undefined') {
        window.enhancedChatExports = { createChat, EnhancedChatWidget };
    }

})();
