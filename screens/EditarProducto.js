import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../src/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { elegirImagenBase64 } from '../src/utils/imagenes';

export default function EditarProducto({ route, navigation }) {
  const { id } = route.params; // Recibimos el id correctamente
  const [campos, setCampos] = useState({});
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [imagen, setImagen] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const docRef = doc(db, 'productos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const { imagen: img, ...resto } = data;
          const inicial = {};
          Object.entries(resto).forEach(([clave, valor]) => {
            inicial[clave] = valor !== null && typeof valor === 'object' ? JSON.stringify(valor) : String(valor);
          });
          setCampos(inicial);
          setOriginal(resto);
          setImagen(img || '');
        }
      } catch (error) {
        console.error("Error al cargar producto para editar:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id]);

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

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const actualizado = {};
      Object.keys(campos).forEach((clave) => {
        actualizado[clave] = typeof original[clave] === 'number' ? Number(campos[clave]) : campos[clave];
      });
      const docRef = doc(db, 'productos', id);
      await updateDoc(docRef, { ...actualizado, imagen });
      Alert.alert('Éxito', 'Producto actualizado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarGuardar = () => {
    //-- Variable y condicionante para chequear que no existe ningún campo vacio
    const hayVacio = Object.values(campos).some((valor) => String(valor).trim() === '');
    if (hayVacio) {
      Alert.alert('Error', 'Ningún campo puede quedar vacío.');
      return;
    }
    Alert.alert('Guardar cambios', '¿Estás seguro que deseas guardar los cambios?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Guardar', onPress: guardarCambios },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f9682b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titulo}>Editar Producto</Text>

        {!!imagen && <Image source={{ uri: imagen }} style={styles.preview} />}

        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={async () => {
            try {
              const b64 = await elegirImagenBase64();
              if (b64) setImagen(b64);
            } catch (error) {
              Alert.alert('Error', 'No se pudo seleccionar la imagen.');
            }
          }}
        >
          <LinearGradient
            colors={['#b69e90', '#b69e90']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          ><Text style={styles.buttonText}>Cambiar imagen</Text></LinearGradient>
        </TouchableOpacity>

        {Object.keys(campos).map((clave) => (
          <View key={clave}>
            <Text style={styles.label}>{clave.charAt(0).toUpperCase() + clave.slice(1)}</Text>
            <TextInput
              style={styles.input}
              value={campos[clave]}
              onChangeText={(texto) => setCampos((prev) => ({ ...prev, [clave]: texto }))}
              keyboardType={typeof original[clave] === 'number' ? 'numeric' : 'default'}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.buttonWrapper} onPress={confirmarGuardar} disabled={guardando}>
          <LinearGradient
            colors={['#ff7a00', '#b3491c']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          ><Text style={styles.buttonText}>{guardando ? 'Guardando...' : 'Guardar Cambios'}</Text></LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={['#b69e90', '#b69e90']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          ><Text style={styles.buttonText}>Volver</Text></LinearGradient>
        </TouchableOpacity>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#313131', textAlign: 'center' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  preview: { width: 160, height: 160, borderRadius: 12, alignSelf: 'center', marginVertical: 10 },
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
