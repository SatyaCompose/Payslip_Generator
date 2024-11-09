import React, { useState, useEffect } from "react";
import { fetchEmployeeDetails } from "../services";
import { toast, ToastContainer } from "react-toastify";
import '../Styles/EmployeeTable.css'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const EmployeeTable = () => {
    const navigate = useNavigate();
    const [employeeDetails, setEmployeeDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
    if (loading) {
        return <div>Loading...</div>; // Show loading message while fetching
    }

    const handlePreviewClick = (email: string) => {
        localStorage.setItem('selectedEmployeeEmail', email);
        navigate("/payslip-preview");
    };

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
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </>
    );
};

export default EmployeeTable;
