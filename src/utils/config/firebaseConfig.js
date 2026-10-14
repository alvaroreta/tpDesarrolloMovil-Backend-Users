import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tus credenciales oficiales de Sabor Andino
const firebaseConfig = {
  apiKey: "AIzaSyDr9ZWCIyl6GTxb5JXwj_LPCdhxgt1ZVl0",
  authDomain: "saborandinotp-desarrolla-movil.firebaseapp.com",
  projectId: "saborandinotp-desarrolla-movil",
  storageBucket: "saborandinotp-desarrolla-movil.firebasestorage.app",
  messagingSenderId: "607942139204",
  appId: "1:607942139204:web:a0652ec350f0651d260b11"
};

// Evita que Firebase se inicialice dos veces al recargar la app en el celular
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Configura la persistencia para que la sesión no se cierre al salir de la app
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Bandera que pide tu archivo Navigation.js para saber si está configurado
const isFirebaseConfigured = true;

export { auth, isFirebaseConfigured };
