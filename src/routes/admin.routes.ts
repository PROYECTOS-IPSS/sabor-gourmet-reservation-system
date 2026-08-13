import { Router } from 'express';
import {
  cancelReservation,
  createAdminReservation,
  createAdminTable,
  deleteAdminTable,
  listAdminCustomers,
  listAdminReservations,
  listAdminTables,
  updateAdminReservation,
  updateAdminTable,
} from '../controllers/admin.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.middleware.js';
import {
  reservationCreateSchema,
  reservationIdParamsSchema,
  reservationQuerySchema,
  reservationUpdateSchema,
  tableCreateSchema,
  tableIdParamsSchema,
  tableUpdateSchema,
} from '../schemas/admin.schemas.js';

export const adminRoutes = Router();
adminRoutes.use(requireRoles('ADMIN'));

adminRoutes.get('/customers', listAdminCustomers);
adminRoutes.get('/tables', listAdminTables);
adminRoutes.post('/tables', validateBody(tableCreateSchema, 'Datos de mesa inválidos.'), createAdminTable);
adminRoutes.patch('/tables/:id', validateParams(tableIdParamsSchema, 'Identificador de mesa inválido.'), validateBody(tableUpdateSchema, 'Datos de mesa inválidos.'), updateAdminTable);
adminRoutes.delete('/tables/:id', validateParams(tableIdParamsSchema, 'Identificador de mesa inválido.'), deleteAdminTable);

adminRoutes.get('/reservations', validateQuery(reservationQuerySchema, 'Filtros de reservas inválidos.'), listAdminReservations);
adminRoutes.post('/reservations', validateBody(reservationCreateSchema, 'Datos de reserva inválidos.'), createAdminReservation);
adminRoutes.patch('/reservations/:id', validateParams(reservationIdParamsSchema, 'Identificador de reserva inválido.'), validateBody(reservationUpdateSchema, 'Datos de reserva inválidos.'), updateAdminReservation);
adminRoutes.post('/reservations/:id/cancel', validateParams(reservationIdParamsSchema, 'Identificador de reserva inválido.'), cancelReservation);
