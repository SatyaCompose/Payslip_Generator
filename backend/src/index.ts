import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { companyDetails, getEmployeeByEmail, getEmployeeDetails } from './Builder';
import allowCors from './common/cors';
import generateToken from './common/token';
import { verifyToken } from './common/handler';
import multer from 'multer';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(express.json());
app.use(allowCors);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/generate-token', allowCors, (req: Request, res: Response) => {
    const token = generateToken();
    res.json({ token });
});

app.get('/api/employee-details', allowCors, verifyToken, async (req: Request, res: Response) => {
    try {
        const data = await getEmployeeDetails();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching employee details');
    }
});

app.post('/api/get-employee-details-by-email', allowCors, verifyToken, async (req: any, res: Response) => {
    try {
        const { selectedEmail } = req.body;
        const data = await getEmployeeByEmail(selectedEmail);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching employee details by email');
    }
});

app.get('/api/company-details', allowCors, verifyToken, async (req: Request, res: Response) => {
    try {
        const data = await companyDetails();
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching company details');
    }
});

app.post('/api/email-sender', verifyToken, upload.single('pdf'), async (req: Request, res: Response) => {
    try {
        const { reciepentEmail, emailBody, emailSubject, fileName } = req.body
        if (req.file) {
            const pdfBuffer = req.file.buffer;

            const transporter = nodemailer.createTransport({
                service: 'gmail', 
                auth: {
                    user: process.env.EMAIL_USER,  
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: reciepentEmail,
                subject: emailSubject,
                text: emailBody,
                attachments: [
                    {
                        filename: `${fileName}.pdf`,
                        content: pdfBuffer, 
                        encoding: 'base64', 
                    },
                ],
            };

            await transporter.sendMail(mailOptions);
            res.status(200).send('PDF received and emailed successfully!');
        } else {
            res.status(400).send('No file uploaded!');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending Email...!');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
