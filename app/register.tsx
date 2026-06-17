import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { registerUser } from '@/services/authService';
import { UserRole } from '@/types/user';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<UserRole>('aluno');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleRegister() {
    setErro('');

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);

      const user = await registerUser({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        role,
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso.');

      if (user.role === 'atendente') {
        router.replace('/attendant');
      } else {
        router.replace('/student-form');
      }
    } catch (error: any) {
  console.log('ERRO AO CADASTRAR:', error);

  const code = error?.code ?? 'sem código';
  const message = error?.message ?? 'sem mensagem';

  setErro(`${code} - ${message}`);
} finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        flex: 1,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 18, color: '#111827' }}>
          Criar conta
        </Text>

        <Text style={{ marginBottom: 6, fontWeight: '600', color: '#222' }}>Nome</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
          placeholderTextColor="#777"
          style={inputStyle}
        />

        <Text style={{ marginBottom: 6, fontWeight: '600', color: '#222' }}>E-mail</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Digite seu e-mail"
          placeholderTextColor="#777"
          style={inputStyle}
        />

        <Text style={{ marginBottom: 6, fontWeight: '600', color: '#222' }}>Senha</Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#777"
          style={inputStyle}
        />

        <Text style={{ fontWeight: '700', marginBottom: 8, color: '#111827' }}>
          Tipo de usuário
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
          <Pressable
            onPress={() => setRole('aluno')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor: role === 'aluno' ? '#2563eb' : '#e5e7eb',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: role === 'aluno' ? '#fff' : '#111', fontWeight: '700' }}>
              Aluno
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRole('atendente')}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor: role === 'atendente' ? '#2563eb' : '#e5e7eb',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: role === 'atendente' ? '#fff' : '#111', fontWeight: '700' }}>
              Atendente
            </Text>
          </Pressable>
        </View>

        {erro ? (
          <Text style={{ color: '#dc2626', marginBottom: 12, fontWeight: '600' }}>
            {erro}
          </Text>
        ) : null}

        <Pressable
          onPress={handleRegister}
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
            <Text style={{ color: '#fff', fontWeight: '700' }}>Cadastrar</Text>
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
          <Text style={{ color: '#111827', fontWeight: '700' }}>Voltar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#d0d5dd',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 12,
  backgroundColor: '#fff',
  color: '#111',
  marginBottom: 14,
};