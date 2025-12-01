import { api } from "../api";
import getToken from "../utils/getToken";

const deleteLog = async (id) => {
  const token = getToken();

  const response = await api.patch(
    `/logs/${id}`,
    {
      deleted: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export default deleteLog;
