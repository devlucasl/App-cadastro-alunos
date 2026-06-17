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

import { loginUser } from '@/services/authService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleLogin() {
    setErro('');
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser(email.trim(), senha);

      if (user.role === 'atendente') {
        router.replace('/attendant');
      } else {
        router.replace('/student-form');
      }
    } catch (error: any) {
  console.log('ERRO AO ENTRAR:', error);

  if (error?.code === 'auth/invalid-credential') {
    setErro('E-mail ou senha inválidos.');
  } else if (error?.code === 'auth/user-not-found') {
    setErro('Usuário não encontrado.');
  } else if (error?.code === 'auth/wrong-password') {
    setErro('Senha incorreta.');
  } else {
    setErro(`${error?.code ?? 'erro'} - Não foi possível entrar.`);
  }
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
        <Text style={{ fontSize: 26, fontWeight: '800', marginBottom: 6, color: '#111827' }}>
          Cadastro de Alunos
        </Text>

        <Text style={{ color: '#555', marginBottom: 22 }}>
          Entre para continuar.
        </Text>

        <Text style={{ marginBottom: 6, fontWeight: '600', color: '#222' }}>
          E-mail
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Digite seu e-mail"
          placeholderTextColor="#777"
          style={{
            borderWidth: 1,
            borderColor: '#d0d5dd',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: '#fff',
            color: '#111',
            marginBottom: 14,
          }}
        />

        <Text style={{ marginBottom: 6, fontWeight: '600', color: '#222' }}>
          Senha
        </Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Digite sua senha"
          placeholderTextColor="#777"
          style={{
            borderWidth: 1,
            borderColor: '#d0d5dd',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            backgroundColor: '#fff',
            color: '#111',
            marginBottom: 18,
          }}
        />

        {erro ? (
  <Text style={{ color: '#dc2626', marginBottom: 12, fontWeight: '600' }}>
    {erro}
  </Text>
) : null}

        <Pressable
          onPress={handleLogin}
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
            <Text style={{ color: '#fff', fontWeight: '700' }}>Entrar</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.push('/register')}
          style={{
            backgroundColor: '#e5e7eb',
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#111827', fontWeight: '700' }}>
            Criar conta
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}