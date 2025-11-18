import { Stack } from 'expo-router';
import React from 'react';

// Este es el layout para el grupo (aplicaciones)
// Define cómo se navega DENTRO del SO
export default function AppLayout() {
  return (
    <Stack>
      {/* El escritorio. No queremos header aquí. */}
      <Stack.Screen
        name="home"
        options={{ headerShown: false }}
      />
      {/* Las otras apps (como config) SÍ mostrarán su header,
          definido en el Stack.Screen de cada app. */}
    </Stack>
  );
}