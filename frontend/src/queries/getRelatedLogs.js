import { api } from "../api";
import getToken from "../utils/getToken";

export const getRelatedLogs = async ({ error_signature }) => {
  const token = getToken();
  try {
    const response = await api.get("/logs", {
      params: { error_signature },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching related logs:", error.response || error);
    throw error;
  }
};
