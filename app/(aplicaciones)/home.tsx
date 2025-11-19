import React from 'react';
import { ImageBackground, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useUser } from '../../UserContext';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Icono reutilizable
type AppIconProps = {
  href: string;
  emoji?: string;
  label: string;
  children?: React.ReactNode;
};

const AppIcon: React.FC<AppIconProps> = ({ href, emoji, label, children }) => (
  <Link href={href as any} asChild>
    <Pressable style={styles.iconContainer}>
      <View style={styles.iconBackground}>
        {children ? (
          children
        ) : (
          <Text style={styles.iconEmoji}>{emoji ?? '❔'}</Text>
        )}
      </View>
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  </Link>
);

export default function HomeScreen() {
  const { settings } = useUser();
  
  const nombreUsuario = settings.username || 'Usuario';
  const backgroundSource = settings.wallpaperUri 
    ? { uri: settings.wallpaperUri } 
    : require('../../assets/images/wallpaper.jpg');
  return (
    <ImageBackground
      source={backgroundSource} 
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView style={styles.container}>
        <View style={styles.iconGrid}>
          <Text style={styles.title}>Bienvenido, {nombreUsuario}</Text>
        </View>

        <View style={styles.iconGrid}>
          
          <AppIcon href="/configuracion" label="Configuración" >
            <Feather name="settings" size={24} color="black"/>
          </AppIcon>
          
          <AppIcon href="/calculadora" label="Calculadora">
            <MaterialCommunityIcons name="math-integral" size={24} color="black" />
          </AppIcon>
          
          <AppIcon href="/camara" label="Camara" >
            <Feather name="camera" size={24} color="black" />
          </AppIcon>
          
          <AppIcon href="/galeria" label="Galería" >
            <MaterialCommunityIcons name="view-gallery-outline" size={24} color="black" />
          </AppIcon>

          <AppIcon href="/notas" label="Notas">
            <Feather name="book-open" size={24} color="black" />
          </AppIcon>
          
          <AppIcon href="/contactos" label="Contactos" >
            <Feather name="users" size={24} color="black" />
          </AppIcon>
          
          <AppIcon href="/mensajes" label="Mensajes" >
            <Feather name="message-circle" size={24} color="black" />
          </AppIcon>

          <AppIcon href="/telefono" label="Teléfono" >
            <Feather name="phone-call" size={24} color="black" />
          </AppIcon>
          
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// He mejorado un poco los estilos para el ScrollView
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 30,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 25,
  },
  iconContainer: {
    width: 80,
    margin: 10,
    alignItems: 'center',
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    // Sombra ligera
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  iconEmoji: {
    fontSize: 30,
  },
  iconLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});