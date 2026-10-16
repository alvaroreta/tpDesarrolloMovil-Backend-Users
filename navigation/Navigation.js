import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../src/config/firebaseConfig';
//linea agregada para el inicio de la animacion
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import VerProducto from '../screens/VerProducto';
import EditarProducto from '../screens/EditarProducto';

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(undefined);
            //MODIFICADO PARA QUE EL SPLASH SE MUESTRE SIEMPRE 4 SEGUNDOS, INDEPENDIENTEMENTE DE LA AUTENTICACION
  // 1. (El estado para controlar el Splash):
  const [showSplash, setShowSplash] = useState(true);
 
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

   // 2.ESTE BLOQUE COMPLETO (El temporizador de 4 segundos):
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // Oculta el splash tras 4 segundos
    }, 4000);

    return () => clearTimeout(timer); // Limpieza al desmontar
  }, []);


  if (!isFirebaseConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          Falta configurar Firebase. Copia .env.example como .env y completa los datos de tu proyecto.
        </Text>
      </View>
    );
  }

  // 1. Mientras Firebase esté revisando el estado del usuario en segundo plano, mostramos la presentación
  if (user === undefined) {
    return <Welcome />;
  }

  // 2. Si Firebase ya sabe si hay o no usuario, pero TODAVÍA no pasaron los 4 segundos del contador, seguimos mostrando la presentación
  if (showSplash) {
    return <Welcome />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerMode: 'float' }}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerTitleAlign: 'center',
                headerTitle: () => (
                  <Image
                    source={require('../assets/logo_sa/icon.png')}
                    style={styles.headerLogo}
                    resizeMode="contain"
                  />
                ),
              }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false}}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ headerShown: false }} // <-- APAGA LA FLECHA Y EL CARTEL DE ARRIBA
            />
            <Stack.Screen
              name="VerProducto"
              component={VerProducto}
              options={{ title: 'Ver Producto', headerTintColor: '#c25c32' }}
            />
            <Stack.Screen
              name="EditarProducto"
              component={EditarProducto}
              options={{ title: 'Editar Producto', headerTintColor: '#c25c32' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Iniciar sesión' }} />
            {/* Cambiamos nombre a "Crear Usuario"*/}
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Crear Usuario' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  message: { textAlign: 'center', fontSize: 16 },
  headerLogo: { width: 120, height: 40 },
});
