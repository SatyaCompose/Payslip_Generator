import jwt from 'jsonwebtoken';

export default function generateToken() {
    const token = jwt.sign({ id: '12345', role: 'Guest' }, 'your_secret_key', { expiresIn: '1h' });
    return token;
}