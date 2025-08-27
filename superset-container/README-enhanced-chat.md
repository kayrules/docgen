# Enhanced RHB Chat with Voice Features

This enhanced chat system builds upon the existing n8n chat widget to add comprehensive voice messaging capabilities while maintaining the original styling and branding.

## Features

### 🎤 Voice Messaging
- **Voice Recording**: Click the microphone button to record voice messages
- **Voice Playback**: Automatic playback of bot voice responses
- **Audio Controls**: Play/pause controls for all audio messages
- **High-Quality Audio**: Supports WAV, MP3, and other common audio formats

### 💬 Text Messaging
- **Standard Text Chat**: Full compatibility with existing n8n chat features
- **Text-to-Speech**: Click the speaker button on any message to hear it spoken
- **Rich Message Support**: Supports all existing message types and formatting

### 🚨 Alert Mode
- **Voice-Only Communication**: Toggle alert mode to disable text input and force voice-only interaction
- **Emergency Features**: Visual indicators and special handling for urgent communications
- **Quick Toggle**: Easy on/off switch for alert mode

### 🔔 Notification System
- **Real-time Feedback**: Success, error, and informational notifications
- **Auto-dismiss**: Notifications automatically disappear after a set time
- **User-friendly Messages**: Clear, actionable feedback for all operations

## API Integration

### Webhook Endpoint
The enhanced chat sends both text and voice messages to:
```
/webhook/3157e7f7-34a4-4c1e-a9af-b0b0c077e2aa
```

### Message Format

#### Text Messages
```javascript
{
  message: {
    text: "User's text message",
    alertMode: false // or true if in alert mode
  }
}
```

#### Voice Messages
```javascript
FormData {
  audio: Blob, // WAV audio file
  message: JSON.stringify({
    voice: true,
    alertMode: false // or true if in alert mode
  })
}
```

### Response Format

#### Text Response
```javascript
{
  text: "Bot response text",
  textOnly: false
}
```

#### Audio Response
```javascript
// Direct audio file (audio/mpeg, audio/wav, etc.)
// OR JSON with audio URL:
{
  text: "Bot response text",
  voice: true,
  voiceUrl: "https://example.com/audio.mp3"
}
```

## Usage

### Basic Setup
The enhanced chat is automatically initialized when the page loads. No additional setup required.

### Voice Recording
1. Click the 🎤 microphone button
2. Speak your message
3. Click the ⏹ stop button (or the button again)
4. The message is automatically sent

### Alert Mode
1. Click the "🚨 Alert Mode: OFF" button
2. Text input becomes disabled
3. Only voice messages are allowed
4. Click again to disable alert mode

### Playing Messages
- **Bot Audio**: Automatically plays when received (if browser allows)
- **Text-to-Speech**: Click the 🔊 speaker button on any message
- **Voice Playback**: Click the ▶ play button on voice messages

## Browser Compatibility

### Required Features
- **MediaRecorder API**: For voice recording
- **Web Audio API**: For audio playback
- **FormData**: For file uploads
- **Fetch API**: For HTTP requests

### Supported Browsers
- Chrome 49+
- Firefox 29+
- Safari 14+
- Edge 18+

### Browser Permissions
The chat will request microphone permission when you first try to record a voice message. Make sure to allow microphone access for full functionality.

## Customization

### Configuration Options
```javascript
createChat({
  target: '#n8n-chat',
  webhookUrl: '/webhook/3157e7f7-34a4-4c1e-a9af-b0b0c077e2aa',
  voiceEnabled: true,              // Enable voice features
  textToSpeechEnabled: true,       // Enable text-to-speech
  autoPlayResponses: true,         // Auto-play bot audio responses
  alertModeEnabled: true,          // Enable alert mode toggle
  initialMessages: [...],          // Initial chat messages
  chatWindowConfig: {...}          // n8n chat configuration
});
```

### Styling
The enhanced features use the existing n8n chat styling with additional CSS for voice controls. All styles are defined in `index.html` and can be customized as needed.

## Technical Details

### File Structure
- `enhanced-script.js`: Main enhanced chat implementation
- `script.js`: Original n8n chat library (unchanged)
- `index.html`: Main page with enhanced chat initialization
- `enhanced-chat.js`: Reference implementation (not used in production)

### Architecture
The enhanced chat wraps around the original n8n chat using a decorator pattern:
1. Creates the original n8n chat instance
2. Enhances the DOM with voice controls
3. Intercepts and extends message handling
4. Maintains full compatibility with existing features

### Error Handling
- Graceful microphone permission handling
- Audio playback fallbacks
- Network error recovery
- User-friendly error messages

## Troubleshooting

### Common Issues

#### Microphone Not Working
- Check browser permissions
- Ensure HTTPS (required for microphone access)
- Try refreshing the page

#### Audio Not Playing
- Check browser audio settings
- Ensure audio files are accessible
- Try clicking to play manually (some browsers block auto-play)

#### Alert Mode Not Working
- Ensure JavaScript is enabled
- Check for console errors
- Verify DOM elements are loaded

### Debug Mode
Open browser developer tools and check the console for detailed error messages and debug information.

## Updates and Maintenance

### Version Compatibility
This enhanced chat is designed to work with n8n chat version 0.50.0. Updates to the base n8n chat may require corresponding updates to the enhanced features.

### Future Enhancements
- Real-time voice streaming
- Voice activity detection
- Multi-language TTS support
- Audio transcription display
- Voice command recognition

## Support

For issues or questions about the enhanced chat features, check the browser console for error messages and ensure all required permissions are granted.
