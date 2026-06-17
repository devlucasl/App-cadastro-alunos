import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export async function pickAndSaveDocument(prefix: string): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Permissão para acessar imagens negada.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  const image = result.assets[0];

  const manipulated = await ImageManipulator.manipulateAsync(
    image.uri,
    [{ resize: { width: 1000 } }],
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  const baseDirectory = FileSystem.documentDirectory;

  if (!baseDirectory) {
    throw new Error('Diretório local não encontrado.');
  }

  const directory = `${baseDirectory}documentos/`;
  const fileName = `${prefix}-${Date.now()}.jpg`;
  const finalUri = `${directory}${fileName}`;

  const directoryInfo = await FileSystem.getInfoAsync(directory);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }

  await FileSystem.copyAsync({
    from: manipulated.uri,
    to: finalUri,
  });

  return finalUri;
}