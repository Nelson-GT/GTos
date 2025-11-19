import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Linking, 
  Alert 
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TelefonoScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Lógica para añadir números
  const handlePress = (num: string) => {
    if (phoneNumber.length < 15) { // Límite razonable
      setPhoneNumber(prev => prev + num);
    }
  };

  // Lógica para borrar (Backspace)
  const handleDelete = () => {
    setPhoneNumber(prev => prev.slice(0, -1));
  };

  // Lógica para mantener presionado borrar (Borrar todo)
  const handleLongDelete = () => {
    setPhoneNumber('');
  };

  // Lógica para realizar la llamada
  const handleCall = () => {
    if (phoneNumber.length === 0) return;

    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
    Linking.openURL(url)
  };

  // Componente de Botón Numérico
  const KeypadButton = ({ number, letters }: { number: string, letters?: string }) => (
    <TouchableOpacity 
      style={styles.keyButton} 
      onPress={() => handlePress(number)}
      activeOpacity={0.7}
    >
      <Text style={styles.keyNumber}>{number}</Text>
      {letters && <Text style={styles.keyLetters}>{letters}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Pantalla del número */}
      <View style={styles.displayContainer}>
        <Text 
          style={styles.displayText} 
          numberOfLines={1} 
          adjustsFontSizeToFit
        >
          {phoneNumber}
        </Text>
        
        {/* Botón "Agregar a contactos" (Simulado visualmente) */}
        {phoneNumber.length > 0 && (
            <Text style={styles.addContactText}>Añadir Número</Text>
        )}
      </View>

      {/* Teclado Numérico */}
      <View style={styles.keypad}>
        <View style={styles.row}>
          <KeypadButton number="1" />
          <KeypadButton number="2" letters="ABC" />
          <KeypadButton number="3" letters="DEF" />
        </View>
        <View style={styles.row}>
          <KeypadButton number="4" letters="GHI" />
          <KeypadButton number="5" letters="JKL" />
          <KeypadButton number="6" letters="MNO" />
        </View>
        <View style={styles.row}>
          <KeypadButton number="7" letters="PQRS" />
          <KeypadButton number="8" letters="TUV" />
          <KeypadButton number="9" letters="WXYZ" />
        </View>
        <View style={styles.row}>
          <KeypadButton number="*" />
          <KeypadButton number="0" letters="+" />
          <KeypadButton number="#" />
        </View>
      </View>

      {/* Controles de Llamada */}
      <View style={styles.actionContainer}>
        {/* Espaciador izquierdo para centrar el botón verde */}
        <View style={{ width: 80 }} />

        {/* Botón Llamar */}
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={32} color="white" />
        </TouchableOpacity>

        {/* Botón Borrar (Solo aparece si hay números) */}
        <View style={{ width: 80, alignItems: 'center' }}>
          {phoneNumber.length > 0 && (
            <TouchableOpacity 
                onPress={handleDelete} 
                onLongPress={handleLongDelete}
                style={styles.deleteButton}
            >
              <Ionicons name="backspace" size={30} color="#b0b0b0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Barra de navegación simulada inferior (Opcional) */}
      <View style={{ height: 40 }} /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
  },
  displayContainer: {
    flex: 0.7, // Ocupa la parte superior (40%)
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  displayText: {
    fontSize: 40,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  addContactText: {
    fontSize: 16,
    color: '#007AFF', // Azul típico de acción
    marginTop: 5,
  },
  keypad: {
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keyButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5, // Círculo perfecto
    backgroundColor: '#333333', // Gris oscuro
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyNumber: {
    fontSize: 32,
    color: 'white',
  },
  keyLetters: {
    fontSize: 10,
    color: 'white',
    marginTop: -2,
    letterSpacing: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribuye espacio entre llamar y borrar
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
  },
  callButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#34C759', // Verde Teléfono
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 10,
  },
});