import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '../types/api.types';
import { AppError } from '../types/enums';

export const errorMiddleware = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'ERROR INTERNO DEL SERVIDOR';
  let errorCode = undefined;

  // CASO ERROR CONOCIDO (CLASE ERROR O APP ERROR)
  if (error instanceof Error) {
    const err = error as AppError;
    const msg = err.message;

    // RECURSO DUPLICADO
    if (msg === 'EL USUARIO YA EXISTE' || msg.includes('Duplicate entry')) {
      statusCode = 409;
      message = 'EL USUARIO O RECURSO YA EXISTE';
      errorCode = 'DUPLICATE_ENTRY';
    }

    // ERRORES DE AUTENTICACION
    else if (msg === 'CREDENCIALES INVALIDAS' || msg === 'NO AUTORIZADO') {
      statusCode = 401;
      message = 'ACCESO DENEGADO';
      errorCode = 'UNAUTHORIZED';
    }

    // TOKEN EXPIRADO
    else if (msg.includes('jwt expired')) {
      statusCode = 403;
      message = 'SESION EXPIRADA';
      errorCode = 'TOKEN_EXPIRED';
    }

    // ERROR VALIDACION
    else if (msg === 'DATOS INVALIDOS') {
      statusCode = 400;
      message = 'DATOS DE ENTRADA INVALIDOS';
      errorCode = 'BAD_REQUEST';
    }

    // ERROR PERSISTENCIA O ESTADO ESPECIFICO (DESDE APP ERROR)
    if (err.statusCode) {
      statusCode = err.statusCode;
    }
  }

  const response: ApiErrorResponse = {
    success: false,
    message,
    error_code: errorCode
  };

  // SOLO LOGUEAR ERRORES CRÍTICOS (500) EN DESARROLLO
  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('❌ STACK TRACE:', error);
  }

  return res.status(statusCode).json(response);
};