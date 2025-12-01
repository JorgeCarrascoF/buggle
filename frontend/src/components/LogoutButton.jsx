import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Icon from "@mdi/react";
import { mdiLogout } from "@mdi/js";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      className={`px-5  font-semibold  cursor-pointer text-gray-900 py-3 flex items-center justify-left rounded-lg hover:bg-[#f0f2f5] transition-colors duration-200`}
      onClick={handleLogout}
    >
      <Icon path={mdiLogout} size={1} /> <span className="ml-3 font-normal text-sm">Log out</span>
    </button>
  );
};

export default LogoutButton;
