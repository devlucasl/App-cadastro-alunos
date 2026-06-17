import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '@/config/firebase';
import { AppUser, UserRole } from '@/types/user';

type RegisterParams = {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
};

export async function registerUser({
  nome,
  email,
  senha,
  role,
}: RegisterParams): Promise<AppUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
  const firebaseUser = userCredential.user;

  const userData = {
    uid: firebaseUser.uid,
    nome,
    email,
    role,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);

  return {
    uid: firebaseUser.uid,
    nome,
    email,
    role,
    createdAt: new Date(),
  };
}

export async function loginUser(email: string, senha: string): Promise<AppUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, senha);
  const firebaseUser = userCredential.user;

  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (!userDoc.exists()) {
    throw new Error('Perfil do usuário não encontrado.');
  }

  const data = userDoc.data();

  return {
    uid: firebaseUser.uid,
    nome: String(data.nome),
    email: String(data.email),
    role: data.role as UserRole,
    createdAt: new Date(),
  };
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}