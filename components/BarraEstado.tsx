import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function BarraEstado() {
  // Estados para la información
  const [hora, setHora] = useState('');
  const [bateria, setBateria] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [wifi, setWifi] = useState(false);

  // 1. Efecto para el Reloj (se actualiza cada minuto)
  useEffect(() => {
    const actualizarReloj = () => {
      const ahora = new Date();
      // Formato HH:MM
      const horaString = ahora.getHours().toString().padStart(2, '0') + ':' + 
                        ahora.getMinutes().toString().padStart(2, '0');
      setHora(horaString);
    };

    actualizarReloj(); // Primera ejecución inmediata
    const intervalo = setInterval(actualizarReloj, 1000 * 60); // Actualizar cada minuto

    return () => clearInterval(intervalo);
  }, []);

  // 2. Efecto para la Batería
  useEffect(() => {
    const cargarBateria = async () => {
      const nivel = await Battery.getBatteryLevelAsync();
      const estado = await Battery.getBatteryStateAsync();
      setBateria(Math.round(nivel * 100));
      setCargando(estado === Battery.BatteryState.CHARGING);
    };

    cargarBateria();

    // Escuchamos cambios (si conectas el cargador)
    const suscripcion = Battery.addBatteryStateListener(({ batteryState }) => {
      setCargando(batteryState === Battery.BatteryState.CHARGING);
    });

    return () => suscripcion.remove();
  }, []);

  // 3. Efecto para el Wi-Fi
  useEffect(() => {
    const cargarRed = async () => {
      const estado = await Network.getNetworkStateAsync();
      setWifi(estado.type === Network.NetworkStateType.WIFI);
    };
    cargarRed();
  }, []);

  return (
    <View style={styles.barraContainer}>
      {/* Lado Izquierdo: Hora */}
      <View style={styles.ladoIzquierdo}>
        <Text style={styles.textoHora}>{hora}</Text>
      </View>

      {/* Lado Derecho: Iconos */}
      <View style={styles.ladoDerecho}>
        <Text style={styles.icono}>
          {wifi ? (
              <Ionicons name="wifi" size={25} color="white" />
            ) : (
              <MaterialCommunityIcons name="arrow-up-down" size={24} color="white" />
            )}
        </Text>
        
        {/* Batería */}
        <Text style={styles.textoBateria}>{bateria}%</Text>
        <Text style={styles.icono}>
          <View style={styles.icono}>
            {cargando ? (
              <Ionicons name="battery-charging" size={25} color="white" />
            ) : (
              <Ionicons name="battery-full" size={25} color="white" />
            )}
          </View>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barraContainer: {
    width: '100%',
    height: 40, // Altura de la barra de estado
    backgroundColor: '#000', // Fondo negro como barra de notificaciones
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 5, // Un poco de espacio arriba
    zIndex: 1000, // Asegura que esté siempre encima de todo
  },
  hidden : {
    display: "none",
  },
  ladoIzquierdo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ladoDerecho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  textoHora: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textoBateria: {
    color: '#fff',
    fontSize: 12,
  },
  icono: {
    color: '#fff',
    fontSize: 14,
  },
});