import { Link, useLocation } from "react-router-dom";

  const variants = {
  light: {
    base: "text-gray-900",
    bg: "bg-[#fafafa]",
    bgActive: "bg-[#e3ebf6]",
    hover: "hover:bg-[#e3ebf6]",
    icon: "text-black",
  },
  dark: {
    base: "text-white",
    bg: "bg-[#295ba2]",
    bgActive: "bg-black",
    hover: "hover:bg-[#3f77c6]",
    icon: "text-white",
  },
};

const NavButton = ({ text, route, icon, variant = "light", font = "font-medium"}) => {
  const location = useLocation();
  const isActive = location.pathname === route;


  const v = variants[variant] || variants.light;

  return (
    <Link
      to={route}
      className={`px-3 py-2 flex items-center justify-left ${v.base} rounded-lg ${isActive ? v.bgActive : v.bg} ${v.hover} transition-colors duration-200`}
    >
      {icon && <span className={`mr-3 ${v.icon}`}>{icon}</span>}
      <span className={`${v.base} ${font} text-sm`}>{text}</span>
    </Link>
  );
};

export default NavButton;
