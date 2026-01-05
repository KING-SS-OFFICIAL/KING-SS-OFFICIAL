import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function AIStudyBuddyScreen() {
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! I am your AI Study Buddy. Ask me anything about Physics, Math, or CS.', sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Simulate API delay
        setTimeout(() => {
            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: `I received: "${userMsg.text}". Here is a summary based on WBCHSE syllabus... (Mock Response)`,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.msgBubble, item.sender === 'user' ? styles.userMsg : styles.botMsg]}>
                        <Text style={styles.msgText}>{item.text}</Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask a doubt..."
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    msgBubble: { padding: 10, borderRadius: 10, marginBottom: 10, maxWidth: '80%' },
    userMsg: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
    botMsg: { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
    msgText: { fontSize: 16 },
    inputContainer: { flexDirection: 'row', padding: 5, borderTopWidth: 1, borderColor: '#ccc' },
    input: { flex: 1, marginRight: 10, padding: 10, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#ddd' }
});
