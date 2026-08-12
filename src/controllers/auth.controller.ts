import type { NextFunction, Request, Response } from 'express';
import { findUserById } from '../models/user.model.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schemas.js';
import { authenticateUser, registerCustomer } from '../services/auth.service.js';

const loginErrorMessage = 'Datos de inicio de sesión inválidos.';

function isUniqueEmailError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
}

export async function register(request: Request, response: Response, next: NextFunction) {
  const input = request.body as RegisterInput;
  try {
    const user = await registerCustomer(input);
    request.session.user = { id: user.id, role: user.role };
    response.status(201).json({ message: 'Usuario registrado correctamente.', user });
  } catch (error) {
    if (isUniqueEmailError(error)) {
      response.status(409).json({ message: 'El correo ya está registrado.' });
      return;
    }

    next(error);
  }
}

export async function login(request: Request, response: Response, next: NextFunction) {
  try {
    const input = request.body as LoginInput;
    const user = await authenticateUser(input);
    if (!user) {
      response.status(401).json({ message: loginErrorMessage });
      return;
    }
    request.session.user = { id: user.id, role: user.role };
    const publicUser = await findUserById(user.id);
    response.json({ message: 'Sesión iniciada correctamente.', user: publicUser });
  } catch (error) {
    next(error);
  }
}
export function logout(request: Request, response: Response) {
  request.session.destroy(() => response.json({ message: 'Sesión cerrada correctamente.' }));
}

export async function currentUser(request: Request, response: Response) {
  if (!request.session.user) {
    response.status(401).json({ message: 'No has iniciado sesión.' });
    return;
  }

  const user = await findUserById(request.session.user.id);

  if (!user) {
    request.session.destroy(() => undefined);
    response.status(401).json({ message: 'No has iniciado sesión.' });
    return;
  }

  response.json({ user });
}
