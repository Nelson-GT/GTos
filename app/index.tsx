import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

const PIN_CORRECTO = '1234';

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num: string) => {
    setError(false);
    if (num === 'del') {
      setPin((prev) => prev.slice(0, -1));
    } else if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleSubmit = () => {
    if (pin === PIN_CORRECTO) {
      // ¡Correcto! Reemplazamos la pantalla actual con el "escritorio".
      // "replace" evita que el usuario pueda "volver" al PIN.
      router.replace('/home');
    } else {
      setError(true);
      setPin('');
    }
  };

  // Crea una fila de botones
  const renderRow = (nums: string[]) => (
    <View style={styles.row}>
      {nums.map((num) => (
        <Pressable
          key={num}
          style={styles.key}
          onPress={() => handlePress(num)}
        >
          <Text style={styles.keyText}>{num}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ingresa tu PIN</Text>
      
      <View style={styles.pinDisplay}>
        {/* Muestra los "círculos" del PIN */}
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.pinDot, pin.length > i ? styles.pinDotFilled : null]}
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>PIN incorrecto. Intenta de nuevo.</Text>}

      <View style={styles.keyboard}>
        {renderRow(['1', '2', '3'])}
        {renderRow(['4', '5', '6'])}
        {renderRow(['7', '8', '9'])}
        <View style={styles.row}>
          <Pressable style={styles.key} onPress={handleSubmit}>
            <Text style={styles.keyText}>OK</Text>
          </Pressable>
          <Pressable style={styles.key} onPress={() => handlePress('0')}>
            <Text style={styles.keyText}>0</Text>
          </Pressable>
          <Pressable style={styles.key} onPress={() => handlePress('del')}>
            <Text style={styles.keyText}>DEL</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
  },
  pinDisplay: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    margin: 10,
  },
  pinDotFilled: {
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#ff453a',
    marginBottom: 10,
    height: 20,
  },
  keyboard: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3a3a3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  keyText: {
    color: '#fff',
    fontSize: 28,
  },
});