import { Router } from 'express';
import { dashboard } from '../controllers/dashboard.controller.js';
import { requireRoles } from '../middleware/auth.middleware.js';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', requireRoles('ADMIN'), dashboard);
