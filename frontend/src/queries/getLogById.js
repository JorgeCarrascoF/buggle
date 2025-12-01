import { api } from "../api";
import getToken from "../utils/getToken";

export const getLogById = async (logId) => {
  const token = getToken();

  const response = await api.get(`/logs/${logId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
