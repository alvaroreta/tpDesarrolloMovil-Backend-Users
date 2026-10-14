import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
//-- importa funciones de consulta y eliminación de datos de la BD
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
//- incopora logout de sesión actual
import { signOut } from 'firebase/auth';
import { auth, db } from '../src/config/firebaseConfig';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function Home({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });

  //-- mantiene la pantalla de home actualizada por cada evento de cambio realizado en las pantallas de edición
  useFocusEffect(
    useCallback(() => {
      const cargar = async () => {
        try {
          const snap = await getDocs(collection(db, 'productos'));
          setProductos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        } catch (e) {
          console.error('Error al cargar productos:', e.code, e.message);
        }
      };
      cargar();
    }, [])
  );

  //- función flecha de cierre de sesión 
  const cerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (e) {
            console.error('Error al cerrar sesión:', e.code, e.message);
            Alert.alert('Error', 'No se pudo cerrar la sesión.');
          }
        },
      },
    ]);
  };

  //-- función de eliminación de producto mediante dialogo de confirmación
  const eliminarProducto = (id) => {
    Alert.alert('Eliminar producto', '¿Estás seguro que deseas eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'productos', id));
            setProductos((prev) => prev.filter((p) => p.id !== id));
          } catch (e) {
            console.error('Error al eliminar producto:', e.code, e.message);
            Alert.alert('Error', 'No se pudo eliminar el producto.');
          }
        },
      },
    ]);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>PRODUCTOS</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Carga de productos que mapea el id de cada elemento desde la bd */}
        {productos.map((producto) => (
          <View key={producto.id} style={styles.card}>
            {!!producto.imagen && <Image source={{ uri: producto.imagen }} style={styles.foto} />}
            <View style={styles.info}>
              <Text style={styles.nombre}>{producto.nombre}</Text>
              <Text style={styles.stock}>Stock: {producto.stock}</Text>
              <View style={styles.acciones}>
                <TouchableOpacity style={[styles.boton, styles.botonVer]} onPress={() => navigation.navigate('VerProducto', { id: producto.id })}>
                  <Text style={styles.botonTexto}>Ver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.boton, styles.botonEditar]} onPress={() => navigation.navigate('EditarProducto', { id: producto.id })}>
                  <Text style={styles.botonTexto}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.boton, styles.botonEliminar]} onPress={() => eliminarProducto(producto.id)}>
                  <Text style={styles.botonTexto}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        {/* Menu fijo de selección de pantallas */}
      </ScrollView>
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Inicio", "Ya estás en la pantalla de inicio.")}>
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
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  h1: {
    fontSize: 20,
    padding: 10,
    fontFamily: 'Poppins_700Bold',
    color: '#313131',
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  foto: {
    width: 72,
    borderRadius: 8,
    marginRight: 12,
    alignSelf: 'stretch',
  },
  nombre: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#313131',
  },
  stock: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  acciones: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  boton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonVer: {
    backgroundColor: '#f9682b',
  },
  botonEditar: {
    backgroundColor: '#9e9e9e',
  },
  botonEliminar: {
    backgroundColor: '#e53935',
  },
  botonTexto: {
    color: '#fff',
    fontSize: 12,
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
