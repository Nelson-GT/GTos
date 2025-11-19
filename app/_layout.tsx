import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BarraEstado from '../components/BarraEstado';
import { UserProvider } from '../UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <View style={styles.container}>
        {/* 1. Ocultamos la barra de estado REAL del teléfono */}
        <StatusBar hidden={true} style="light" />

        {/* 2. Tu barra personalizada fija arriba */}
        <BarraEstado />

        {/* 3. El contenido cambiante (pantallas) va debajo en un contenedor flexible */}
        <View style={styles.content}>
          <Stack>
            {/* La pantalla de PIN. Sin header. */}
            <Stack.Screen name="index" options={{ headerShown: false }} />
            
            {/* El grupo (aplicaciones). Sin header porque lo maneja su propio layout */}
            <Stack.Screen name="(aplicaciones)" options={{ headerShown: false }} />
          </Stack>
        </View>
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro para seguridad visual
  },
  content: {
    flex: 1, // IMPORTANTE: Hace que el Stack ocupe todo el espacio restante debajo de la barra
  },
});