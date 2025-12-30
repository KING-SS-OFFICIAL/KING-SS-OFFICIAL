import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from 'openai';

const DEFAULT_PERSONA = "You are a helpful, friendly, and funny personal assistant. You answer like a close friend.";

class AIService {
  constructor() {
    this.openai = null;
    this.apiKey = null;
  }

  async initialize() {
    this.apiKey = await AsyncStorage.getItem('OPENAI_API_KEY');
    if (this.apiKey) {
      this.openai = new OpenAI({ apiKey: this.apiKey, dangerouslyAllowBrowser: true }); // dangerouslyAllowBrowser for React Native
    }
  }

  async setApiKey(key) {
    await AsyncStorage.setItem('OPENAI_API_KEY', key);
    this.apiKey = key;
    this.openai = new OpenAI({ apiKey: this.apiKey, dangerouslyAllowBrowser: true });
  }

  async getPersona() {
    const persona = await AsyncStorage.getItem('PERSONA');
    return persona || DEFAULT_PERSONA;
  }

  async setPersona(persona) {
    await AsyncStorage.setItem('PERSONA', persona);
  }

  async generateResponse(messages) {
    if (!this.openai) {
      await this.initialize();
      if (!this.openai) {
        return "Please set your OpenAI API Key in settings to start chatting!";
      }
    }

    try {
      const systemPrompt = await this.getPersona();

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error calling AI:", error);
      return "Sorry, I'm having trouble thinking right now. Check your internet or API key.";
    }
  }
}

export default new AIService();
