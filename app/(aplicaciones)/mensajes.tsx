import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  Linking, 
  ActivityIndicator 
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { Stack } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons'; // FontAwesome para icono de WhatsApp

export default function MensajesRealScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<boolean | null>(null);

  // 1. CARGAR CONTACTOS REALES
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermission(status === 'granted');
      
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name, Contacts.Fields.Image],
          sort: Contacts.SortTypes.FirstName,
        });

        // Filtramos solo los que tienen número de teléfono
        const validContacts = data.filter(c => c.phoneNumbers && c.phoneNumbers.length > 0);
        setContacts(validContacts);
      }
      setLoading(false);
    })();
  }, []);

  // 2. FUNCIÓN PARA ABRIR CHATS REALES
  const handleOpenChat = (contactName: string, phoneNumber: string) => {
    // Limpiamos el número para quitar espacios, guiones o paréntesis
    // Ej: "+58 (414) 123-4567" -> "584141234567"
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

    Alert.alert(
      `Escribir a ${contactName}`,
      "Selecciona la aplicación de mensajería:",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "SMS Nativo", 
          onPress: () => {
            Linking.openURL(`sms:${cleanNumber}`);
          } 
        },
        { 
          text: "WhatsApp", 
          onPress: () => {
            // WhatsApp URL Scheme
            const url = `whatsapp://send?phone=${cleanNumber}&text=Hola`;
            Linking.canOpenURL(url).then(supported => {
              if (supported) {
                Linking.openURL(url);
              } else {
                Alert.alert("Error", "WhatsApp no está instalado en este dispositivo");
              }
            });
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!permission) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: 'white'}}>Se requiere permiso de contactos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mensajes</Text>
        <Text style={styles.subHeader}>Iniciar conversación real</Text>
      </View>

      {/* LISTA DE PERSONAS */}
      <FlatList 
        data={contacts}
        keyExtractor={(item, index) => (item.id || item.name) + index}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {
          const phone = item.phoneNumbers?.[0]?.number;
          
          return (
            <TouchableOpacity 
              style={styles.row} 
              onPress={() => phone && handleOpenChat(item.name, phone)}
            >
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                    </Text>
                </View>
                {/* Indicador visual de "Online" (Decorativo) */}
                <View style={styles.onlineBadge} />
              </View>

              {/* Info */}
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.number}>{phone}</Text>
              </View>

              {/* Icono de acción */}
              <Ionicons name="chatbubble-ellipses-outline" size={26} color="#34C759" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro puro (Estilo Dark Mode)
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
  },
  subHeader: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759', // Verde
    borderWidth: 2,
    borderColor: '#000',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  number: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});