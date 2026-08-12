import { Router } from 'express';
import { currentUser, login, logout, register } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginSchema, registerSchema } from '../schemas/auth.schemas.js';

export const authRoutes = Router();

authRoutes.post('/register', validateBody(registerSchema, 'Datos de registro inválidos.'), register);
authRoutes.post('/login', validateBody(loginSchema, 'Datos de inicio de sesión inválidos.'), login);
authRoutes.get('/me', currentUser);
authRoutes.post('/logout', logout);
