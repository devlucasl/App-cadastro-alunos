export type StudentStatus = 'Pendente' | 'Entregue';

export type Student = {
  id?: string;
  userId: string;
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  curso: string;
  status: StudentStatus;
  documentoUri?: string;
  certificadoUri?: string;
  createdAt: Date;
  updatedAt?: Date;
};