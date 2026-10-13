//-- permite trabjar con la subida de imagenes a la base de datos mediante base64
import * as ImagePicker from 'expo-image-picker';

export const elegirImagenBase64 = async () => {
  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) throw new Error('Permiso de galería denegado');

  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.3,
    base64: true,
  });

  if (res.canceled) return null;
  return `data:image/jpeg;base64,${res.assets[0].base64}`;
};
