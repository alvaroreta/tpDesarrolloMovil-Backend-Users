import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { elegirImagenBase64 } from '../src/utils/imagenes';
import BottomMenu from '../components/BottomMenu';

export default function AgregarProducto({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [codigoSku, setCodigoSku] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [nroLote, setNroLote] = useState('');
  const [pesoNeto, setPesoNeto] = useState('');
  const [foto, setFoto] = useState('');
  const [guardando, setGuardando] = useState(false);

  const confirmarGuardar = () => {
    // Validamos que absolutamente todos los campos estén llenos
    if (
      !nombre.trim() || 
      !codigoSku.trim() || 
      !descripcion.trim() || 
      !precio.trim() || 
      !stock.trim() || 
      !nroLote.trim() || 
      !pesoNeto.trim()
    ) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos antes de continuar.');
      return;
    }

    Alert.alert(
      'Confirmar registro',
      `¿Estás seguro de que deseas agregar el producto "${nombre.trim()}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, agregar', 
          onPress: () => guardarProducto() 
        }
      ]
    );
  };

  const guardarProducto = async () => {
    setGuardando(true);
    try {
      await addDoc(collection(db, 'productos'), {
        nombre: nombre.trim(),
        codigo_sku: codigoSku.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        stock: Number(stock),
        nro_lote: Number(nroLote),
        peso_neto_g: Number(pesoNeto),
        imagen: foto,
        createdAt: new Date(),
      });

      Alert.alert('Éxito', 'Producto agregado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      Alert.alert('Error', 'No se pudo guardar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Nuevo Producto</Text>

        {!!foto && <Image source={{ uri: foto }} style={styles.preview} />}

        <TouchableOpacity
          style={styles.botonImagen}
          onPress={async () => {
            try {
              const b64 = await elegirImagenBase64();
              if (b64) setFoto(b64);
            } catch (error) {
              Alert.alert('Error', 'No se pudo seleccionar la imagen.');
            }
          }}
        >
          <Ionicons name="image-outline" size={20} color="#f9682b" />
          <Text style={styles.botonImagenTexto}>{foto ? ' Cambiar imagen' : ' Agregar imagen'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Nombre *</Text>
        <TextInput style={styles.input} placeholder="Ej. Adobo asado granel" value={nombre} onChangeText={setNombre} placeholderTextColor="#888" />

        <Text style={styles.label}>Código SKU *</Text>
        <TextInput style={styles.input} placeholder="Ej. ADO-ASA-1KG" value={codigoSku} onChangeText={setCodigoSku} placeholderTextColor="#888" />

        <Text style={styles.label}>Descripción *</Text>
        <TextInput style={styles.input} placeholder="Ej. Adobo para el asado a granel" value={descripcion} onChangeText={setDescripcion} placeholderTextColor="#888" />

        <Text style={styles.label}>Precio *</Text>
        <TextInput style={styles.input} placeholder="Ej. 14500" value={precio} onChangeText={setPrecio} keyboardType="numeric" placeholderTextColor="#888" />

        <Text style={styles.label}>Stock *</Text>
        <TextInput style={styles.input} placeholder="Ej. 35" value={stock} onChangeText={setStock} keyboardType="numeric" placeholderTextColor="#888" />

        <Text style={styles.label}>Número de Lote *</Text>
        <TextInput style={styles.input} placeholder="Ej. 1014" value={nroLote} onChangeText={setNroLote} keyboardType="numeric" placeholderTextColor="#888" />

        <Text style={styles.label}>Peso Neto (g) *</Text>
        <TextInput style={styles.input} placeholder="Ej. 1000" value={pesoNeto} onChangeText={setPesoNeto} keyboardType="numeric" placeholderTextColor="#888" />

        <TouchableOpacity style={styles.buttonWrapper} onPress={confirmarGuardar} disabled={guardando}>
          <LinearGradient
            colors={['#ff7a00', '#b3491c']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {guardando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar Producto</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.goBack()}>
          <LinearGradient
            colors={['#b69e90', '#b69e90']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
      <BottomMenu navigation={navigation} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#313131', textAlign: 'center' },
  label: { fontSize: 14, color: '#666', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9', color: '#313131' },
  preview: { width: 160, height: 160, borderRadius: 12, alignSelf: 'center', marginBottom: 15 },
  botonImagen: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#f9682b', borderRadius: 100, paddingVertical: 12, marginBottom: 10 },
  botonImagenTexto: { color: '#f9682b', fontSize: 15, fontWeight: '600' },
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
  }
});