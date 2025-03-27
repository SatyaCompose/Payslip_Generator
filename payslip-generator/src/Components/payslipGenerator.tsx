import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../assets/logo.png'
import { belowTwenty, months, tens, thousands } from "../common/constant";
import 'react-toastify/dist/ReactToastify.css';

const styles = StyleSheet.create({
    page: { padding: 70, },
    section: { flexGrow: 1, color: '#566573' },
    container: { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingBottom: 20 },
    leftContainer: { width: '23%', justifyContent: "flex-start" },
    image: { width: 137 },
    rightContainer: { width: '70%', textAlign: 'center' },
    header: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: 'black', paddingBottom: 30, },
    table: { width: '100%', alignSelf: "center", fontSize: 12, borderCollapse: 'collapse', paddingBottom: 30 },
    tableRow: { flexDirection: 'row' },
    tableCell: { flex: 1, textAlign: 'left', paddingTop: 5, paddingBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis' },
    tableHeader: { fontWeight: 'bold', borderBottom: '1px solid #000', color: 'white', padding: '5px', textAlign: 'center', },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { fontSize: 10 },
    value: { fontSize: 10, fontWeight: 'bold' },
    tableCellAmount: { flex: 1, fontSize: 10, textAlign: 'right' },
    tableTitle: { fontSize: 12, fontWeight: 'bold', marginVertical: 8, textDecoration: 'underline' },
});
interface PayslipGeneratorProps {
    employee: any;
    company: any;
}
const PayslipGenerator: React.FC<PayslipGeneratorProps> = ({ employee, company }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() - 1;
    const currentYear = currentDate.getFullYear();
    const payslipMonth: number = 0;
    // Adjust the year if the payslip is for December but generated in January
    const year = currentMonth === -1 && payslipMonth === 11 ? currentYear - 1 : currentYear;
    // Get the name of the month
    const month = months[payslipMonth];

    const { attendence, bank, bankAcNumber, dateOfJoining, department, designation, employeeName, employeeNumber, ifscCode, salaryInfo } = employee;
    const { companyName, companyAddress } = company;
    const totalAmount = Number(salaryInfo) + 200;

    function divideAmount(totalAmount: any) {
        const minRentalAllowance = 5000;
        let specialAllowance = 3000 ;
        const remainingAmount = totalAmount - minRentalAllowance;

        const amount = Math.round(remainingAmount / specialAllowance);
        if (remainingAmount > 15000) {
            if (amount < 10) {
                specialAllowance = 5000;
            } else if (amount < 16) {
                specialAllowance = 10000;
            } else {
                specialAllowance = 20000;
            }
        }

        return {
            basic: remainingAmount - specialAllowance,
            rentalAllowance: minRentalAllowance,
            specialAllowance: specialAllowance,
            totalAmount: minRentalAllowance + specialAllowance + (remainingAmount - specialAllowance),
        };
    }
    const allowances = divideAmount(totalAmount);

    function numberToWords(num: number): string {
        if (num === 0) return belowTwenty[0];
        let words: string[] = [];
        let partIndex = 0;
        while (num > 0) {
            if (num % 1000 !== 0) {
                let partWords = convertHundreds(num % 1000);
                if (thousands[partIndex]) {
                    partWords += ' ' + thousands[partIndex];
                }
                words.unshift(partWords);
            }
            num = Math.floor(num / 1000);
            partIndex++;
        }
        return words.join(' ').trim();

        function convertHundreds(num: number): string {
            let str = '';
            if (num >= 100) {
                str += belowTwenty[Math.floor(num / 100)] + ' Hundred ';
                num %= 100;
            }
            if (num >= 20) {
                str += tens[Math.floor(num / 10)] + ' ';
                num %= 10;
            }
            if (num > 0) {
                str += belowTwenty[num] + ' ';
            }
            return str.trim();
        }
    }

    return (
        < Document >
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.section}>
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <Image src={logo} />
                    </View>
                    <View style={styles.rightContainer}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'black',
                        }}>{companyName}</Text>
                        <Text style={{
                            fontSize: 11,
                            textAlign: 'center',
                            color: 'black',
                        }}>{companyAddress}</Text>
                    </View>
                </View>
                <Text style={styles.header}>Payslip for {month} {year}</Text>
                {/* <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: 'bold', marginBottom: 15 }}>
                        Net Salary: {salaryDetails.netSalary}
                    </Text> */}

                {/* Employee Details */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Employee Number</Text>
                        <Text style={styles.tableCell}>{employeeNumber}</Text>
                        <Text style={styles.tableCell}>Bank</Text>
                        <Text style={styles.tableCell}>{bank}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Full Name</Text>
                        <Text style={styles.tableCell}>{employeeName}</Text>
                        <Text style={styles.tableCell}>Bank A/C</Text>
                        <Text style={styles.tableCell}>{bankAcNumber}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Designation</Text>
                        <Text style={styles.tableCell}>{designation}</Text>
                        <Text style={styles.tableCell}>IFSC Code</Text>
                        <Text style={styles.tableCell}>{ifscCode}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Department</Text>
                        <Text style={styles.tableCell}>{department}</Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Date of Joining</Text>
                        <Text style={styles.tableCell}>{dateOfJoining}</Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Attendence</Text>
                        <Text style={styles.tableCell}>{attendence}</Text>
                        <Text style={styles.tableCell}></Text>
                        <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.tableRow}>

                    </View>
                    <View style={styles.tableRow}>

                    </View>
                </View>

                {/* Earnings Table */}
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}>Earnings</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}>Fixed Amount</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}>Description</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderTop: '2px solid black', borderBottom: '2px solid black', borderRight: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}>Amount</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', }}>House rental allowance</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', }}>{allowances.rentalAllowance}</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', }}>Professional Tax</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', borderRight: '2px solid black', padding: 5, textAlign: 'center' }}>200</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center' }}>Basic</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center' }}>{allowances.basic}</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center' }}></Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', borderRight: '2px solid black', padding: 5, textAlign: 'center' }}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center' }}>Special allowance</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center' }}>{allowances.specialAllowance}</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center' }}></Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', borderRight: '2px solid black', padding: 5, textAlign: 'center' }}></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}>Total earnings</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}>{allowances.totalAmount}</Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}></Text>
                        <Text style={{ ...styles.tableCell, borderLeft: '2px solid black', borderBottom: '2px solid black', borderRight: '2px solid black', padding: 5, textAlign: 'center', backgroundColor: 'yellow' }}>200</Text>
                    </View>
                </View>

                <View style={{ padding: 5 }} />
                <View>
                    <Text style={{ fontSize: 14, color: 'black', fontWeight: 900, }}>Net Salary: {salaryInfo} ({numberToWords(salaryInfo)} only)</Text>
                </View>
            </View>
        </Page>
            </Document >
    );
}

export default PayslipGenerator