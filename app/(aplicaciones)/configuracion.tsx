import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Stack } from 'expo-router'; // Importante para el título

export default function ConfiguracionScreen() {
  return (
    <View style={styles.container}>
      {/* Esto le pone un título al "header" o barra superior de esta pantalla */}
      <Stack.Screen options={{ title: 'Configuración' }} />

      {/* Usamos ScrollView por si la lista de opciones es muy larga */}
      <ScrollView>
        <Text style={styles.headerTitle}>Ajustes</Text>

        {/* Grupo de Opciones 1 */}
        <View style={styles.section}>
          <Pressable style={styles.option} onPress={() => alert('Abrir Wi-Fi')}>
            <Text style={styles.optionIcon}>📡</Text>
            <Text style={styles.optionText}>Wi-Fi</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Bluetooth')}>
            <Text style={styles.optionIcon}> Bluetooth</Text>
            <Text style={styles.optionText}>Bluetooth</Text>
          </Pressable>
        </View>

        {/* Grupo de Opciones 2 */}
        <View style={styles.section}>
          <Pressable style={styles.option} onPress={() => alert('Abrir Pantalla')}>
            <Text style={styles.optionIcon}>☀️</Text>
            <Text style={styles.optionText}>Pantalla y Brillo</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Sonido')}>
            <Text style={styles.optionIcon}>🔊</Text>
            <Text style={styles.optionText}>Sonido</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Fondo de Pantalla')}>
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={styles.optionText}>Fondo de Pantalla</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable style={styles.option} onPress={() => alert('Abrir Pantalla')}>
            <Text style={styles.optionIcon}>☀️</Text>
            <Text style={styles.optionText}>Pantalla y Brillo</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Sonido')}>
            <Text style={styles.optionIcon}>🔊</Text>
            <Text style={styles.optionText}>Sonido</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Fondo de Pantalla')}>
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={styles.optionText}>Fondo de Pantalla</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable style={styles.option} onPress={() => alert('Abrir Pantalla')}>
            <Text style={styles.optionIcon}>☀️</Text>
            <Text style={styles.optionText}>Pantalla y Brillo</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Sonido')}>
            <Text style={styles.optionIcon}>🔊</Text>
            <Text style={styles.optionText}>Sonido</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Fondo de Pantalla')}>
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={styles.optionText}>Fondo de Pantalla</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable style={styles.option} onPress={() => alert('Abrir Pantalla')}>
            <Text style={styles.optionIcon}>☀️</Text>
            <Text style={styles.optionText}>Pantalla y Brillo</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Sonido')}>
            <Text style={styles.optionIcon}>🔊</Text>
            <Text style={styles.optionText}>Sonido</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Fondo de Pantalla')}>
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={styles.optionText}>Fondo de Pantalla</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable style={styles.option} onPress={() => alert('Abrir Pantalla')}>
            <Text style={styles.optionIcon}>☀️</Text>
            <Text style={styles.optionText}>Pantalla y Brillo</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Sonido')}>
            <Text style={styles.optionIcon}>🔊</Text>
            <Text style={styles.optionText}>Sonido</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => alert('Abrir Fondo de Pantalla')}>
            <Text style={styles.optionIcon}>🖼️</Text>
            <Text style={styles.optionText}>Fondo de Pantalla</Text>
          </Pressable>
        </View>

        {/* Grupo de Opciones 3 */}
        <View style={styles.section}>
          <Pressable style={styles.option} onPress={() => alert('Abrir Acerca de')}>
            <Text style={styles.optionIcon}>ℹ️</Text>
            <Text style={styles.optionText}>Acerca del dispositivo</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f7', // Un fondo gris claro, típico de settings
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    color: '#000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 10,
    overflow: 'hidden', // Para que el borde redondeado se aplique a los hijos
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f7',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
});