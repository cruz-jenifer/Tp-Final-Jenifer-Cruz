import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as usuarioModel from '../models/usuarios.model';
import { JwtPayload, UserRole } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const register = async (email: string, password: string): Promise<number> => {
  const existingUser = await usuarioModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error('El usuario ya existe');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const userId = await usuarioModel.createUser({
    email,
    password: hashedPassword,
    role: UserRole.USER
  });

  return userId;
};

export const login = async (email: string, password: string): Promise<string> => {
  const user = await usuarioModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  return token;
};