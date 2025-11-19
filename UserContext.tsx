// UserContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo de datos de nuestra configuración
interface UserSettings {
  username: string;
  password: string; // En un caso real debería ir encriptada, aquí texto plano está bien
  wallpaperUri: string | null; // La ruta de la imagen
}

// Valores por defecto
const defaultSettings: UserSettings = {
  username: 'Nelson',
  password: '1234',
  wallpaperUri: null, // Null usará un fondo por defecto
};

// Creamos el contexto
const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos al iniciar la app
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@os_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error cargando configuración", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para actualizar cualquier dato
  // Esta función guarda en el Estado (RAM) y en AsyncStorage (Disco) al mismo tiempo
  const updateSettings = async (newData: Partial<UserSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newData };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('@os_settings', JSON.stringify(updatedSettings));
    } catch (e) {
      console.error("Error guardando configuración", e);
    }
  };

  return (
    <UserContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar esto fácil en cualquier pantalla
export const useUser = () => useContext(UserContext);