export type UserRole = 'aluno' | 'atendente';

export type AppUser = {
  uid: string;
  nome: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};