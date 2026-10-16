import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';

export default function Welcome() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,     // 2 segundos de animación suave
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Imagen Sabor Andino pantalla completa adaptada al celular */}
      <Animated.Image 
        source={require('../assets/logosabor.png')} 
        style={[styles.fullScreenImage, { opacity: fadeAnim }]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Fondo de respaldo por si el celu es ultra largo
  },
  fullScreenImage: {
    width: '100%',         // 100% del ancho del celular
    height: '100%',        // 100% del alto del celular
    resizeMode: 'cover',   // Cubre la pantalla completa de punta a punta
  },
});
