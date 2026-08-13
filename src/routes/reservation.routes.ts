import { Router } from 'express';
import { cancelReservation, createReservation, checkAvailability, listMyReservations, updateReservation } from '../controllers/reservation.controller.js';
import { requireSession } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { reservationInputSchema } from '../schemas/reservation.schemas.js';

export const reservationRoutes = Router();
reservationRoutes.get('/mine', requireSession, listMyReservations);

reservationRoutes.patch('/:id', requireSession, validateBody(reservationInputSchema, 'Datos de reserva inválidos.'), updateReservation);
reservationRoutes.post('/:id/cancel', requireSession, cancelReservation);
reservationRoutes.post('/availability', validateBody(reservationInputSchema, 'Datos de reserva inválidos.'), checkAvailability);
reservationRoutes.post('/', requireSession, validateBody(reservationInputSchema, 'Datos de reserva inválidos.'), createReservation);
