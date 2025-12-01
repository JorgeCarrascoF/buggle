import { api } from "../api";
import getToken from "../utils/getToken";

export async function changeUserFirstLoginStatus({userId, isFirstLogin}) {
    const token = getToken();
    try {
        const response = await api.patch(
            `/users/first-login/${userId}`,
            { status: isFirstLogin },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.message;
    } catch (error) {
        console.error("Error changing user first login status:", error);
        throw error;
    }
}
