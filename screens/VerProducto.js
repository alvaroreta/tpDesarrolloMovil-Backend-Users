import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../src/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerProducto({ route, navigation }) {
  const { id } = route.params; // Recibimos el id correctamente
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const docRef = doc(db, 'productos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProducto(docSnap.data());
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProducto();
  }, [id]);

  const cerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth.signOut();
          } catch (error) {
            console.error('Error al cerrar sesión: ', error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f9682b" />
      </View>
    );
  }

  if (!producto) {
    //--Alerta en caso de no encontrar el producto en la bd
    return (
      <View style={styles.center}>
        <Text>No se encontró el producto.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titulo}>Detalle del Producto</Text>

        {!!producto.imagen && <Image source={{ uri: producto.imagen }} style={styles.preview} />}

        <View style={styles.card}>
          {/*Mapea todos los atributos de los productos según su key*/}
          {Object.entries(producto)
            .filter(([clave]) => clave !== 'imagen')
            .map(([clave, valor]) => (
              <View key={clave}>
                <Text style={styles.label}>
                  {clave.charAt(0).toUpperCase() + clave.slice(1)}:
                </Text>
                <Text style={styles.valor}>
                  {valor !== null && typeof valor === 'object' ? JSON.stringify(valor) : String(valor)}
                </Text>
              </View>
            ))}
        </View>

        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={['#b69e90', '#b69e90']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          ><Text style={styles.buttonText}>Volver</Text></LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#ffffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AgregarProducto')}>
          <Ionicons name="cube-outline" size={25} color="#ffffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={25} color="#ffffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InfoEmpresa')}>
          <Ionicons name="information-circle-outline" size={30} color="#ffffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={cerrarSesion}>
          <Ionicons name="log-out-outline" size={30} color="#ffffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#313131', textAlign: 'center' },
  card: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 20, backgroundColor: '#f9f9f9', marginBottom: 20 },
  preview: { width: 200, height: 200, borderRadius: 12, alignSelf: 'center', marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginTop: 10 },
  valor: { fontSize: 18, fontWeight: '600', color: '#313131', marginTop: 2 },
  buttonWrapper: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  bottomMenu: {
    height: 65,
    backgroundColor: '#f9682b',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});