import * as repo from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const register = async ({ username, password, role }: any) => {
  const exists = await repo.findByUsername(username);
  if (exists) throw new Error('Usuario ya existe');
  const hash = await bcrypt.hash(password, 10);
  const user = await repo.create({ username, password: hash, role });
  return user;
};

export const login = async ({ username, password }: any) => {
  const user = await repo.findByUsername(username);
  if (!user) throw new Error('Credenciales inválidas');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Credenciales inválidas');
  const token = jwt.sign({ id: user.id, username: user.username }, config.JWT_SECRET, { expiresIn: '8h' });
  return { token, role: user.role };
};
