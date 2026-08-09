import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { healthRoutes } from './routes/health.routes.js';

export const app = express();

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
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
app.use(errorMiddleware);
