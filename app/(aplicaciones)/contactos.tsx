import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import * as Contacts from 'expo-contacts';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ContactosScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermission(status === 'granted');
      
      if (status === 'granted') {
        // Obtenemos todos los contactos que tengan número de teléfono
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
          sort: Contacts.SortTypes.FirstName,
        });

        // Filtramos para asegurar que tengan número
        const validContacts = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);
        setContacts(validContacts);
      }
      setLoading(false);
    })();
  }, []);

  // Función para Llamar
  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Función para SMS
  const handleSMS = (phoneNumber: string) => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  // Acción al pulsar un contacto
  const handleContactPress = (contact: Contacts.Contact) => {
    const phoneNumber = contact.phoneNumbers?.[0]?.number;
    
    if (!phoneNumber) return;

    Alert.alert(
      contact.name,
      `¿Qué deseas hacer con ${phoneNumber}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
            text: "Mensaje", 
            onPress: () => handleSMS(phoneNumber) 
        },
        { 
            text: "Llamar", 
            onPress: () => handleCall(phoneNumber),
            style: "default" // A veces se destaca en azul
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (permission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Sin acceso a contactos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header estilo OS */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contactos</Text>
        <Text style={styles.subTitle}>{contacts.length} contactos</Text>
      </View>

      <FlatList
        data={contacts}
        // CORRECCIÓN AQUÍ:
        // Agregamos el 'index' para asegurar que la llave siempre sea única,
        // incluso si hay dos contactos con el mismo nombre o ID.
        keyExtractor={(item, index) => (item.id || item.name) + index}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.row} 
            onPress={() => handleContactPress(item)}
          >
            {/* Avatar con iniciales */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name ? item.name.charAt(0).toUpperCase() : '#'}
              </Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.number}>
                {item.phoneNumbers?.[0]?.number}
              </Text>
            </View>

            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Color de fondo típico de listas de configuración/contactos
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#888',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'black',
  },
  subTitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
    color: 'black',
  },
  number: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
});