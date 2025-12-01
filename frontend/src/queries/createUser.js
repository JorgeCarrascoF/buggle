import { api } from "../api";
import getToken from "../utils/getToken";

export const registerUser = async (data) => {
  const roles = {
    "688abe5c6ad4e846fbdb0189": "admin",
    "688e3fa51825b4d54f064ccc": "user"
  }
  const token = getToken();
  
  const userData = {
    fullName: data.firstName + " " + data.lastName,
    username: data.displayName,
    email: data.username + data.domain,
    password: data.password,
    role: roles[data.roleId],
    roleId: data.roleId,
  }
  const response = await api.post(`/auth/register`, userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

