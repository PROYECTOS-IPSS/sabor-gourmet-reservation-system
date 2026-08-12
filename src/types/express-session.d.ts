import type { UserRole } from '../generated/prisma/enums.js';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      role: UserRole;
    };
  }
}
