import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Alert, 
  Keyboard 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Iconos estándar de Expo

// Definimos la estructura de una nota
interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function NotasScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  
  // Estados para la nota que se está editando
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 1. CARGAR NOTAS AL INICIAR
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('@my_os_notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (e) {
      console.error("Error cargando notas", e);
    }
  };

  // 2. GUARDAR NOTAS EN ALMACENAMIENTO
  const saveToStorage = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('@my_os_notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (e) {
      console.error("Error guardando notas", e);
    }
  };

  // 3. CREAR O ACTUALIZAR NOTA
  const handleSaveNote = () => {
    if (title.trim() === '' && content.trim() === '') {
      setViewMode('list'); // Si está vacía, no guardamos nada y volvemos
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedNotes = [...notes];

    if (currentId) {
      // Editar nota existente
      updatedNotes = updatedNotes.map(note => 
        note.id === currentId 
          ? { ...note, title: title || 'Sin título', content, date: dateStr } 
          : note
      );
    } else {
      // Crear nueva nota
      const newNote: Note = {
        id: Date.now().toString(), // ID único basado en tiempo
        title: title || 'Nueva Nota',
        content: content,
        date: dateStr
      };
      // Agregamos al principio de la lista
      updatedNotes = [newNote, ...updatedNotes];
    }

    saveToStorage(updatedNotes);
    setViewMode('list');
    Keyboard.dismiss();
  };

  // 4. BORRAR NOTA
  const handleDeleteNote = () => {
    if (!currentId) return;
    
    Alert.alert(
      "Eliminar Nota",
      "¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => {
            const updatedNotes = notes.filter(n => n.id !== currentId);
            saveToStorage(updatedNotes);
            setViewMode('list');
          } 
        }
      ]
    );
  };

  // NAVEGACIÓN INTERNA
  const openEditor = (note?: Note) => {
    if (note) {
      setCurrentId(note.id);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setCurrentId(null);
      setTitle('');
      setContent('');
    }
    setViewMode('editor');
  };

  // --- RENDERIZADO: VISTA DE LISTA ---
  const renderList = () => (
    <View style={styles.fullScreen}>
      <Text style={styles.headerTitle}>Mis Notas</Text>
      
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes notas. ¡Escribe algo!</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.noteCard} onPress={() => openEditor(item)}>
            <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.notePreview} numberOfLines={2}>
              {item.content || "Sin contenido adicional..."}
            </Text>
            <Text style={styles.noteDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Botón flotante para agregar */}
      <TouchableOpacity style={styles.fab} onPress={() => openEditor()}>
        <Ionicons name="add" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );

  // --- RENDERIZADO: VISTA DE EDITOR ---
  const renderEditor = () => (
    <View style={styles.fullScreen}>
      <View style={styles.editorHeader}>
        <TouchableOpacity onPress={() => {
             // Auto-guardado al volver si se desea, o simplemente volver
             handleSaveNote(); 
        }}>
          <Ionicons name="chevron-back" size={28} color="#f1c40f" />
        </TouchableOpacity>
        
        <Text style={styles.headerDate}>{currentId ? 'Editando' : 'Nueva Nota'}</Text>

        {currentId ? (
          <TouchableOpacity onPress={handleDeleteNote}>
            <Ionicons name="trash-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        ) : (
            <View style={{width: 24}} /> // Espaciador
        )}
      </View>

      <TextInput
        style={styles.inputTitle}
        placeholder="Título"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.inputContent}
        placeholder="Escribe aquí..."
        placeholderTextColor="#666"
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {viewMode === 'list' ? renderList() : renderEditor()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Fondo oscuro tipo OS
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  fullScreen: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  // Tarjeta de nota
  noteCard: {
    backgroundColor: '#252525',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  notePreview: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
  },
  // Editor
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerDate: {
    color: '#888',
    fontWeight: '600',
  },
  inputTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  inputContent: {
    flex: 1,
    fontSize: 18,
    color: '#ddd',
    lineHeight: 24,
  },
  // Botón Flotante (FAB)
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1c40f', // Color acento (Amarillo OS)
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});