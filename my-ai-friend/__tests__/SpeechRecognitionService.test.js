
// Mocks
jest.mock('@react-native-voice/voice', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn(),
  removeAllListeners: jest.fn(),
  onSpeechStart: jest.fn(),
  onSpeechEnd: jest.fn(),
  onSpeechResults: jest.fn(),
  onSpeechPartialResults: jest.fn(),
}));

import SpeechRecognitionService from '../src/services/SpeechRecognitionService';
import Voice from '@react-native-voice/voice';

describe('SpeechRecognitionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset service internal state if possible, but singleton patterns are hard to reset.
    // We assume methods work on the instance.
    SpeechRecognitionService.isListening = false;
    SpeechRecognitionService.listeners = {};
  });

  it('should start listening', async () => {
    await SpeechRecognitionService.startListening();
    expect(Voice.start).toHaveBeenCalledWith('en-US');
    expect(SpeechRecognitionService.isListening).toBe(true);
  });

  it('should emit wake_word_detected when "jervis" is heard', () => {
    const wakeWordCallback = jest.fn();
    SpeechRecognitionService.on('wake_word_detected', wakeWordCallback);

    // Simulate partial result
    SpeechRecognitionService.onSpeechPartialResults({
      value: ['Hello Jervis how are you']
    });

    expect(wakeWordCallback).toHaveBeenCalledWith('hello jervis how are you');
  });

  it('should not emit wake_word_detected when "jervis" is NOT heard', () => {
    const wakeWordCallback = jest.fn();
    SpeechRecognitionService.on('wake_word_detected', wakeWordCallback);

    // Simulate partial result
    SpeechRecognitionService.onSpeechPartialResults({
      value: ['Hello friend how are you']
    });

    expect(wakeWordCallback).not.toHaveBeenCalled();
  });

  it('should emit results', () => {
    const resultCallback = jest.fn();
    SpeechRecognitionService.on('result', resultCallback);

    SpeechRecognitionService.onSpeechResults({
      value: ['Final command']
    });

    expect(resultCallback).toHaveBeenCalledWith('Final command');
  });
});
