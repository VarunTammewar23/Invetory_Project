import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';

export default function App() {
  const [msg, setMsg] = useState<string>('Loading...');

  useEffect(() => {
    fetch('http://192.168.245.31:5000/message')  // <-- replace with your PC IP
      .then(r => r.json())
      .then(j => setMsg(j.message))
      .catch(e => setMsg('Error: ' + e.message));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>{msg}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'},
  text: {fontSize: 20},
});
