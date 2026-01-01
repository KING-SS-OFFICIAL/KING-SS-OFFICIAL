# My AI Friend

A personalized talkable AI mobile app built with React Native and Expo.

## Features

- **Talkable**: Converses with you using Text-to-Speech.
- **Personalized**: Configurable "Persona" and connects to your own OpenAI API key.
- **Background Capable**: Includes boilerplate for background task execution (e.g., fetching updates).
- **Cross-Platform**: Runs on iOS and Android.

## Setup Instructions

1.  **Install Node.js**: Ensure you have Node.js installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the App**:
    ```bash
    npx expo start
    ```
    - Scan the QR code with the Expo Go app on your phone.

## Configuration

1.  Open the app on your device.
2.  Tap the **Settings (⚙️)** icon in the top right.
3.  Enter your **OpenAI API Key** (get one at [platform.openai.com](https://platform.openai.com/)).
4.  (Optional) Customize the **Persona** to change how the AI behaves (e.g., "You are a sarcastic robot").
5.  Save.

## Usage

- **Type to chat**: Use the text input.
- **Voice Input**: Use the microphone icon on your mobile keyboard to dictate text.
- **Jervis Mode**: Tap the microphone icon in the header to enable "Always Listening" mode. The app will listen for the wake word "Jervis" (or "Jarvis") and respond to your commands.
- **Voice Output**: The AI reads responses aloud by default. Toggle this with the speaker icon.

## Background Execution Note

"Always listening" background AI requires significant battery and specific permissions that are often restricted by OS policies.
- **Foreground**: The app listens continuously for "Jervis" while the app is open.
- **Background**: We have enabled `FOREGROUND_SERVICE` permissions for Android to support future background listening capabilities. Currently, the operating system may suspend the microphone when the app is in the background to save battery.
