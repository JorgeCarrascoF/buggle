import { api } from "../api";
import getToken from "../utils/getToken";

export const getSuggestedUsers = async ({ error_signature }) => {
  const token = getToken();

  const response = await api.get(`/suggested-user/${error_signature}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};
