import { api } from "../api";
import getToken from "../utils/getToken";

export async function createComment(logId, comment) {
  const token = getToken();

  try {
    const response = await api.post(
      "/comments",
      {
        logId,
        text: comment,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creando un comentario:", error);
    throw error;
  }
}
