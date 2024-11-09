import axios from "axios";

export const fetchToken = async () => {
    try {
        const response = await axios.post('http://localhost:3000/generate-token', {
            headers: { 'Content-Type': 'application/json' },
        });

        const receivedToken = response.data.token;
        const currentTime = new Date().getTime();
        const newExpiryTime = currentTime + 3600000; // 1 hour in milliseconds

        localStorage.setItem('authToken', response.data.token || '');
        localStorage.setItem('tokenExpiry', newExpiryTime.toString());

        return receivedToken;
    } catch (error) {
        console.error('Error fetching token:', error);
    }
};

export const fetchEmployeeDetails = async () => {
    try {
        let token = localStorage.getItem('authToken');
        let tokenExpiry = localStorage.getItem('tokenExpiry');

        const currentTime = new Date().getTime();
        if (token === '' || token === undefined || currentTime >= Number(tokenExpiry)) {
            token = await refreshToken(currentTime)
        }

        const response = await axios.get('http://localhost:3000/api/employee-details', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;

    } catch (err: any) {
        console.error("Error fetching employee details:", err);
    }
};

export const fetchEmployeeByEmail = async () => {
    try {
        let token = localStorage.getItem('authToken');
        let tokenExpiry = localStorage.getItem('tokenExpiry');

        const currentTime = new Date().getTime();

        if (token === '' || token === undefined || currentTime >= Number(tokenExpiry)) {
            token = await refreshToken(currentTime)
        }
        const email = localStorage.getItem('selectedEmployeeEmail')
        const response = await axios.post('http://localhost:3000/api/get-employee-details-by-email', { selectedEmail: email }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (err: any) {
        console.error("Error fetching employee details:", err);
    }
}

export const fetchCompanyDetails = async () => {
    try {
        let token = localStorage.getItem('authToken');
        let tokenExpiry = localStorage.getItem('tokenExpiry');

        const currentTime = new Date().getTime();
        if (token === '' || token === undefined || currentTime >= Number(tokenExpiry)) {
            token = await refreshToken(currentTime)
        }

        const response = await axios.get('http://localhost:3000/api/company-details', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;

    } catch (err: any) {
        console.error("Error fetching employee details:", err);
    }
};

export const refreshToken = async (currentTime: any) => {
    const newToken = await fetchToken();

    const newExpiryTime = currentTime + 3600000; // 1 hour in milliseconds
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('tokenExpiry', newExpiryTime.toString());
    return newToken;
}