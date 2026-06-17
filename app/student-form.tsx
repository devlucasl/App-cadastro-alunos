import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { auth } from '@/config/firebase';
import { createStudent, listenStudentByUserId } from '@/services/studentService';
import { Student } from '@/types/student';

export default function StudentFormScreen() {
  const [existingStudent, setExistingStudent] = useState<Student | null>(null);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email ?? '');
  const [telefone, setTelefone] = useState('');
  const [curso, setCurso] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      router.replace('/login');
      return;
    }

    const unsubscribe = listenStudentByUserId(userId, student => {
      setExistingStudent(student);

      if (student) {
        setNomeCompleto(student.nomeCompleto);
        setCpf(student.cpf);
        setDataNascimento(student.dataNascimento);
        setEmail(student.email);
        setTelefone(student.telefone);
        setCurso(student.curso);
      }
    });

    return unsubscribe;
  }, []);

  async function handleSave() {
    setErro('');

    const userId = auth.currentUser?.uid;

    if (!userId) {
      router.replace('/login');
      return;
    }

    if (
      !nomeCompleto.trim() ||
      !cpf.trim() ||
      !dataNascimento.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !curso.trim()
    ) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (existingStudent?.id) {
      router.push('/documents');
      return;
    }

    try {
      setLoading(true);

      await createStudent({
        userId,
        nomeCompleto: nomeCompleto.trim(),
        cpf: cpf.trim(),
        dataNascimento: dataNascimento.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        curso: curso.trim(),
        status: 'Pendente',
      });

      Alert.alert('Sucesso', 'Cadastro salvo com sucesso.');
      router.push('/documents');
    } catch (error: any) {
      console.log('ERRO AO SALVAR ALUNO:', error);
      setErro(`${error?.code ?? 'erro'} - ${error?.message ?? 'Não foi possível salvar o cadastro.'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#f3f4f6' }}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 8, color: '#111827' }}>
          Cadastro do Aluno
        </Text>

        <Text style={{ color: '#555', marginBottom: 18 }}>
          Preencha seus dados para iniciar a análise dos documentos.
        </Text>

        <View
          style={{
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}
        >
          <Field label="Nome completo" value={nomeCompleto} onChangeText={setNomeCompleto} />
          <Field label="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
          <Field
            label="Data de nascimento"
            value={dataNascimento}
            onChangeText={setDataNascimento}
            placeholder="dd/mm/aaaa"
          />
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Field label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <Field label="Curso escolhido" value={curso} onChangeText={setCurso} />

          {existingStudent ? (
            <Text style={{ color: '#2563eb', marginBottom: 12, fontWeight: '700' }}>
              Cadastro já salvo. Você pode seguir para documentos.
            </Text>
          ) : null}

          {erro ? (
            <Text style={{ color: '#dc2626', marginBottom: 12, fontWeight: '600' }}>
              {erro}
            </Text>
          ) : null}

          <Pressable
            onPress={handleSave}
            disabled={loading}
            style={{
              backgroundColor: '#2563eb',
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: 'center',
              marginBottom: 12,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontWeight: '700' }}>
                {existingStudent ? 'Ir para documentos' : 'Salvar cadastro'}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.replace('/login')}
            style={{
              backgroundColor: '#e5e7eb',
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#111827', fontWeight: '700' }}>
              Sair
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: FieldProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ marginBottom: 6, fontWeight: '600', color: '#222' }}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#777"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={{
          borderWidth: 1,
          borderColor: '#d0d5dd',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          backgroundColor: '#fff',
          color: '#111',
        }}
      />
    </View>
  );
}