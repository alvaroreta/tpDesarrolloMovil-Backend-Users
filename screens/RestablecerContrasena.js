import React from 'react'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native'
import { Alert } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';

export default function RestablecerContrasena({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });
  const [email, setEmail] = React.useState('');
  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingrese su correo electrónico.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert("Correo enviado", "Si te encontrás registrado en la aplicación deberás recibir un email para restablecer tu contraseña.");
      navigation.goBack();
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error.code, error.message);
      let errorMessage = "No se pudo enviar el correo de restablecimiento.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No se encontró un usuario con este correo.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
        case 'auth/invalid-api-key':
          errorMessage = "La clave API de Firebase no es válida.";
          break;
      }
      Alert.alert("Error", `${errorMessage}\n\nCódigo: ${error.code ?? 'desconocido'}`);
    }
  }




  if (!fontsLoaded) return null; //--Si las fuentes no se cargan, no renderiza nada

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image source={require('../assets/logo_sa/icon.png')} style={styles.logo} />
        <Text style={styles.description}>Ingresa tu correo electrónico y te enviaremos un enlace para reestablecer tu contraseña.</Text>
        <Text style={styles.label}>Email</Text>
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
        <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
          <LinearGradient
            colors={['#ff7a00', '#b3491c']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Enviar enlace</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Login')}>
          <LinearGradient
            colors={['#b69e90', '#b69e90']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          ><Text style={styles.buttonText}>Volver</Text></LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 195,
    height: 100,
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#313131',
    marginBottom: 5,
  },
  title: {
    color: '#313131',
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
    textAlign: 'center'
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    //Incopora poppins al texto de muestra
    fontFamily: 'Poppins_400Regular',
    marginTop: 10,
    color: '#313131',
    fontSize: 15.5,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f9682b',
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
    //Incopora poppins al input
    fontFamily: 'Poppins_400Regular',
    fontStyle: 'italic'
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

})