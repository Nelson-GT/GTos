import { Stack, router } from 'expo-router';
import React from 'react';

// Este es el layout principal. Define la pila de navegación de la app.
export default function RootLayout() {
  return (
    <Stack>
      {/* La pantalla de PIN. Sin header. */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* El grupo (aplicaciones) donde vive el "SO". También sin header
          ya que el layout de (aplicaciones) lo manejará. */}
      <Stack.Screen name="(aplicaciones)" options={{ headerShown: false }} />
    </Stack>
  );
}