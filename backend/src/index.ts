import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { companyDetails, getEmployeeByEmail, getEmployeeDetails } from './Builder';
import allowCors from './common/cors';
import generateToken from './common/token';
import { verifyToken } from './common/handler';

dotenv.config();

const app = express();
app.use(express.json());
app.use(allowCors);

// app.post('/', allowCors, (req: Request, res: Response) => {
//     res.send('Server linked!');
// });


app.post('/generate-token', (req: Request, res: Response) => {
    // Generate the token with a secret key
    const token = generateToken();
    // Send the token in the response
    res.json({ token });
});

app.get('/api/employee-details', verifyToken, async (req: Request, res: Response) => {
    try {
        const data = await getEmployeeDetails();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching employee details');
    }
});

app.post('/api/get-employee-details-by-email', verifyToken, async (req: any, res: Response) => {
    
    try {
        const { selectedEmail } = req?.body;
        const data = await getEmployeeByEmail(selectedEmail);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching employee details by email');
    }
});

// Company Details Route
app.get('/api/company-details', verifyToken, async (req: Request, res: Response) => {
    try {
        const data = await companyDetails();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching company details');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
