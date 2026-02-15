export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole; 
}

export enum UserRole {
  CLIENTE = 'cliente', 
  VETERINARIO = 'veterinario', 
  ADMIN = 'admin' 
}