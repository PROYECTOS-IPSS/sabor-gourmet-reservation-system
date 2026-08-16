import { describe, expect, it } from 'vitest';
import { reservationIdParamsSchema, reservationInputSchema } from './reservation.schemas.js';

describe('reservation schemas', () => {
  it('accepts customer reservation input without a selected table', () => {
    expect(reservationInputSchema.safeParse({ date: '2026-08-30', guests: 2, startTime: '18:00' }).success).toBe(true);
  });

  it('rejects invalid reservation ids', () => {
    expect(reservationIdParamsSchema.safeParse({ id: 'abc' }).success).toBe(false);
    expect(reservationIdParamsSchema.safeParse({ id: '12' }).success).toBe(true);
  });
});
