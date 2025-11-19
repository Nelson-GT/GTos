import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Stack } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CamaraScreen() {
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [mode, setMode] = useState<'picture' | 'video'>('picture');
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // --- PERMISOS ---
  // Nota: Ya tenías la lógica de permisos de micrófono correcta, así que no hizo falta añadir nada aquí.
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  // Solicitar permisos al cargar si no existen
  useEffect(() => {
    if (!permission?.granted) requestPermission();
    if (!micPermission?.granted) requestMicPermission();
    if (!mediaPermission?.granted) requestMediaPermission();
  }, []);

  if (!permission || !micPermission || !mediaPermission) {
    // Cargando permisos...
    return <View style={styles.container} />;
  }

  if (!permission.granted || !micPermission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Necesitamos permiso para usar la cámara, micrófono y guardar fotos.</Text>
        <TouchableOpacity style={styles.permisoBtn} onPress={() => {
            requestPermission();
            requestMicPermission();
            requestMediaPermission();
        }}>
            <Text style={styles.textBtn}>Dar Permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- FUNCIONES DE CÁMARA ---

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const tomarFoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
            await MediaLibrary.saveToLibraryAsync(photo.uri);
            Alert.alert("¡Foto Guardada!", "Se ha guardado en tu galería.");
        }
      } catch (error) {
        Alert.alert("Error", "No se pudo tomar la foto");
      }
    }
  };

  const grabarVideo = async () => {
    if (cameraRef.current) {
      if (isRecording) {
        // Detener grabación
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        // Iniciar grabación
        setIsRecording(true);
        try {
            // CAMBIO REALIZADO: mute: false
            // Al estar en build nativo, el audio debería funcionar correctamente.
            const video = await (cameraRef.current as any).recordAsync({ mute: false }); 
            
            if (video) {
                await MediaLibrary.saveToLibraryAsync(video.uri);
                // Texto de alerta actualizado
                Alert.alert("¡Video Guardado!", "Video con audio guardado en galería.");
            }
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "Falló la grabación de video.");
            setIsRecording(false); // Asegurar reset en error
        }
      }
    }
  };

  // Acción del botón principal según el modo
  const handleCapture = () => {
    if (mode === 'picture') {
        tomarFoto();
    } else {
        grabarVideo();
    }
  };

  return (
    <View style={styles.container}>
      {/* Ocultamos el header nativo para inmersión total */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        mode={mode}
        ref={cameraRef}
        // Nota: VideoStabilizationMode o quality podrían agregarse aquí si deseas mejorar el video
      >
        
        {/* UI SUPERIOR (Modo) */}
        <View style={styles.topControls}>
            <TouchableOpacity 
                style={[styles.modeBtn, mode === 'picture' && styles.activeMode]} 
                onPress={() => setMode('picture')}
            >
                <Text style={styles.textBtn}>FOTO</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.modeBtn, mode === 'video' && styles.activeMode]} 
                onPress={() => setMode('video')}
            >
                <Text style={styles.textBtn}>VIDEO</Text>
            </TouchableOpacity>
        </View>

        {/* UI INFERIOR (Botones) */}
        <View style={styles.buttonContainer}>
            {/* Botón Voltear */}
            <TouchableOpacity style={styles.smallBtn} onPress={toggleCameraFacing}>
                <Text style={styles.iconText}>
                  <FontAwesome6 name="arrows-rotate" size={24} color="black" />
                </Text>
            </TouchableOpacity>

            {/* Botón Disparador */}
            <TouchableOpacity 
                style={[
                    styles.captureBtn, 
                    mode === 'video' && styles.videoBtn,
                    isRecording && styles.recordingBtn
                ]} 
                onPress={handleCapture}
            >
                {isRecording && <View style={styles.stopSquare} />}
            </TouchableOpacity>

            {/* Botón Vacío (Para balancear UI) o Galería futura */}
            <View style={styles.smallBtn} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 50,
    gap: 20,
  },
  modeBtn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activeMode: {
    backgroundColor: '#f1c40f', // Amarillo destacado
  },
  textBtn: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  permisoBtn: {
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  // Botones de control
  smallBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  // Botón de disparo
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBtn: {
    backgroundColor: 'red',
    borderColor: '#800000',
  },
  recordingBtn: {
    width: 70,
    height: 70,
    borderRadius: 10, // Se vuelve cuadrado al grabar
  },
  stopSquare: {
    width: 30,
    height: 30,
    backgroundColor: 'black',
    borderRadius: 2,
  },
});