import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

import AIService from '../services/AIService';
import VoiceService from '../services/VoiceService';
import SpeechRecognitionService from '../services/SpeechRecognitionService';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [persona, setPersona] = useState('');

  // Voice toggle state (auto-read responses)
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingCommand, setIsProcessingCommand] = useState(false);

  // Refs for checking state inside event listeners
  const isListeningRef = useRef(false);
  const isProcessingCommandRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    isProcessingCommandRef.current = isProcessingCommand;
  }, [isProcessingCommand]);

  useEffect(() => {
    loadSettings();
    requestPermissions();
    const cleanupSpeech = setupSpeechRecognition();

    setMessages([
      {
        _id: 1,
        text: 'Hello! I am your AI friend. How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'AI Friend',
        },
      },
    ]);

    return () => {
      cleanupSpeech && cleanupSpeech();
      SpeechRecognitionService.destroy(); // Ensure native voice module is stopped
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'This app needs microphone access to talk to you!');
      }
    } catch (e) {
      console.log('Error requesting permissions:', e);
    }
  };

  const setupSpeechRecognition = () => {
    const unsubWake = SpeechRecognitionService.on('wake_word_detected', async (text) => {
      console.log("Wake word detected:", text);
      VoiceService.stop(); // Stop speaking if currently speaking
      setIsProcessingCommand(true);
      // VoiceService.speak("Yes?");
    });

    const unsubResult = SpeechRecognitionService.on('result', async (text) => {
      // Use ref to check current state
      if (isProcessingCommandRef.current) {
        console.log("Command received:", text);
        setIsProcessingCommand(false);
        // Process the command
        handleVoiceCommand(text);
      }
    });

    const unsubEnd = SpeechRecognitionService.on('end', () => {
       // Use ref to check current state
       // If we were just listening for wake word, restart.
       // If we were processing a command, we might be done or need to restart listening after response.
       if (isListeningRef.current && !isProcessingCommandRef.current) {
          SpeechRecognitionService.startListening();
       }
    });

    return () => {
      unsubWake();
      unsubResult();
      unsubEnd();
    };
  };

  const handleVoiceCommand = (text) => {
    const userMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };
    onSend([userMessage]);
  };

  const toggleListening = async () => {
    if (isListening) {
      await SpeechRecognitionService.stopListening();
      setIsListening(false);
    } else {
      await SpeechRecognitionService.startListening();
      setIsListening(true);
    }
  };

  const loadSettings = async () => {
    const key = await AsyncStorage.getItem('OPENAI_API_KEY');
    if (key) setApiKey(key);
    const p = await AIService.getPersona();
    setPersona(p);
  };

  const saveSettings = async () => {
    if (apiKey) {
      await AIService.setApiKey(apiKey);
    }
    if (persona) {
      await AIService.setPersona(persona);
    }
    setModalVisible(false);
    Alert.alert('Settings Saved', 'Your AI friend is updated!');
  };

  const onSend = useCallback(async (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    const userMessage = newMessages[0].text;
    setIsTyping(true);

    // Prepare conversation history for API
    // (In a real app, you'd limit this or format it properly for the LLM)
    const conversation = messages.map(m => ({
      role: m.user._id === 1 ? 'user' : 'assistant',
      content: m.text
    })).reverse(); // GiftedChat stores newest first

    // Add new message
    conversation.push({ role: 'user', content: userMessage });

    const responseText = await AIService.generateResponse(conversation);

    setIsTyping(false);

    const botMessage = {
      _id: Math.round(Math.random() * 1000000),
      text: responseText,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'AI Friend',
      },
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));

    if (autoSpeak) {
      VoiceService.speak(responseText);
    }
  }, [messages, autoSpeak]);

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#007AFF',
          },
          left: {
            backgroundColor: '#E5E5EA',
          },
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My AI Friend</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={toggleListening} style={[styles.iconButton, isListening && styles.listeningButton]}>
             <Text style={{fontSize: 20}}>{isListening ? (isProcessingCommand ? '👂' : '🎙️') : '🚫'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAutoSpeak(!autoSpeak)} style={styles.iconButton}>
             <Text style={{fontSize: 20}}>{autoSpeak ? '🔊' : '🔇'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
            <Text style={{fontSize: 20}}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isListening && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>
            {isProcessingCommand ? "Listening for command..." : "Waiting for 'Jervis'..."}
          </Text>
        </View>
      )}

      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        isTyping={isTyping}
        placeholder="Type a message..."
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Settings</Text>

            <Text style={styles.label}>OpenAI API Key:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setApiKey}
              value={apiKey}
              placeholder="sk-..."
              secureTextEntry
            />

            <Text style={styles.label}>Persona (Who am I?):</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              onChangeText={setPersona}
              value={persona}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSave]}
                onPress={saveSettings}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Helper text for Voice Input */}
      {Platform.OS === 'ios' || Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
    borderRadius: 20,
  },
  listeningButton: {
    backgroundColor: '#e6f7ff',
  },
  statusBanner: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  statusText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonClose: {
    backgroundColor: '#FF3B30',
  },
  buttonSave: {
    backgroundColor: '#34C759',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
