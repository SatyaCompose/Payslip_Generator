import axios from 'axios';

export const getEmployeeDetails = async () => {
    const url = `${process.env.BUILDER_URL}/employee-details?apiKey=${process.env.BUILDER_APIKEY}`;
    const data = await axios.get(url);
    return {
        status: data.status,
        message: "Employees data fetched Successfully",
        data: data?.data?.results
    };
}

export const getEmployeeByEmail = async (email: string) => {
    const url = `${process.env.BUILDER_URL}/employee-details?apiKey=${process.env.BUILDER_APIKEY}&query.data.email=${email}`;
    const data = await axios.get(url);
    return {
        status: data.status,
        message: "Employee data fetched Successfully",
        data: data?.data?.results[0]?.data
    };
}

export const companyDetails = async () => {
    const url = `${process.env.BUILDER_URL}/company-details?apiKey=${process.env.BUILDER_APIKEY}`;
    const data = await axios.get(url);
    return {
        status: data.status,
        message: "Company details data fetched Successfully",
        data: data?.data?.results[0]?.data
    };
}
