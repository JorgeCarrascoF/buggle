import { api } from "../api";
import getToken from "../utils/getToken";

export const createLogReport = async ({ logId }) => {
  const token = getToken();

  try {
    const { data } = await api.post(
      `/suggestions`,
      {
        logId: logId,
        owner: "JorgeCarrascoF",
        repo: "frontend",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Body:", error.response.data);
    }
    throw error;
  }
};
