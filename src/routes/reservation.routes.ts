import { Router } from 'express';
import { cancelReservation, createReservation, checkAvailability, listMyReservations, updateReservation } from '../controllers/reservation.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';
import { validateBody, validateParams } from '../middleware/validate.middleware.js';
import { reservationIdParamsSchema, reservationInputSchema } from '../schemas/reservation.schemas.js';

export const reservationRoutes = Router();
reservationRoutes.get('/mine', requireRoles('CUSTOMER'), listMyReservations);

reservationRoutes.patch('/:id', requireRoles('CUSTOMER'), validateParams(reservationIdParamsSchema, 'Identificador de reserva inválido.'), validateBody(reservationInputSchema, 'Datos de reserva inválidos.'), updateReservation);
reservationRoutes.post('/:id/cancel', requireRoles('CUSTOMER'), validateParams(reservationIdParamsSchema, 'Identificador de reserva inválido.'), cancelReservation);
reservationRoutes.post('/availability', validateBody(reservationInputSchema, 'Datos de reserva inválidos.'), checkAvailability);
reservationRoutes.post('/', requireRoles('CUSTOMER'), validateBody(reservationInputSchema, 'Datos de reserva inválidos.'), createReservation);
