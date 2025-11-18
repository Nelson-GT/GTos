import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function CalculadoraScreen() {
  return (
    <View style={styles.container}>
      {/* Esta app SÍ tiene un header */}
      <Stack.Screen options={{ title: 'Teléfono' }} />
      
      <Text style={styles.text}>App de Calculadora</Text>
      <Text>Próximamente...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});