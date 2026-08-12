import { z } from 'zod';

export const reservationInputSchema = z.object({
  date: z.string().date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(1),
});

export type ReservationInput = z.infer<typeof reservationInputSchema>;
