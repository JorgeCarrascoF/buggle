import { Navigate } from "react-router-dom";
import getToken from "../utils/getToken";

const PrivateRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderiza los hijos (la ruta protegida)
  return children;
};

export default PrivateRoute;
