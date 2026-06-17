import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBU9NVV9RdmChILTqbGsCfxyPyDEqgSyMI",
  authDomain: "app-cadastro-alunos.firebaseapp.com",
  projectId: "app-cadastro-alunos",
  storageBucket: "app-cadastro-alunos.firebasestorage.app",
  messagingSenderId: "324225590156",
  appId: "1:324225590156:web:d36feef81c9f4f4fdeaca9",
  measurementId: "G-D2WKZYQHFY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;