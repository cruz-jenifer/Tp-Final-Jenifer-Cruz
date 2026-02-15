import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', error.message || error);

  // Errores de usuario/recursos existentes
  if (error.message === 'El usuario ya existe' || error.message?.includes('Duplicate entry')) {
    return res.status(409).json({ message: 'El usuario o recurso ya existe.' });
  }
  
  // Errores de autenticación/autorización
  if (error.message === 'Credenciales inválidas' || error.message === 'No autorizado') {
    return res.status(401).json({ message: 'Acceso denegado. Verifique sus credenciales.' });
  }

  // Errores de JWT
  if (error.message?.includes('jwt expired')) {
    return res.status(403).json({ message: 'Su sesión ha expirado. Por favor inicie sesión nuevamente.' });
  }

  // Manejo opcional de errores específicos adicionales
  if (error.message === 'El usuario ya existe') {
    return res.status(409).json({ message: error.message });
  }
  
  if (error.message === 'Credenciales inválidas') {
    return res.status(401).json({ message: error.message });
  }

  // Error genérico (Fail-safe) con información de depuración en desarrollo
  return res.status(500).json({ 
    message: 'Ocurrió un error interno en el servidor.',
    ...(process.env.NODE_ENV === 'development' && { 
      error: error.message,
      stack: error.stack 
    })
  });
};