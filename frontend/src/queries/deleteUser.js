import { api } from "../api";
import getToken from "../utils/getToken"

const deleteComment = async (id) => {
    const token =  getToken();

    try {
        const response = await api.delete(`/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

export default deleteComment;