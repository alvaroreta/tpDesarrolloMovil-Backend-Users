import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { formatearTelefono } from '../src/utils/telefono';

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState({
    email: auth.currentUser?.email || "nico@ejemplo.com",
    nombre: "Nico",
    apellido: "Pérez",
    cargo: "calidad",
    barrio: "Centro",
    calle: "Av. Belgrano",
    altura: "1234",
    telefono: "387123456",
    foto: ""
  });

  useEffect(() => {
    const cargarPerfil = async () => {
      if (!auth.currentUser) return;
      try {
        const snap = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
        if (snap.exists()) {
          setUserData((prev) => ({ ...prev, ...snap.data(), email: auth.currentUser.email || prev.email }));
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };
    cargarPerfil();
  }, []);

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


  return (

    <View style={styles.screenContainer}>
    
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

    <Text style={styles.title}>Perfil Usuario</Text>

      <View style={styles.avatarContainer}>
        {userData.foto ? (
          <Image source={{ uri: userData.foto }} style={styles.avatar} />
        ) : (
          <Ionicons name="person" size={56} color="#c25c32" />
        )}
      </View>

      <View style={styles.profileCard}>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <Text style={styles.valueText}>{userData.email}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Nombre</Text>
          <Text style={styles.valueText}>{userData.nombre}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Apellido</Text>
          <Text style={styles.valueText}>{userData.apellido}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Cargo</Text>
          <Text style={styles.valueText}>{userData.cargo}</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Dirección</Text>
          <Text style={styles.valueText}>{userData.calle} {userData.altura} (B° {userData.barrio})</Text>
        </View>

        <View style={styles.infoGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.valueText}>{formatearTelefono(userData.telefono)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate('EditProfile', { userData, setUserData })}
      >
        <LinearGradient
          colors={['#ff7a00', '#b3491c']}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
        <Text style={styles.buttonText}>Editar Perfil</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>

    {/* ACÁ PEGAMOS EL MENÚ DE LOS ÍCONOS ABAJO DE LA PANTALLA */}
    <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={22} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AgregarProducto')}>
          <Ionicons name="cube-outline" size={25} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={25} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('InfoEmpresa')}>
          <Ionicons name="information-circle-outline" size={30} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={cerrarSesion}>
          <Ionicons name="log-out-outline" size={30} color="#ffffff" />
        </TouchableOpacity>
     </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 25,
    color: '#313131',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#c25c32',
    backgroundColor: '#fcfcfc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fcfcfc',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: 25,
  },
  infoGroup: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingBottom: 8,
  },
  label: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 13,
    color: '#c25c32',
    textTransform: 'uppercase',
  },
  valueText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#313131',
    marginTop: 2,
  },
 buttonPrimary: {
    width: '100%',
    borderRadius: 100,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 12,
  },

gradientButton: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  buttonSecondary: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#313131',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  buttonTextSecondary: {
    color: '#313131',
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  screenContainer: { 
    flex: 1,
    backgroundColor: '#ffffff',
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
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
