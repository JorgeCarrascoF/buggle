import { api } from "../api";
import getToken from "../utils/getToken";

export const registerStatusChange = async (logId, newStatus) => {
  const token = getToken();

  try {
    const response = await api.post(
      "/status-register",
      {
        logId,
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering status change:", error);
    throw new Error(error.message);
  }
};
