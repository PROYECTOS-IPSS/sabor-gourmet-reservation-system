import { z } from 'zod';

export const reservationInputSchema = z.object({
  date: z.string().date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(1),
  tableNumber: z.coerce.number().int().positive().optional(),
});

export const reservationIdParamsSchema = z.object({ id: z.coerce.number().int().positive() });

export type ReservationInput = z.infer<typeof reservationInputSchema>;
