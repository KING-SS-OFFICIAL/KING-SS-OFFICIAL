import * as Speech from 'expo-speech';

/**
 * Text-to-Speech service wrapper around expo-speech.
 */
class VoiceService {
  constructor() {
    this.options = {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    };
  }

  speak(text) {
    Speech.speak(text, this.options);
  }

  stop() {
    Speech.stop();
  }

  async isSpeaking() {
    return await Speech.isSpeakingAsync();
  }

  /**
   * Configure voice settings
   * @param {Object} options - { language, pitch, rate }
   */
  configure(options) {
    this.options = { ...this.options, ...options };
  }
}

export default new VoiceService();
