import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Modal, 
  Alert,
  ActivityIndicator
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Video, ResizeMode } from 'expo-av'; // Para reproducir videos
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Calculamos el tamaño de las miniaturas (3 columnas)
const { width } = Dimensions.get('window');
const THUMB_SIZE = width / 3 - 2; // Restamos un poco para el margen

export default function GaleriaScreen() {
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  
  // Control de paginación (Scroll infinito)
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Estado para ver una foto/video en pantalla completa
  const [selectedAsset, setSelectedAsset] = useState<MediaLibrary.Asset | null>(null);

  // 1. CARGA INICIAL
  useEffect(() => {
    if (!permission) {
      requestPermission();
      return;
    }
    if (permission.granted) {
      loadAssets();
    }
  }, [permission]);

  // 2. FUNCIÓN PARA CARGAR FOTOS/VIDEOS
  const loadAssets = async () => {
    if (loadingMore || !hasNextPage) return;
    
    setLoadingMore(true);

    try {
      const album = await MediaLibrary.getAssetsAsync({
        first: 21, // Cargamos de 21 en 21 para llenar la cuadrícula
        after: endCursor || undefined,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: [[MediaLibrary.SortBy.creationTime, false]], // Más recientes primero
      });

      setAssets(prev => [...prev, ...album.assets]);
      setEndCursor(album.endCursor);
      setHasNextPage(album.hasNextPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  // 3. RENDERIZADO DE MINIATURA (GRID)
  const renderItem = ({ item }: { item: MediaLibrary.Asset }) => (
    <TouchableOpacity 
      onPress={() => setSelectedAsset(item)}
      style={styles.thumbnailContainer}
    >
      <Image 
        source={{ uri: item.uri }} 
        style={styles.thumbnail} 
        resizeMode="cover"
      />
      
      {/* Indicador si es video */}
      {item.mediaType === 'video' && (
        <View style={styles.videoIndicator}>
            <Text style={styles.videoTime}>{formatDuration(item.duration)}</Text>
            <Ionicons name="play" size={12} color="white" style={{marginLeft: 4}} />
        </View>
      )}
    </TouchableOpacity>
  );

  // Auxiliar: Formatear duración de video (segundos -> MM:SS)
  const formatDuration = (duration: number) => {
    if (!duration) return "00:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.round(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 4. VISTA DE PANTALLA COMPLETA (MODAL)
  const renderFullScreen = () => {
    if (!selectedAsset) return null;

    return (
      <Modal 
        animationType="slide" 
        transparent={false} 
        visible={!!selectedAsset}
        onRequestClose={() => setSelectedAsset(null)}
      >
        <View style={styles.fullScreenContainer}>
          {/* Header Flotante */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedAsset(null)} style={styles.closeBtn}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.dateHeader}>
                {new Date(selectedAsset.creationTime).toLocaleDateString()}
            </Text>
            {/* Espacio vacío para equilibrar */}
            <View style={{width: 30}} />
          </View>

          {/* Contenido */}
          <View style={styles.mediaWrapper}>
            {selectedAsset.mediaType === 'video' ? (
               <Video
                 style={styles.videoPlayer}
                 source={{ uri: selectedAsset.uri }}
                 useNativeControls
                 resizeMode={ResizeMode.CONTAIN}
                 isLooping={false}
                 shouldPlay
               />
            ) : (
               <Image 
                 source={{ uri: selectedAsset.uri }} 
                 style={styles.fullImage} 
                 resizeMode="contain"
               />
            )}
          </View>
          
          {/* Info inferior */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
                {selectedAsset.width} x {selectedAsset.height} • {selectedAsset.mediaType.toUpperCase()}
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  if (!permission?.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: 'white', marginBottom: 20}}>Se necesitan permisos para acceder a la galería.</Text>
        <TouchableOpacity style={styles.btnPermiso} onPress={requestPermission}>
            <Text style={{fontWeight: 'bold'}}>Dar Permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header de la App */}
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>Galería</Text>
        <Text style={styles.appSubTitle}>{assets.length} Elementos</Text>
      </View>

      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
        onEndReached={loadAssets} // Cargar más al llegar abajo
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 50 }}
        ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#fff" style={{margin: 20}} /> : null
        }
      />

      {renderFullScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Header Principal
  appHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  appSubTitle: {
    color: '#888',
    marginBottom: 5,
  },
  
  // Grid
  thumbnailContainer: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    margin: 1,
    backgroundColor: '#222',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoTime: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  // Pantalla Completa (Modal)
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  dateHeader: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mediaWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  videoPlayer: {
    width: '100%',
    height: 300, // Altura inicial, resizeMode lo ajustará
    flex: 1,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
  btnPermiso: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
});