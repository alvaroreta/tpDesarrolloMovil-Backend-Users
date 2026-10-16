import React, { useState } from 'react';
//-- incoramos KeyboardAvoidingView para evitar que el teclado se superoponga a los campos de ingresos de datos
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome5, Ionicons, FontAwesome } from '@expo/vector-icons';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../src/config/firebaseConfig';
import { elegirImagenBase64 } from '../src/utils/imagenes';
import { LinearGradient } from 'expo-linear-gradient';

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
//- Importa fuente poppings mediante expo-font y expo-google-fonts, para poder usarla en los estilos de la pantalla de edición de perfil.
export default function EditProfile({ route, navigation }) {
  const { userData, setUserData } = route.params;

  const [nombre, setNombre] = useState(userData.nombre);
  const [apellido, setApellido] = useState(userData.apellido);
  const [cargo, setCargo] = useState(userData.cargo || '');
  const [showCargoOptions, setShowCargoOptions] = useState(false);
  const [barrio, setBarrio] = useState(userData.barrio);
  const [calle, setCalle] = useState(userData.calle);
  const [altura, setAltura] = useState(userData.altura);
  const [telefono, setTelefono] = useState(userData.telefono || '(0');
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
//--Función para manejar el guardado de los cambios en el perfil del usuario.
 const handleSave = () => {
    if (!cargo.trim() || !CARGOS.includes(cargo)) {
      Alert.alert("Cargo inválido", "Debe seleccionar un cargo válido de la lista.");
      return;
    }
//--Se muestra un mensaje de confirmación antes de guardar los cambios.
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
//--Sección de estilos para la pantalla de edición de perfil
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

         <TextInput 
          style={styles.input} 
          value={nombre} 
          onChangeText={(texto) => {
    // Borra automáticamente cualquier cosa que NO sea letra o espacio
          const soloLetras = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
          setNombre(soloLetras);
        }} 
        placeholder="Ej. Juan" 
      />
          <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
        </View>

        <Text style={styles.label}>Apellido</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={apellido} onChangeText={(texto) => {
            const soloLetras = texto.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
            setApellido(soloLetras);
          }} placeholder="Ej. Pérez" />
          <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
        </View>
        
                <Text style={styles.label}>Cargo</Text>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowCargoOptions(true)}
          activeOpacity={0.7}
        >
          <Text style={cargo ? styles.input : styles.placeholder}>
            {cargo || 'Ej. Analista QA'}
          </Text>
          <FontAwesome name="chevron-down" size={16} color="#c25c32" style={styles.iconRight} />
        </TouchableOpacity>
      // muestra opciones para el usuario para seleccionar su cargo de la lista de CARGOS
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
                  <Text style={[{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#313131' }, cargo === opcion && { color: '#c25c32', fontFamily: 'Poppins_600SemiBold' }]}>
                    {opcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        //--Sección de dirección y teléfono 
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
          <TextInput style={styles.input} value={telefono} 
          keyboardType="phone-pad" // <-- Abre el teclado de teléfonos
          onChangeText={(texto) => {
            const numerosPuros = texto.replace(/[^0-9]/g, '');
            if (numerosPuros.length <= 1) {
            setTelefono('(0');
            return;
            }
            let resultado = '';
            if (numerosPuros.length > 0) {
              const codigoArea = numerosPuros.substring(1, 4); // Extrae los dígitos del código de área
              resultado = `(0${codigoArea}`; // Formatea el código de área
            }
            if (numerosPuros.length >= 4) {
              resultado += ') - '; // Agrega el guion después del código de área
              const restoTelefono = numerosPuros.substring(4); 
              resultado += restoTelefono;
             } // Agrega el resto del número   
            setTelefono(resultado); 
            }}
             placeholder="Ej. (0387) - 1234567" 
          />
          <FontAwesome5 name="pen" size={16} color="#c25c32" style={styles.iconRight} />
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
//Es la etiqueta que crea el contenedor visual para el menú inferior, que contiene 
//los botones de navegación y el botón de cerrar sesión. Se utiliza para organizar y mostrar los elementos del menú en la parte inferior de la pantalla.
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
// forma estandar de definir estilos en React Native, usando StyleSheet.create para optimizar el rendimiento y mantener la consistencia en toda la aplicación.
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
