// handler.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1]; // Retrieve token from Bearer header

    if (!token) {
        res.status(403).send('Token is required for authentication');
        return;
    }

    try {
        const decoded = jwt.verify(token, 'your_secret_key'); // Verify the token
        (req as any).user = decoded; // Attach decoded data to request
        next(); // Call next() to proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).send('Invalid token');
    }
};
