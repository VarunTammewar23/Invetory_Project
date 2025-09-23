// App.js
import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Pressable, StyleSheet, Platform} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

export default function App() {
  const [scanned, setScanned] = useState(null);

  // permission hook
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // get camera device
  const devices = useCameraDevices();
  const device = devices.back ?? Object.values(devices)[0];

  // create a code scanner instance (scan QR only)
  // NOTE: memoize/avoid changing options at runtime — changes will rebuild the camera session.
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'], // limit to QR codes
    onCodeScanned: (codes) => {
      // codes is an array of Code objects { value, type, frame, ... }
      if (codes && codes.length > 0) {
        // take first found code's value
        setScanned(codes[0].value);
      }
    },
    // optional: regionOfInterest, detectionFps, etc.
    // regionOfInterest: { x: 0.25, y: 0.25, width: 0.5, height: 0.5 }
  });

  if (!device) return (
    <SafeAreaView style={styles.center}>
      <Text>No camera available</Text>
    </SafeAreaView>
  );

  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Camera permission required</Text>
        <Pressable onPress={requestPermission} style={styles.btn}><Text>Request</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        // pass the codeScanner object here
        codeScanner={codeScanner}
      />
      <View style={styles.footer}>
        <Text style={styles.text}>Scanned value:</Text>
        <Text selectable style={styles.value}>{scanned ?? '<none>'}</Text>
        <Pressable onPress={() => setScanned(null)} style={styles.btn}>
          <Text>Clear</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  footer: {position: 'absolute', bottom: 36, left: 12, right: 12, backgroundColor: '#ffffffaa', padding: 12, borderRadius: 8},
  text: {fontSize: 12, color: '#333'},
  value: {fontSize: 16, marginTop: 6},
  btn: {marginTop: 8, padding: 8, alignSelf: 'flex-start', backgroundColor: '#eee', borderRadius: 6}
});
