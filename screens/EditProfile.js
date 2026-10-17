import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import { elegirImagenBase64 } from '../src/utils/imagenes';
import { LinearGradient } from 'expo-linear-gradient';
import { soloDigitos, formatearTelefono } from '../src/utils/telefono';

//- Lista de cargos copiada exactamente de SignUp
const CARGOS = [
  'Encargado Administrativo',
  'Aux. Adm.',
  'Enc. de Deposito',
  'Responsable de compra y acopio',
  'Acopiador',
  'Jefe de Planta',
  'Analista QA',
];

export default function EditProfile({ route, navigation }) {
  const { userData, setUserData } = route.params;

  const [nombre, setNombre] = useState(userData.nombre);
  const [apellido, setApellido] = useState(userData.apellido);
  const [cargo, setCargo] = useState(userData.cargo || '');
  const [showCargoOptions, setShowCargoOptions] = useState(false);
  const [barrio, setBarrio] = useState(userData.barrio);
  const [calle, setCalle] = useState(userData.calle);
  const [altura, setAltura] = useState(userData.altura);
  const [telefono, setTelefono] = useState(soloDigitos(userData.telefono));
  const [foto, setFoto] = useState(userData.foto || '');

  const procesarGuardado = async () => {
    const actualizado = {
      ...userData,
      nombre,
      apellido,
      cargo,
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
          cargo,
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

  const handleSave = () => {
    if (!cargo.trim() || !CARGOS.includes(cargo)) {
      Alert.alert("Cargo inválido", "Debe seleccionar un cargo válido de la lista.");
      return;
    }

    Alert.alert(
      'Confirmar cambios',
      '¿Estás seguro de que deseas guardar los cambios realizados?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, guardar',
          style: 'default',
          onPress: () => procesarGuardado(),
        },
      ],
      { cancelable: true }
    );
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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
            <Ionicons name="camera" size={32} color="#f9682b" />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Nombre</Text>
        <View style={styles.inputContainer}>

          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={(texto) => {
              const soloLetras = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
              setNombre(soloLetras);
            }}
            placeholder="Ej. Juan"
          />
          <FontAwesome5 name="pen" size={16} color="#f9682b" style={styles.iconRight} />
        </View>

        <Text style={styles.label}>Apellido</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={apellido} onChangeText={(texto) => {
            const soloLetras = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
            setApellido(soloLetras);
          }} placeholder="Ej. Pérez" />
          <FontAwesome5 name="pen" size={16} color="#f9682b" style={styles.iconRight} />
        </View>


        <Modal
          visible={showCargoOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCargoOptions(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              activeOpacity={1}
              onPress={() => setShowCargoOptions(false)}
            />
            <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 20, padding: 20 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#313131', marginBottom: 10 }}>Seleccione su cargo</Text>
              {CARGOS.map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                  onPress={() => {
                    setCargo(opcion);
                    setShowCargoOptions(false);
                  }}
                >
                  <Text style={[{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#313131' }, cargo === opcion && { color: '#f9682b', fontFamily: 'Poppins_600SemiBold' }]}>
                    {opcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>


        <Text style={styles.label}>Barrio</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={barrio} onChangeText={setBarrio} placeholder="Ej. Centro" />
          <FontAwesome5 name="pen" size={16} color="#f9682b" style={styles.iconRight} />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 2, marginRight: 10 }}>
            <Text style={styles.label}>Calle</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={calle} onChangeText={setCalle} placeholder="Ej. Av. Belgrano" />
              <FontAwesome5 name="pen" size={16} color="#f9682b" style={styles.iconRight} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Altura</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={altura} onChangeText={setAltura} keyboardType="numeric" placeholder="Ej. 1234" />
              <FontAwesome5 name="pen" size={14} color="#f9682b" style={styles.iconRight} />
            </View>
          </View>
        </View>

        <Text style={styles.label}>Teléfono</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={formatearTelefono(telefono)}
            keyboardType="phone-pad"
            onChangeText={(texto) => setTelefono(soloDigitos(texto))}
            placeholder="Ej. (0387) - 1234567"
          />
          <FontAwesome5 name="pen" size={16} color="#f9682b" style={styles.iconRight} />
        </View>

        <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
          <LinearGradient
            colors={['#ff7a00', '#b3491c']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Guardar Cambios</Text>
          </LinearGradient>
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
    </KeyboardAvoidingView>
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
    borderColor: '#f9682b',
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
    borderColor: '#f9682b',
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

  placeholder: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 15,
    color: '#999',
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
    marginTop: 25,
    borderRadius: 100,
    overflow: 'hidden',
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
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
