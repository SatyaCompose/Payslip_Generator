import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(403).send('Token is required for authentication');
        return;
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        (req as any).user = decoded;
        next(); 
    } catch (error) {
        res.status(401).send('Invalid token');
    }
};
