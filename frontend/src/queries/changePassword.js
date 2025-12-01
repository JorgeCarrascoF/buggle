import { api } from "../api";
import getToken from "../utils/getToken";

export async function changePassword({ currentPassword, newPassword }) {
  const token = getToken();
  try {
    const response = await api.post(
      "/users/change-password",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      throw new Error(
        err.response.data.msg || "Error al cambiar la contraseña"
      );
    }
    throw new Error(err.message);
  }
}
