import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import { elegirImagenBase64 } from '../src/utils/imagenes';

export default function EditProfile({ route, navigation }) {
  const { userData, setUserData } = route.params;

  const [nombre, setNombre] = useState(userData.nombre);
  const [apellido, setApellido] = useState(userData.apellido);
  const [barrio, setBarrio] = useState(userData.barrio);
  const [calle, setCalle] = useState(userData.calle);
  const [altura, setAltura] = useState(userData.altura);
  const [telefono, setTelefono] = useState(userData.telefono);
  const [foto, setFoto] = useState(userData.foto || '');

  const handleSave = async () => {
    const actualizado = {
      ...userData,
      nombre,
      apellido,
      barrio,
      calle,
      altura,
      telefono,
      foto
    };
    setUserData(actualizado);
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'usuarios', auth.currentUser.uid), {
          nombre,
          apellido,
          barrio,
          calle,
          altura,
          telefono,
          foto,
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil.');
    }
  };

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Editar Perfil</Text>

        <TouchableOpacity
          style={styles.avatarContainer}
          activeOpacity={0.8}
          onPress={async () => {
            try {
              const b64 = await elegirImagenBase64();
              if (b64) setFoto(b64);
            } catch (error) {
              Alert.alert('Error', 'No se pudo seleccionar la imagen.');
            }
          }}
        >
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatar} />
          ) : (
            <Ionicons name="camera" size={32} color="#c25c32" />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nombre</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej. Juan" />
          <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
        </View>

        <Text style={styles.label}>Apellido</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={apellido} onChangeText={setApellido} placeholder="Ej. Pérez" />
          <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
        </View>

        <Text style={styles.label}>Barrio</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={barrio} onChangeText={setBarrio} placeholder="Ej. Centro" />
          <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 2, marginRight: 10 }}>
            <Text style={styles.label}>Calle</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={calle} onChangeText={setCalle} placeholder="Ej. Av. Belgrano" />
              <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Altura</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={altura} onChangeText={setAltura} keyboardType="numeric" placeholder="Ej. 1234" />
              <FontAwesome5 name="pen" size={14} color="#c25c32" style={styles.iconRight} />
            </View>
          </View>
        </View>

        <Text style={styles.label}>Teléfono</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholder="Ej. 387123456" />
          <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
        </View>

        <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#313131',
    alignSelf: 'center',
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#c25c32',
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 15.5,
    fontFamily: 'Poppins_400Regular',
    marginTop: 10,
    color: '#313131',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c25c32',
    borderRadius: 100,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 15,
    width: '100%',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    color: '#313131',
    fontSize: 15,
  },
  iconRight: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonSave: {
    width: '100%',
    backgroundColor: '#c25c32',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginTop: 25,
    marginBottom: 30,
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
