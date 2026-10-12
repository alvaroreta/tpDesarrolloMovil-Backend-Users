import React, { use, useState } from 'react';
//-- Importa scrollview para generar scroll vertical en la página
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

//- lista de cargos para la optionbar de creación de cuentas
const CARGOS = [
  'Encargado Administrativo',
  'Aux. Adm.',
  'Enc. de Deposito',
  'Responsable de compra y acopio',
  'Acopiador',
  'Jefe de Planta',
  'Analista QA',
];

export default function SignUp({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('')
  const [showCargoOptions, setShowCargoOptions] = useState(false);
  const [barrio, setBarrio] = useState('')
  const [calle, setCalle] = useState('')
  const [altura, setAltura] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSignUp = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword || !calle.trim() || !altura.trim() || !cargo.trim() || !barrio.trim() || !telefono.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    const letrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    //--Incorporamos revisión de caracteres en el formulario de alta
    if (!letrasRegex.test(firstName.trim()) || !letrasRegex.test(lastName.trim())) {
      Alert.alert("Nombre o Apellido inválido", "Los campos de nombre y apellido solo pueden contener letras.");
      return;
    }

    if (!letrasRegex.test(barrio.trim())) {
      Alert.alert("Dato inválido", "El barrio solo puede contener letras.")
      return;
    }

    if (!CARGOS.includes(cargo)) {
      Alert.alert("Cargo inválido", "Debe seleccionar un cargo de la lista.")
      return;
    }

    const calleRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\d\s.]+$/;
    if (!calleRegex.test(calle.trim())) {
      Alert.alert("Calle inválida", "La calle solo puede contener letras y números.")
      return;
    }

    if (!/^\d+$/.test(altura.trim())) {
      Alert.alert("Altura inválida", "La altura debe ser un número.")
      return;
    }

    if (!/^\d{7,15}$/.test(telefono.trim())) {
      Alert.alert("Teléfono inválido", "El teléfono debe tener entre 7 y 15 dígitos.")
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "La contraseña debe tener al menos 6 caracteres, incluyendo una letra mayúscula, una minúscula y un número."
      );
      return;
    }

    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      console.error('Error de registro:', error.code, error.message);
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está en uso.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        //--Incorporamos catcheo de error para los nombres y apellidos inválidos
        case 'auth/invalid-firstName':
          errorMessage = "Ingrese un nombre válido.";
          break;
        case 'auth/invalid-lastName':
          errorMessage = "Ingrese un apellido válido.";
          break
        case 'auth/weak-password':
          errorMessage = "La contraseña es demasiado débil.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
        case 'auth/invalid-api-key':
          errorMessage = "La clave API de Firebase no es válida. Revisa el archivo .env.";
          break;
      }
      Alert.alert("Error", `${errorMessage}\n\nCódigo: ${error.code ?? 'desconocido'}`);
      return;
    }

    try {
      await updateProfile(credential.user, { displayName: `${firstName.trim()} ${lastName.trim()}` });
      //-- Guardamos el perfil completo en Firestore: coleccion "usuarios" con el UID como id del documento
      await setDoc(doc(db, 'usuarios', credential.user.uid), {
        nombre: firstName.trim(),
        apellido: lastName.trim(),
        correo: email.trim(),
        cargo: cargo.trim(),
        barrio: barrio.trim(),
        calle: calle.trim(),
        altura: altura.trim(),
        telefono: telefono.trim(),
        creado: new Date().toISOString()
      });
      Alert.alert("Registro exitoso", "Usuario registrado con éxito.");
    } catch (error) {
      console.error('Error al guardar el perfil en Firestore:', error.code, error.message);
      Alert.alert("Cuenta creada", "La cuenta se creó, pero no se pudo guardar el perfil en la base de datos.");
    }
    // Firebase inicia la sesión y el navegador muestra Home.
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <Image source={require('../assets/logo_sa/icon.png')} style={styles.logo} />

      <Text style={styles.label}>Nombre</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <Text style={styles.label}>Apellido</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su apellido"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <Text style={styles.label}>Correo</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Cargo</Text>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowCargoOptions(true)}
        activeOpacity={0.7}
      >
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <Text style={cargo ? styles.input : styles.placeholder}>
          {cargo || 'Seleccione su cargo'}
        </Text>
        <FontAwesome name="chevron-down" size={16} color="#ccc" />
      </TouchableOpacity>

      <Modal
        visible={showCargoOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCargoOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCargoOptions(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccione su cargo</Text>
            {/* La lista de cargos harcodeadas nos permite persisitir los datos a fin de poder unificar los datos entrados por el usuario */}
            {CARGOS.map((opcion) => (
              <TouchableOpacity
                key={opcion}
                style={styles.modalOption}
                onPress={() => {
                  setCargo(opcion);
                  setShowCargoOptions(false);
                }}
              >
                <Text style={[styles.modalOptionText, cargo === opcion && styles.modalOptionTextSelected]}>
                  {opcion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>


      <Text style={styles.label}>Barrio</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su barrio"
          value={barrio}
          onChangeText={setBarrio}
        />
      </View>


      <Text style={styles.label}>Calle</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su Calle"
          value={calle}
          onChangeText={setCalle}
        />
      </View>

      <Text style={styles.label}>Altura</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese la altura"
          value={altura}
          onChangeText={setAltura}
          keyboardType="numeric"
        />
      </View>


      <Text style={styles.label}>Telefono</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su telefóno"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
      </View>

      <Text style={styles.label}>Contraseña</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirmar Contraseña</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirme su contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.buttonWrapper} onPress={handleSignUp}>
        <LinearGradient
          colors={['#ff7a00', '#b3491c']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        ><Text style={styles.buttonText}>Crear Cuenta</Text></LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Login')}>
        <LinearGradient
          colors={['#b69e90', '#b69e90']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        ><Text style={styles.buttonText}>Volver</Text></LinearGradient>
      </TouchableOpacity>

    </ScrollView >
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 180,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 20,
    color: '#313131',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    marginTop: 10,
    color: '#313131',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c25c32',
    borderRadius: 100,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#313131',
  },
  placeholder: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
    color: '#313131',
    marginBottom: 10,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#313131',
  },
  modalOptionTextSelected: {
    color: '#c25c32',
    fontFamily: 'Poppins_600SemiBold',
  },
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
  signUpText: {
    marginTop: 20,
    color: '#007AFF',
    fontFamily: 'Poppins_600SemiBold',
  },
});
