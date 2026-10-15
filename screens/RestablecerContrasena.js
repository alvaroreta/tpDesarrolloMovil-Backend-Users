import React from 'react'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native'
import { Alert } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function RestablecerContrasena({ navigation }) {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold });
  const [email, setEmail] = React.useState('');
  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingrese su correo electrónico.");
      return;
    }
    Alert.alert("Recuperar contraseña", "Si te encontrás registrado en la aplicación deberás recibir un email para restablecer tu contraseña.");
  }




  if (!fontsLoaded) return null; //--Si las fuentes no se cargan, no renderiza nada

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Image source={require('../assets/logo_sa/icon.png')} style={styles.logo} />
      <Text>Ingresa tu correo electrónico y te enviaremos un enlace para reestablecer tu contraseña.</Text>
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




    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffffff',
  },
  logo: {
    width: 195,
    height: 100,
    marginBottom: 20,
    //--Elimina el logo de la organización del contenedor y lo posiciona arriba 
    position: 'absolute',
    top: 20,
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