import { PDFViewer } from "@react-pdf/renderer";
import { toast, ToastContainer } from "react-toastify";
import PayslipGenerator from "./payslipGenerator";


const PayslipViewer = () => {
    toast.success('PDF Loaded successfully!!!')
    return (
        <>
            <ToastContainer position="top-center" />
            <PDFViewer style={{ width: '100%', height: '100vh' }}>
                <PayslipGenerator />
            </PDFViewer>
        </>
    );
}

export default PayslipViewer