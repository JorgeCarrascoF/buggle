import { api } from "../api";
import getToken from "../utils/getToken";

export const getUserById = async (userId) => {
  const token = getToken();

  const response = await api.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
