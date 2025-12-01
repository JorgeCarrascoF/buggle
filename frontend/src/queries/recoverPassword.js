import { api } from "../api";

export const recoverPassword = async (email) => {
  try {
    const response = await api.post("/auth/recover-password", { email });
    return response.data;
  } catch (error) {
    if (error.response) {
        throw new Error(error.response.data.message);
    } else {
      throw new Error("Unexpected error");
    }
  }
};
