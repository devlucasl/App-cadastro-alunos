import { AppButton } from '@/components/AppButton';
import { StudentCard } from '@/components/StudentCard';
import { listenStudents, markStudentAsDelivered } from '@/services/studentService';
import { Student } from '@/types/student';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

export default function AttendantScreen() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const unsubscribe = listenStudents(setStudents);
    return unsubscribe;
  }, []);

  async function handleDeliver(studentId?: string) {
    if (!studentId) {
      return;
    }

    try {
      await markStudentAsDelivered(studentId);
      Alert.alert('Sucesso', 'Status atualizado para Entregue.');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o status.');
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 8 }}>Painel do Atendente</Text>
      <Text style={{ color: '#555', marginBottom: 18 }}>Validação dos documentos dos alunos.</Text>

      <AppButton title="Sair" onPress={() => router.replace('/login')} variant="secondary" />

      {students.length === 0 ? (
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8 }}>
          <Text>Nenhum aluno cadastrado ainda.</Text>
        </View>
      ) : (
        students.map(student => (
          <StudentCard key={student.id} student={student} onDeliver={() => handleDeliver(student.id)} />
        ))
      )}
    </ScrollView>
  );
}