import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { healthRoutes } from './routes/health.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { reservationRoutes } from './routes/reservation.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
export const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [env.FRONTEND_URL, ...(env.NODE_ENV === 'development' ? ['http://localhost:5173', 'http://localhost:5174'] : [])];
      callback(null, !origin || allowedOrigins.includes(origin) ? origin ?? true : false);
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' },
  }),
);

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorMiddleware);
