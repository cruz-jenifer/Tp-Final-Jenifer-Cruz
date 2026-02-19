import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = unknown> {
    success: true;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    error_code?: string;
}

export type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
