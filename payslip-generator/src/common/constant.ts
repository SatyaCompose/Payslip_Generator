export const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const belowTwenty = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
    'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];

export const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

export const thousands = ['', 'Thousand', 'Million', 'Billion'];

export const emailBody = async (employee: any, month: string, year: any) => {
    return `Hi ${employee.employeeName},

I hope this email finds you well.

Please find attached your payslip for the month of ${month} ${year}. If you have any questions or concerns regarding your pay or the information provided in the payslip, feel free to reach out to the below contact information.

Thank you for your hard work and dedication.

Best regards,
Admin Compose
${process.env.REACT_APP_ADMIN_EMAIL}`;
};
