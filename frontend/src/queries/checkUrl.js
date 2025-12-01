import { api } from "../api";

const checkUrl = async (url) => {
  try {
    const response = await api.post("/url/check-url", { url });
    return response.data;
  } catch (error) {
    console.error("Error checking URL status:", error);
    throw error;
  }
};

export default checkUrl;
