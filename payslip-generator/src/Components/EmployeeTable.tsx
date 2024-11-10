import React, { useState, useEffect } from "react";
import { fetchCompanyDetails, fetchEmployeeByEmail, fetchEmployeeDetails, sendEmail } from "../services";
import { toast, ToastContainer } from "react-toastify";
import '../Styles/EmployeeTable.css'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import PayslipGenerator from "./payslipGenerator";
import { pdf } from "@react-pdf/renderer";
import { emailBody } from "../common/constant";

const EmployeeTable = () => {
    const navigate = useNavigate();
    const [employeeDetails, setEmployeeDetails] = useState<any>(null);
    const [employee, setEmployee] = useState<any>({});
    const [company, setCompanyData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() - 1;
    const year = currentDate.getFullYear();
    const prevMonth = currentMonth < 0 ? 11 : currentMonth;

    const getShortMonth = (monthIndex: number) => {
        const date = new Date(2222, monthIndex); // Year doesn't matter, only month
        return date.toLocaleString('en-US', { month: 'short' });
    };

    const shortMonth = getShortMonth(prevMonth);

    const handleEmailSender = async (email: string) => {
        localStorage.setItem('selectedEmployeeEmail', email);
    }

    const handlePreviewClick = (email: string) => {
        localStorage.setItem('selectedEmployeeEmail', email);
        navigate("/payslip-preview");
    };

    useEffect(() => {
        const getEmployeeDetails = async () => {
            try {
                const data = await fetchEmployeeDetails();
                if (data.status === 200) {
                    toast.success('Employee details fetched successfully')
                    setEmployeeDetails(data.data.map((data: any) => data.data));
                } else {
                    toast.error('Something went wrong during fetching Employee details')
                }
                setLoading(false);
            } catch (err) {
                toast.error('Error fetching employee details');
                setLoading(false);
            }
        };

        getEmployeeDetails();
    }, []);

    const selectedEmail = localStorage.getItem('selectedEmployeeEmail')
    useEffect(() => {
        const fetchemployee = async () => {
            try {
                const data = await fetchEmployeeByEmail();
                setEmployee(data.data)
            } catch (err: any) {
                toast.error('Error fetching employee data...!')
            }
        }
        const fetchCompany = async () => {
            try {
                const data = await fetchCompanyDetails();
                setCompanyData(data.data)
            } catch (err: any) {
                toast.error('Error fetching salary data...!')
            }
        }
        fetchemployee();
        fetchCompany();
    }, [selectedEmail]);

    const handleSendPDF = async () => {
        try {
            const body = await emailBody(employee, shortMonth, year)
            const name = employee.employeeName.split(' ')[0]
            const blob = await pdf(<PayslipGenerator employee={employee} company={company} />).toBlob();
            if (blob && blob.type !== 'application/pdf') {
                toast.error('Generated file is not a valid PDF');
            }

            const email = localStorage.getItem('selectedEmployeeEmail');
            const formData = new FormData();
            formData.append("pdf", blob, `${shortMonth}-${name}.pdf`);
            formData.append('reciepentEmail', `${email}`);
            formData.append('emailBody', `${body}`)
            formData.append('emailSubject', `${shortMonth} ${year} Payslip`)
            formData.append('fileName', `${shortMonth}-${name}`)

            await sendEmail(formData)
        } catch (error) {
            toast.error("Error sending PDF!");
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show loading message while fetching
    }

    return (
        <>
            <ToastContainer position="top-center" />
            <div style={{
                padding: 50,
                fontFamily: 'sans-serif',
                fontSize: 20
            }}>
                <h2 style={{
                    textAlign: 'center',
                    fontSize: 45
                }}>
                    Employee Details
                </h2>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: 20,
                }}>
                    <thead>
                        <tr>
                            <th>Employee Number</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Department</th>
                            <th>Salary Info</th>
                            <th>Show Preview </th>
                            <th>Email Sender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeDetails?.map((employee: any) => (
                            <tr key={employee.employeeNumber}>
                                <td>{employee.employeeNumber}</td>
                                <td>{employee.email}</td>
                                <td>{employee.employeeName}</td>
                                <td>{employee.designation}</td>
                                <td>{employee.department}</td>
                                <td>{employee.salaryInfo}</td>
                                <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <button onClick={() => handlePreviewClick(employee.email)}>Show Preview</button>
                                </td>
                                <td>
                                    <button onClick={() => {
                                        handleEmailSender(employee.email);
                                        handleSendPDF();
                                    }}>Send Payslip Email</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </>
    );
};

export default EmployeeTable;
