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

adminRoutes.get('/customers', requireRoles('ADMIN', 'EMPLOYEE'), listAdminCustomers);
adminRoutes.get('/tables', requireRoles('ADMIN', 'EMPLOYEE'), listAdminTables);
adminRoutes.post('/tables', requireRoles('ADMIN'), validateBody(tableCreateSchema, 'Datos de mesa inválidos.'), createAdminTable);
adminRoutes.patch('/tables/:id', requireRoles('ADMIN'), validateParams(tableIdParamsSchema, 'Identificador de mesa inválido.'), validateBody(tableUpdateSchema, 'Datos de mesa inválidos.'), updateAdminTable);
adminRoutes.delete('/tables/:id', requireRoles('ADMIN'), validateParams(tableIdParamsSchema, 'Identificador de mesa inválido.'), deleteAdminTable);

adminRoutes.get('/reservations', requireRoles('ADMIN', 'EMPLOYEE'), validateQuery(reservationQuerySchema, 'Filtros de reservas inválidos.'), listAdminReservations);
adminRoutes.post('/reservations', requireRoles('ADMIN'), validateBody(reservationCreateSchema, 'Datos de reserva inválidos.'), createAdminReservation);
adminRoutes.patch('/reservations/:id', requireRoles('ADMIN'), validateParams(reservationIdParamsSchema, 'Identificador de reserva inválido.'), validateBody(reservationUpdateSchema, 'Datos de reserva inválidos.'), updateAdminReservation);
adminRoutes.post('/reservations/:id/cancel', requireRoles('ADMIN'), validateParams(reservationIdParamsSchema, 'Identificador de reserva inválido.'), cancelReservation);
