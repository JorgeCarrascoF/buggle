import { api } from "../api";
import getToken from "../utils/getToken";

export const getLogs = async ({ type, status, environment, platform, priority, search, date, page, limit }) => {
  const token = getToken();

  const params = new URLSearchParams();

  if (type) params.append("error_type", type);
  if (status) params.append("status", status);
  if (platform) params.append("platform", platform);
  if (environment) params.append("environment", environment);
  if (priority) params.append("priority", priority);
  if (search?.trim()) {
    if (!isNaN(search)) {
      // si search es numérico, lo mandamos como id
      params.append("id", Number(search));
    } else {
      // si no, lo mandamos como búsqueda de texto
      params.append("search", search);
    }
  }
  if (date) params.append("date", date);
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  const response = await api.get(`/logs?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
