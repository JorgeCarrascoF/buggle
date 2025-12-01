import { api } from "../api";
import getToken from "../utils/getToken"

const updateComment = async (id, updateFields) => {
    const token =  getToken();

    try {
        const response = await api.patch(`/comments/${id}`, updateFields, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
}

export default updateComment;