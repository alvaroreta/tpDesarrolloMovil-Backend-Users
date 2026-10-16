import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../src/config/firebaseConfig';
import Welcome from '../screens/Welcome';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import VerProducto from '../screens/VerProducto';
import EditarProducto from '../screens/EditarProducto';
import InfoEmpresa from '../screens/InfoEmpresa';
import RestablecerContrasena from '../screens/RestablecerContrasena';
import AgregarProducto from '../screens/AgregarProducto';

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(undefined);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
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

  if (user === undefined) {
    return <Welcome />;
  }

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
              options={{ title: 'Mi Perfil', headerTintColor: '#f9682b', headerLeft: () => null }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{ title: 'Editar Perfil', headerTintColor: '#f9682b', headerLeft: () => null }}
            />
            <Stack.Screen
              name="VerProducto"
              component={VerProducto}
              options={{ title: 'Ver Producto', headerTintColor: '#f9682b', headerLeft: () => null }}
            />
            <Stack.Screen
              name="EditarProducto"
              component={EditarProducto}
              options={{ title: 'Editar Producto', headerTintColor: '#f9682b', headerLeft: () => null }}
            />
            <Stack.Screen
              name="AgregarProducto"
              component={AgregarProducto}
              options={{ title: 'Agregar Producto', headerTintColor: '#f9682b', headerLeft: () => null }}
            />
            <Stack.Screen
              name="InfoEmpresa"
              component={InfoEmpresa}
              options={{ title: 'Nosotros', headerTintColor: '#f9682b', headerLeft: () => null }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ title: 'Iniciar sesión' }} />
            {/* Cambiamos nombre a "Crear Usuario"*/}
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Crear Usuario' }} />
            <Stack.Screen name="RestablecerContrasena" component={RestablecerContrasena} options={{ title: 'Recuperar Contraseña' }} />
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
