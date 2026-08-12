import { Router } from 'express';
import { checkAvailability } from '../controllers/reservation.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { reservationInputSchema } from '../schemas/reservation.schemas.js';

export const reservationRoutes = Router();

reservationRoutes.post('/availability', validateBody(reservationInputSchema, 'Datos de reserva inválidos.'), checkAvailability);
