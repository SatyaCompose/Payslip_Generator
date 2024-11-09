import jwt from 'jsonwebtoken'
export default function verifyToken(token: string) {
    jwt.verify(token, 'your_secret_key', (err: any, decoded: any) => {
        if (err) {
            return 'invalid token';
        }
        return `${decoded}`
    });
}