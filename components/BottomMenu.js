import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function BottomMenu({ navigation }) {
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

  return (
    <View style={styles.bottomMenu}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={22} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AgregarProducto')}>
        <Ionicons name="cube-outline" size={25} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="person-outline" size={25} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InfoEmpresa')}>
        <Ionicons name="information-circle-outline" size={30} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={cerrarSesion}>
        <Ionicons name="log-out-outline" size={30} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
