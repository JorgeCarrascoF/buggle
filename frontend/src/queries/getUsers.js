import { api } from "../api";
import getToken from "../utils/getToken";

export const getUsers = async ({ page, limit, role, active, search }) => {
  const token = getToken();

  let isActive;
  if (active === "active") isActive = "true";
  if (active === "inactive") isActive = "false";

  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
      role,
      search,
      ...(isActive !== undefined && { isActive }),
    },
  });
  return response.data;
};
