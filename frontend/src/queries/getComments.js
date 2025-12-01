import { api } from "../api";
import getToken from "../utils/getToken";

export const getComments = async (logId, params) => {
  const token = getToken();

  try {
    const { data } = await api.get(`/comments/log/${logId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
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
