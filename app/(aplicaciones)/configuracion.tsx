// app/aplicaciones/configuracion.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Alert, ScrollView, Image, Switch 
} from 'react-native';
import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../UserContext'; // Importamos nuestro hook
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracionScreen() {
  const { settings, updateSettings } = useUser();
  
  // Estados locales temporales para los inputs
  const [tempName, setTempName] = useState(settings.username);
  const [tempPass, setTempPass] = useState(settings.password);

  // FUNCIÓN: Cambiar Wallpaper
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16], // Relación de aspecto de pantalla de celular
      quality: 1,
    });

    if (!result.canceled) {
      // Guardamos la URI de la imagen en el contexto global
      updateSettings({ wallpaperUri: result.assets[0].uri });
      Alert.alert("Fondo Actualizado", "Tu pantalla de inicio se ve genial ahora.");
    }
  };

  // FUNCIÓN: Guardar cambios de texto
  const handleSaveText = () => {
    updateSettings({ 
        username: tempName, 
        password: tempPass 
    });
    Alert.alert("Guardado", "Tus credenciales han sido actualizadas.");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SECCIÓN 1: PERFIL */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERFIL DE USUARIO</Text>
            <View style={styles.card}>
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput 
                        style={styles.input} 
                        value={tempName} 
                        onChangeText={setTempName}
                    />
                </View>
                <View style={styles.divider} />
                <View style={styles.inputRow}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput 
                        style={styles.input} 
                        value={tempPass} 
                        onChangeText={setTempPass}
                        secureTextEntry // Oculta caracteres
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveText}>
                <Text style={styles.saveText}>Guardar Cambios de Perfil</Text>
            </TouchableOpacity>
        </View>

        {/* SECCIÓN 2: FONDO DE PANTALLA */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERSONALIZACIÓN</Text>
            <View style={styles.card}>
                <View style={styles.wallpaperPreview}>
                    {settings.wallpaperUri ? (
                        <Image source={{ uri: settings.wallpaperUri }} style={styles.previewImage} />
                    ) : (
                        <View style={[styles.previewImage, { backgroundColor: '#333' }]} />
                    )}
                </View>
                <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
                    <Text style={styles.actionText}>Cambiar Fondo de Pantalla</Text>
                    <Ionicons name="image-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
            </View>
        </View>

        {/* SECCIÓN 3: INFO SISTEMA */}
        <View style={styles.section}>
              <Text style={styles.infoText}>React Native OS Simulator v1.0</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Gris claro típico de ajustes
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#6d6d72',
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  label: {
    fontSize: 17,
    color: 'black',
    width: 100,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: '#007AFF',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5ea',
    marginLeft: 15,
  },
  saveBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Wallpaper Styles
  wallpaperPreview: {
    height: 200,
    width: '100%',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionBtn: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  actionText: {
    fontSize: 17,
    color: '#007AFF',
  },
  infoText: {
    textAlign: 'center',
    color: '#8e8e93',
    fontSize: 12,
  },
});