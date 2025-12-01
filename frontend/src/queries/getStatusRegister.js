import { api } from "../api";
import getToken from "../utils/getToken"

const getStatusRegister = async (logId, params) => {
    const token = getToken();
    try {
        const {data} = await api.get(`/status-register/log/${logId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params
        });
        return data;
    } catch (error) {
        console.error("Error fetching status register:", error);
        throw error;
    }
}

export default getStatusRegister;