import type { Request, Response } from 'express';
import { findUserById } from '../models/user.model.js';

export async function dashboard(request: Request, response: Response) {
  const user = await findUserById(request.session.user!.id);

  if (!user) {
    response.status(401).json({ message: 'No has iniciado sesión.' });
    return;
  }

  response.json({ user });
}
