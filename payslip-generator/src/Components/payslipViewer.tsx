import { PDFViewer } from "@react-pdf/renderer";
import { toast, ToastContainer } from "react-toastify";
import PayslipGenerator from "./payslipGenerator";
import { fetchCompanyDetails, fetchEmployeeByEmail } from "../services";
import { useEffect, useState } from "react";

const PayslipViewer = () => {
    const [employee, setEmployee] = useState<any>({});
    const [company, setCompanyData] = useState<any>({});

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
    }, []);
    toast.success('PDF Loaded successfully!!!')
    return (
        <>
            <ToastContainer position="top-center" />
            <PDFViewer style={{ width: '100%', height: '100vh' }}>
                <PayslipGenerator employee={employee} company={company} />
            </PDFViewer>
        </>
    );
}

export default PayslipViewer