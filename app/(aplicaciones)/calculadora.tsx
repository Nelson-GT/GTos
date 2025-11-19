import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';

export default function CalculatorScreen() {
  const [currentNumber, setCurrentNumber] = useState('0');
  const [lastNumber, setLastNumber] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  
  // Para limpiar todo
  const handleClear = () => {
    setCurrentNumber('0');
    setLastNumber(null);
    setOperation(null);
  };

  // Para borrar el último dígito
  const handleDelete = () => {
    if (currentNumber.length > 1) {
      setCurrentNumber(currentNumber.slice(0, -1));
    } else {
      setCurrentNumber('0');
    }
  };

  // Manejo de números y punto decimal
  const handleNumberPress = (num: string) => {
    if (num === '.' && currentNumber.includes('.')) return;

    if (currentNumber === '0' && num !== '.') {
      setCurrentNumber(num);
    } else {
      setCurrentNumber(currentNumber + num);
    }
  };

  // Lógica matemática central
  const calculateResult = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': return second !== 0 ? first / second : 0;
      default: return second;
    }
  };

  // Manejo de operadores (+, -, *, /)
  const handleOperationPress = (op: string) => {
    // Si ya tenemos un operador y estamos escribiendo un segundo número, 
    // encadenamos la operación anterior primero (ej: 2 + 2 + ... calcula el 4 antes)
    if (operation && lastNumber) {
      const result = calculateResult(parseFloat(lastNumber), parseFloat(currentNumber), operation);
      setLastNumber(String(result));
      setCurrentNumber('0');
      setOperation(op);
    } else {
      // Primera operación
      setLastNumber(currentNumber);
      setCurrentNumber('0');
      setOperation(op);
    }
  };

  // Botón Igual (=)
  const handleEqualPress = () => {
    if (!operation || !lastNumber) return;

    const result = calculateResult(parseFloat(lastNumber), parseFloat(currentNumber), operation);
    
    // Formateamos para evitar decimales infinitos largos
    const finalResult = Number.isInteger(result) 
      ? String(result) 
      : String(Number(result.toFixed(8))); // Máximo 8 decimales

    setCurrentNumber(finalResult);
    setLastNumber(null);
    setOperation(null);
  };

  // Manejo de porcentaje y cambio de signo (+/-)
  const handleSpecial = (type: 'pct' | 'sign') => {
    const num = parseFloat(currentNumber);
    if (type === 'pct') setCurrentNumber(String(num / 100));
    if (type === 'sign') setCurrentNumber(String(num * -1));
  };

  // Componente de Botón Reutilizable
  const CalcButton = ({ label, type = 'number', onPress, doubleSize = false }: any) => {
    const getBgColor = () => {
      if (type === 'operator') return '#f1c40f'; // Amarillo (Acción)
      if (type === 'special') return '#a5a5a5'; // Gris Claro (Top)
      return '#333333'; // Gris Oscuro (Números)
    };

    const getTextColor = () => {
      if (type === 'special') return 'black';
      return 'white';
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.button,
          { backgroundColor: getBgColor(), width: doubleSize ? 160 : 70 }, // Doble ancho para el 0
          operation === label && lastNumber && currentNumber === '0' && { borderWidth: 2, borderColor: 'white' } // Indicador visual activo
        ]}
      >
        <Text style={[styles.buttonText, { color: getTextColor() }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* PANTALLA DE RESULTADOS */}
      <View style={styles.displayContainer}>
        {/* Muestra la operación previa pequeña si existe */}
        <Text style={styles.prevDisplay}>
          {lastNumber} {operation}
        </Text>
        {/* Número actual grande */}
        <Text 
          style={styles.displayText} 
          numberOfLines={1} 
          adjustsFontSizeToFit
        >
          {currentNumber}
        </Text>
      </View>

      {/* TECLADO */}
      <View style={styles.keyboard}>
        
        {/* Fila 1 */}
        <View style={styles.row}>
          <CalcButton label="C" type="special" onPress={handleClear} />
          <CalcButton label="+/-" type="special" onPress={() => handleSpecial('sign')} />
          <CalcButton label="%" type="special" onPress={() => handleSpecial('pct')} />
          <CalcButton label="÷" type="operator" onPress={() => handleOperationPress('÷')} />
        </View>

        {/* Fila 2 */}
        <View style={styles.row}>
          <CalcButton label="7" onPress={() => handleNumberPress('7')} />
          <CalcButton label="8" onPress={() => handleNumberPress('8')} />
          <CalcButton label="9" onPress={() => handleNumberPress('9')} />
          <CalcButton label="×" type="operator" onPress={() => handleOperationPress('×')} />
        </View>

        {/* Fila 3 */}
        <View style={styles.row}>
          <CalcButton label="4" onPress={() => handleNumberPress('4')} />
          <CalcButton label="5" onPress={() => handleNumberPress('5')} />
          <CalcButton label="6" onPress={() => handleNumberPress('6')} />
          <CalcButton label="-" type="operator" onPress={() => handleOperationPress('-')} />
        </View>

        {/* Fila 4 */}
        <View style={styles.row}>
          <CalcButton label="1" onPress={() => handleNumberPress('1')} />
          <CalcButton label="2" onPress={() => handleNumberPress('2')} />
          <CalcButton label="3" onPress={() => handleNumberPress('3')} />
          <CalcButton label="+" type="operator" onPress={() => handleOperationPress('+')} />
        </View>

        {/* Fila 5 */}
        <View style={styles.row}>
          <CalcButton label="0" doubleSize onPress={() => handleNumberPress('0')} />
          <CalcButton label="." onPress={() => handleNumberPress('.')} />
          <CalcButton label="=" type="operator" onPress={handleEqualPress} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    paddingBottom: 30,
  },
  prevDisplay: {
    color: '#777',
    fontSize: 24,
    marginBottom: 10,
    minHeight: 30,
  },
  displayText: {
    color: 'white',
    fontSize: 80,
    textAlign: 'right',
    fontWeight: '300',
  },
  keyboard: {
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    fontWeight: '500',
  },
});