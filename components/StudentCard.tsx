import { Student } from '@/types/student';
import { Image, Text, View } from 'react-native';
import { AppButton } from './AppButton';

type StudentCardProps = {
  student: Student;
  onDeliver?: () => void;
};

export function StudentCard({ student, onDeliver }: StudentCardProps) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>{student.nomeCompleto}</Text>
      <Text>CPF: {student.cpf}</Text>
      <Text>E-mail: {student.email}</Text>
      <Text>Telefone: {student.telefone}</Text>
      <Text>Curso: {student.curso}</Text>
      <Text style={{ marginTop: 6, fontWeight: '700' }}>Status: {student.status}</Text>

      {student.documentoUri ? (
        <>
          <Text style={{ marginTop: 12, fontWeight: '700' }}>Documento pessoal</Text>
          <Image source={{ uri: student.documentoUri }} style={{ width: '100%', height: 180, borderRadius: 8, marginTop: 8 }} />
        </>
      ) : null}

      {student.certificadoUri ? (
        <>
          <Text style={{ marginTop: 12, fontWeight: '700' }}>Certificado</Text>
          <Image source={{ uri: student.certificadoUri }} style={{ width: '100%', height: 180, borderRadius: 8, marginTop: 8 }} />
        </>
      ) : null}

      {onDeliver && student.status === 'Pendente' ? (
        <View style={{ marginTop: 14 }}>
          <AppButton title="Marcar como Entregue" onPress={onDeliver} />
        </View>
      ) : null}
    </View>
  );
}