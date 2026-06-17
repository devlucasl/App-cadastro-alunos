import { AppButton } from '@/components/AppButton';
import { auth } from '@/config/firebase';
import { pickAndSaveDocument } from '@/services/localDocumentService';
import { listenStudentByUserId, updateStudentDocuments } from '@/services/studentService';
import { Student } from '@/types/student';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';

export default function DocumentsScreen() {
  const [student, setStudent] = useState<Student | null>(null);
  const [documentoUri, setDocumentoUri] = useState('');
  const [certificadoUri, setCertificadoUri] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      router.replace('/login');
      return;
    }

    const unsubscribe = listenStudentByUserId(userId, currentStudent => {
      setStudent(currentStudent);

      if (currentStudent) {
        setDocumentoUri(currentStudent.documentoUri ?? '');
        setCertificadoUri(currentStudent.certificadoUri ?? '');
      }
    });

    return unsubscribe;
  }, []);

  async function handlePickDocument() {
    try {
      const uri = await pickAndSaveDocument('documento-pessoal');

      if (uri) {
        setDocumentoUri(uri);
      }
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível escolher o documento.');
    }
  }

  async function handlePickCertificate() {
    try {
      const uri = await pickAndSaveDocument('certificado');

      if (uri) {
        setCertificadoUri(uri);
      }
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível escolher o certificado.');
    }
  }

  async function handleSave() {
    if (!student?.id) {
      Alert.alert('Atenção', 'Cadastre seus dados antes de enviar documentos.');
      router.replace('/student-form');
      return;
    }

    if (!documentoUri || !certificadoUri) {
      Alert.alert('Atenção', 'Envie o documento pessoal e o certificado.');
      return;
    }

    try {
      setLoading(true);
      await updateStudentDocuments(student.id, documentoUri, certificadoUri);
      Alert.alert('Sucesso', 'Documentos salvos com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os documentos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 8 }}>Documentos</Text>
      <Text style={{ color: '#555', marginBottom: 18 }}>Envie RG/CPF e certificado de conclusão.</Text>

      <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
        <AppButton title="Selecionar documento pessoal" onPress={handlePickDocument} variant="secondary" />
        {documentoUri ? <Image source={{ uri: documentoUri }} style={{ width: '100%', height: 220, borderRadius: 8, marginBottom: 16 }} /> : null}

        <AppButton title="Selecionar certificado" onPress={handlePickCertificate} variant="secondary" />
        {certificadoUri ? <Image source={{ uri: certificadoUri }} style={{ width: '100%', height: 220, borderRadius: 8, marginBottom: 16 }} /> : null}

        <AppButton title="Salvar documentos" onPress={handleSave} loading={loading} />
        <AppButton title="Voltar" onPress={() => router.back()} variant="secondary" />
      </View>
    </ScrollView>
  );
}