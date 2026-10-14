import React from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Poppins_700Bold, Poppins_400Regular } from '@expo-google-fonts/poppins';



export default function InfoEmpresa({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
    Poppins_400Regular
  });

  if (!fontsLoaded) {
    return <Text>Cargando fuentes...</Text>;
  }

  return (
    <View style={styles.container}>
        <ScrollView>
        <Image source={require('../assets/logo_sa/icon.png')} style={styles.logo} />
        <LinearGradient 
        colors={['#ff7a00', '#b3491c']}
        start={{ x: 0, y: 0 }} // Empieza a la izquierda
        end={{ x: 1, y: 0 }}   // Termina a la derecha
        style={styles.section}
        >
        <View>
        <Text style={styles.title}>¿QUIENES SOMOS?</Text>
        <Text style={styles.text}> Somos una pequeña empresa regional, con alcance nacional y fines lucrativos, fundada en el 2009, ubicada principalmente en la Provincia de Salta. Funcionamos como una empresa de gestion privada dedicada al sector secundario, donde nuestra principal actividad es la transformacion de la materia prima y su misma distribución.</Text>
        </View>
        </LinearGradient>
        <LinearGradient 
        colors={['#ff7a00', '#b3491c']}
        start={{ x: 0, y: 0 }} // Empieza a la izquierda
        end={{ x: 1, y: 0 }}   // Termina a la derecha
        style={styles.section}
        >
        <View>
          <Text style={styles.title}>NUESTRA MISIÓN</Text>
          <Text style={styles.text}>Nos dedicamos al acopio, secado, molienda, fraccionamiento y comercialización de especias, condimentos y hierbas aromáticas, llevando el trabajo de nuestros productores a las mesas de las familias.</Text>
        </View>
        </LinearGradient>
        <LinearGradient 
        colors={['#ff7a00', '#b3491c']}
        start={{ x: 0, y: 0 }} // Empieza a la izquierda
        end={{ x: 1, y: 0 }}   // Termina a la derecha
        style={styles.section}
        >
        <View>
          <Text style={styles.title}>NUESTRA VISIÓN</Text>
          <Text style={styles.text}>Acompañar el crecimiento sostenido de la demanda, expandiendo nuestra cobertura de venta y liderazgo en el NOA.</Text>
        </View>
        </LinearGradient>
        <LinearGradient 
        colors={['#ff7a00', '#b3491c']}
        start={{ x: 0, y: 0 }} // Empieza a la izquierda
        end={{ x: 1, y: 0 }}   // Termina a la derecha
        style={styles.section}
        >
        <View>
          <Text style={styles.title}>¿DONDE NOS UBICAMOS?</Text>
          <Text style={styles.text}>Oficina Comercial y Administrativa: Zona centro, Salta Capital{"\n"}
            Planta Industrial: Parque Industrial de Cerrillos, Valle de Lerma, Provincia de Salta{"\n"}
            Centro de acopio y secado: Cachi, Valles Calchaquíes, Provincia de Salta.
            </Text>
        </View>
        </LinearGradient>
        <LinearGradient 
        colors={['#ff7a00', '#b3491c']}
        start={{ x: 0, y: 0 }} // Empieza a la izquierda
        end={{ x: 1, y: 0 }}   // Termina a la derecha
        style={styles.section}
        >
        <View>
          <Text style={styles.title}>¿CUAL ES NUESTRA COBERTURA DE VENTA?</Text>
          <Text style={styles.text}> Nuestra cobertura de venta abarca las provincia de: Salta, Tucumán, Jujuy, Santiago del Estero y Catarmarca (Venta Directa). Buenos Aire, Córdoba y Rosario.(A través de distibuidores)</Text>
        </View>
        </LinearGradient>
        <LinearGradient 
        colors={['#ff7a00', '#b3491c']}
        start={{ x: 0, y: 0 }} // Empieza a la izquierda
        end={{ x: 1, y: 0 }}   // Termina a la derecha
        style={styles.section}
        >
        <View>
          <Text style={styles.title}>¿COMO CONTACTARNOS?</Text>
          <Text style={styles.text}>Telefono: +543875678123</Text>
          <Text style={styles.text}>Email: saborandino@gmail.com</Text>
        </View>
        </LinearGradient>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={['#b69e90', '#b69e90']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          ><Text style={styles.buttonText}>Volver</Text></LinearGradient>
        </TouchableOpacity>
        </ScrollView>
    </View>
  )
}
    
const styles = StyleSheet.create({


  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffffff',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
    resizeMode: 'contain',    
    alignSelf: 'center',
  },
  section: {
  width: '90%',     
  minHeight: 197.3,    
  borderRadius: 20,
  padding: 24,
  marginBottom: 20,
  alignItems: 'center',
  alignSelf: 'center',
},
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Poppins_400Regular',
    fontStyle: 'italic',
    fontSize: 15,
    color: '#ffffff'
  },
  buttonWrapper: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
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
    fontFamily: 'Poppins_700Bold',
  },

})