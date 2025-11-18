import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';

// Icono reutilizable
type AppIconProps = {
  href: string;
  emoji: string;
  label: string;
};

const AppIcon: React.FC<AppIconProps> = ({ href, emoji, label }) => (
  <Link href={href as any} asChild>
    <Pressable style={styles.iconContainer}>
      <View style={styles.iconBackground}>
        <Text style={styles.iconEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  </Link>
);

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mi Sistema Operativo</Text>
      <Text style={styles.subtitle}>Toca un icono para abrir una app</Text>

      {/* Contenedor para nuestros "iconos" de apps */}
      <View style={styles.iconGrid}>
        
        {/* ICONO DE CONFIGURACIÓN */}
        {/* El link ahora es solo "/configuracion" porque está
            dentro del mismo grupo (aplicaciones) */}
        <AppIcon href="/configuracion" emoji="⚙️" label="Configuración" />

        {/* --- BOTONES DE PRUEBA --- */}
        
        <AppIcon href="/calculadora" emoji="🧮" label="Calculadora" />
        
        <AppIcon href="/notas" emoji="📝" label="Notas" />

        <AppIcon href="/mensajes" emoji="💬" label="Mensajes" />

        <AppIcon href="/telefono" emoji="📞" label="Teléfono" />

      </View>
    </ScrollView>
  );
}

// He mejorado un poco los estilos para el ScrollView
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Fondo del escritorio
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50, // Espacio desde la barra de estado
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Para que los iconos bajen si no caben
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 80, // Ancho del icono + label
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