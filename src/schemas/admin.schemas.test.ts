import { describe, expect, it } from 'vitest';
import { reservationCreateSchema, tableCreateSchema, tableUpdateSchema } from './admin.schemas.js';

describe('admin schemas', () => {
  it('accepts a valid table payload', () => {
    expect(tableCreateSchema.safeParse({ capacity: 4, isActive: true, number: 12 }).success).toBe(true);
  });

  it('rejects a table with zero capacity', () => {
    expect(tableCreateSchema.safeParse({ capacity: 0, isActive: true, number: 12 }).success).toBe(false);
  });

  it('requires at least one field when editing a table', () => {
    expect(tableUpdateSchema.safeParse({}).success).toBe(false);
  });

  it('accepts reservation slots from the restaurant schedule', () => {
    expect(reservationCreateSchema.safeParse({ date: '2026-08-19', guests: 2, startTime: '19:30', userId: 1 }).success).toBe(true);
  });

  it('rejects malformed reservation dates and times', () => {
    expect(reservationCreateSchema.safeParse({ date: '19/08/2026', guests: 2, startTime: '22:00', userId: 1 }).success).toBe(false);
  });
});
