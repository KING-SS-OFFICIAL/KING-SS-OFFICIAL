import Voice from '@react-native-voice/voice';

class SpeechRecognitionService {
  constructor() {
    this.isListening = false;
    this.listeners = {};

    // Bind methods
    this.onSpeechStart = this.onSpeechStart.bind(this);
    this.onSpeechEnd = this.onSpeechEnd.bind(this);
    this.onSpeechResults = this.onSpeechResults.bind(this);
    this.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    this.onSpeechError = this.onSpeechError.bind(this);

    // Initialize Voice
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechError = this.onSpeechError;
  }

  // Event registration
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  async startListening() {
    try {
      if (this.isListening) {
        return;
      }
      console.log('Starting Voice...');
      await Voice.start('en-US');
      this.isListening = true;
    } catch (e) {
      console.error('Error starting voice:', e);
      this.isListening = false;
    }
  }

  async stopListening() {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (e) {
      console.error('Error stopping voice:', e);
    }
  }

  async destroy() {
    try {
      await Voice.destroy();
      Voice.removeAllListeners();
      this.isListening = false;
    } catch (e) {
      console.error('Error destroying voice:', e);
    }
  }

  onSpeechStart(e) {
    console.log('Speech Started', e);
    this.emit('start', e);
  }

  onSpeechEnd(e) {
    console.log('Speech Ended', e);
    this.isListening = false;
    this.emit('end', e);
  }

  onSpeechError(e) {
    console.log('Speech Error', e);
    this.isListening = false;
    this.emit('error', e);
  }

  onSpeechResults(e) {
    console.log('Speech Results', e);
    if (e.value && e.value.length > 0) {
      this.emit('result', e.value[0]);
    }
  }

  onSpeechPartialResults(e) {
    // Check for wake word in partial results
    if (e.value && e.value.length > 0) {
      const text = e.value[0].toLowerCase();
      // Phonetic variations of "Jervis" / "Jarvis"
      if (text.includes('jarvis') || text.includes('jervis') || text.includes('service') || text.includes('javis')) {
        this.emit('wake_word_detected', text);
      }
      this.emit('partial_result', text);
    }
  }
}

export default new SpeechRecognitionService();
