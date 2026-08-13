import type { NextFunction, Request, Response } from 'express';
import {
  addReservation,
  addTable,
  AdminServiceError,
  cancelAdminReservation,
  editReservation,
  editTable,
  getReservations,
  getTables,
  listCustomers,
  removeTable,
} from '../services/admin.service.js';
import type {
  ReservationCreateInput,
  ReservationQuery,
  ReservationUpdateInput,
  TableCreateInput,
  TableUpdateInput,
} from '../schemas/admin.schemas.js';

function handleError(error: unknown, response: Response, next: NextFunction) {
  if (error instanceof AdminServiceError) {
    response.status(error.status).json({ message: error.message });
    return;
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    if (error.code === 'P2002') {
      response.status(409).json({ message: 'Ya existe un registro con esos datos.' });
      return;
    }
    if (error.code === 'P2025') {
      response.status(404).json({ message: 'El registro solicitado no existe.' });
      return;
    }
  }

  next(error);
}

export async function listAdminTables(_request: Request, response: Response, next: NextFunction) {
  try {
    response.json({ tables: await getTables() });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function createAdminTable(request: Request, response: Response, next: NextFunction) {
  try {
    response.status(201).json({ table: await addTable(request.body as TableCreateInput) });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function updateAdminTable(request: Request, response: Response, next: NextFunction) {
  try {
    response.json({ table: await editTable(request.params.id as unknown as number, request.body as TableUpdateInput) });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function deleteAdminTable(request: Request, response: Response, next: NextFunction) {
  try {
    response.json({ table: await removeTable(request.params.id as unknown as number), message: 'Mesa desactivada correctamente.' });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function listAdminCustomers(_request: Request, response: Response, next: NextFunction) {
  try {
    response.json({ customers: await listCustomers() });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function listAdminReservations(request: Request, response: Response, next: NextFunction) {
  try {
    response.json({ reservations: await getReservations(request.query as unknown as ReservationQuery) });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function createAdminReservation(request: Request, response: Response, next: NextFunction) {
  try {
    response.status(201).json({ reservation: await addReservation(request.body as ReservationCreateInput) });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function updateAdminReservation(request: Request, response: Response, next: NextFunction) {
  try {
    response.json({ reservation: await editReservation(request.params.id as unknown as number, request.body as ReservationUpdateInput) });
  } catch (error) {
    handleError(error, response, next);
  }
}

export async function cancelReservation(request: Request, response: Response, next: NextFunction) {
  try {
    response.json({ message: 'Reserva cancelada correctamente.', reservation: await cancelAdminReservation(request.params.id as unknown as number) });
  } catch (error) {
    handleError(error, response, next);
  }
}
