import { db } from '@/config/firebase';
import { Student } from '@/types/student';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

type CreateStudentParams = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;

export async function createStudent(student: CreateStudentParams): Promise<string> {
  const docRef = await addDoc(collection(db, 'students'), {
    ...student,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export function listenStudents(callback: (students: Student[]) => void): () => void {
  const studentsQuery = query(collection(db, 'students'), orderBy('createdAt', 'desc'));

  return onSnapshot(studentsQuery, snapshot => {
    const students = snapshot.docs.map(item => {
      const data = item.data();

      return {
        id: item.id,
        userId: String(data.userId),
        nomeCompleto: String(data.nomeCompleto),
        cpf: String(data.cpf),
        dataNascimento: String(data.dataNascimento),
        email: String(data.email),
        telefone: String(data.telefone),
        curso: String(data.curso),
        status: data.status,
        documentoUri: data.documentoUri,
        certificadoUri: data.certificadoUri,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Student;
    });

    callback(students);
  });
}

export function listenStudentByUserId(userId: string, callback: (student: Student | null) => void): () => void {
  const studentsQuery = query(collection(db, 'students'), where('userId', '==', userId));

  return onSnapshot(studentsQuery, snapshot => {
    if (snapshot.empty) {
      callback(null);
      return;
    }

    const item = snapshot.docs[0];
    const data = item.data();

    callback({
      id: item.id,
      userId: String(data.userId),
      nomeCompleto: String(data.nomeCompleto),
      cpf: String(data.cpf),
      dataNascimento: String(data.dataNascimento),
      email: String(data.email),
      telefone: String(data.telefone),
      curso: String(data.curso),
      status: data.status,
      documentoUri: data.documentoUri,
      certificadoUri: data.certificadoUri,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Student);
  });
}

export async function updateStudentDocuments(
  studentId: string,
  documentoUri: string,
  certificadoUri: string
): Promise<void> {
  await updateDoc(doc(db, 'students', studentId), {
    documentoUri,
    certificadoUri,
    updatedAt: serverTimestamp(),
  });
}

export async function markStudentAsDelivered(studentId: string): Promise<void> {
  await updateDoc(doc(db, 'students', studentId), {
    status: 'Entregue',
    updatedAt: serverTimestamp(),
  });
}