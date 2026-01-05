import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { useFocusEffect } from '@react-navigation/native';

export default function SecureContentScreen({ route, navigation }) {
  const { item } = route.params;

  // --- Anti-Leak Implementation ---
  useFocusEffect(
    React.useCallback(() => {
      const activateSecurity = async () => {
        // Prevent Screen Capture / Recording
        await ScreenCapture.preventScreenCaptureAsync();
      };

      activateSecurity();

      return () => {
        // Re-enable when leaving screen (optional, or keep it disabled globally)
        ScreenCapture.allowScreenCaptureAsync();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.warning}>Protected Content - Do Not Share</Text>

      <View style={styles.viewer}>
          {item.type === 'PDF' ? (
              <View style={styles.pdfPlaceholder}>
                  {/* Simulated PDF Viewer UI */}
                  <View style={styles.pdfPage}>
                      <Text style={styles.pdfTextH1}>{item.title}</Text>
                      <Text style={styles.pdfText}>
                          This is a secure document. Content is locked to this device.
                          {"\n\n"}
                          Chapter 1: Introduction
                          {"\n"}
                          Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force.
                          {"\n\n"}
                          (This is a placeholder for the actual PDF rendered via a library like react-native-pdf)
                      </Text>
                  </View>

                  {/* Watermark Overlay */}
                  <View style={styles.watermarkContainer} pointerEvents="none">
                      {Array.from({ length: 10 }).map((_, i) => (
                          <Text key={i} style={styles.watermark}>Student A - 9876543210</Text>
                      ))}
                  </View>
              </View>
          ) : (
              <View style={styles.videoPlaceholder}>
                   <View style={styles.videoScreen}>
                        <Text style={{color: 'white'}}>▶ PLAYING SECURE VIDEO</Text>
                   </View>
                   <View style={styles.videoControls}>
                       <Text style={{color: 'white'}}>00:00 / 10:00</Text>
                   </View>
                   <Text style={styles.contentTitle}>{item.title}</Text>
              </View>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  warning: { color: 'red', textAlign: 'center', padding: 10, fontWeight: 'bold' },
  viewer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  pdfPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  pdfPage: { width: '90%', height: '90%', borderWidth: 1, borderColor: '#ccc', padding: 20, backgroundColor: '#fff' },
  pdfTextH1: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  pdfText: { fontSize: 14, lineHeight: 20, color: '#333' },
  videoPlaceholder: { width: '100%', flex: 1, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  videoScreen: { width: '100%', height: 250, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  videoControls: { width: '100%', padding: 10, backgroundColor: '#333', flexDirection: 'row', justifyContent: 'space-between' },
  contentTitle: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: 'white' },
  watermarkContainer: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0.15,
      zIndex: 10,
      flexWrap: 'wrap',
      flexDirection: 'row'
  },
  watermark: {
      fontSize: 20,
      color: 'black',
      transform: [{ rotate: '-45deg' }],
      margin: 30
  }
});
