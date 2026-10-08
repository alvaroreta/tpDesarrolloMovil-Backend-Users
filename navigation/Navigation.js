import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../src/config/firebaseConfig';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';

const Stack = createStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, setUser);
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
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerMode: 'float' }}>
        {user ? (
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
