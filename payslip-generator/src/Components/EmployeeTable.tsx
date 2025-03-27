import React, { useState, useEffect } from "react";
import { fetchCompanyDetails, fetchEmployeeDetails, sendEmail } from "../services";
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
    const [company, setCompany] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    const currentDate = new Date();
    const currentMonth = 1 - 1;
    const currentYear = currentDate.getFullYear()
    const prevMonth = currentMonth < 0 ? 11 : currentMonth;
    const year = prevMonth === 11 ? currentYear - 1 : currentYear;

    const getShortMonth = (monthIndex: number) => {
        const date = new Date(2222, monthIndex); // Year doesn't matter, only month
        return date.toLocaleString('en-US', { month: 'short' });
    };

    const shortMonth = getShortMonth(prevMonth);

    const handleEmailSender = async (email: string) => {
        localStorage.setItem('selectedEmployeeEmail', email);
        navigate("/email-sender")
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate('/')
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

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const data = await fetchCompanyDetails();
                setCompany(data.data)
            } catch (err: any) {
                toast.error('Error fetching salary data...!')
            }
        }
        fetchCompany();
    }, []);

    const handleSendPDF = async (selectedEmployee: any) => {
        try {
            const body = await emailBody(selectedEmployee, shortMonth, year);
            const name = selectedEmployee?.employeeName.split(' ')[0];
            const blob = await pdf(<PayslipGenerator employee={selectedEmployee} company={company} />).toBlob();

            const formData = new FormData();
            formData.append("pdf", blob, `${shortMonth}-${name}.pdf`);
            formData.append('reciepentEmail', `${selectedEmployee?.email}`);
            formData.append('emailBody', body);
            formData.append('emailSubject', `${shortMonth} ${year} Payslip`);
            formData.append('fileName', `${shortMonth}-${name}`);

            await sendEmail(formData);
        } catch (error) {
            toast.error("Error sending PDF!");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
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
                    fontSize: 45,
                    padding: 0
                }}>
                    Employee Details
                </h2>
                <table style={{
                    width: '90%',
                    borderCollapse: 'collapse',
                    margin: "20px auto",
                }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: "center" }}>Employee Number</th>
                            <th style={{ textAlign: "center" }}>Email</th>
                            <th style={{ textAlign: "center" }}>Name</th>
                            <th style={{ textAlign: "center" }}>Designation</th>
                            <th style={{ textAlign: "center" }}>Department</th>
                            <th style={{ textAlign: "center" }}>Salary Info</th>
                            <th style={{ textAlign: "center" }}>Show Preview </th>
                            <th style={{ textAlign: "center" }}>Email Sender</th>
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
                                <td>
                                    <button style={{ margin: 0 }} onClick={() => handlePreviewClick(employee.email)}>Show Preview</button>
                                </td>
                                <td>
                                    <button style={{ margin: 0 }} onClick={async () => {
                                        await handleEmailSender(employee.email);
                                        await handleSendPDF(employee);
                                    }}>Send Email</button>
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
