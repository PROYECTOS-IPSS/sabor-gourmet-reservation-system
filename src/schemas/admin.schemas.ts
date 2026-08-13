import { z } from 'zod';

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato AAAA-MM-DD.');
const timeSchema = z.string().regex(/^(18|19|20|21):(00|30)$/, 'La hora debe ser un intervalo válido de 30 minutos.');
const idSchema = z.coerce.number().int().positive();

const tableFields = {
  number: z.coerce.number().int().min(1, 'El número de mesa debe ser positivo.'),
  capacity: z.coerce.number().int().min(1, 'La capacidad debe ser de al menos una persona.'),
  isActive: z.boolean().optional(),
};

export const tableIdParamsSchema = z.object({ id: idSchema });
export const tableCreateSchema = z.object({
  number: tableFields.number,
  capacity: tableFields.capacity,
  isActive: tableFields.isActive.default(true),
});
export const tableUpdateSchema = z
  .object(tableFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo para actualizar.');

export const reservationIdParamsSchema = z.object({ id: idSchema });
export const reservationQuerySchema = z.object({
  date: dateSchema.optional(),
  status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
});

const reservationFields = {
  userId: idSchema,
  date: dateSchema,
  startTime: timeSchema,
  guests: z.coerce.number().int().min(1, 'La reserva debe tener al menos un comensal.'),
};

export const reservationCreateSchema = z.object(reservationFields);
export const reservationUpdateSchema = z
  .object(reservationFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo para actualizar.');

export type TableCreateInput = z.infer<typeof tableCreateSchema>;
export type TableUpdateInput = z.infer<typeof tableUpdateSchema>;
export type ReservationQuery = z.infer<typeof reservationQuerySchema>;
export type ReservationCreateInput = z.infer<typeof reservationCreateSchema>;
export type ReservationUpdateInput = z.infer<typeof reservationUpdateSchema>;
