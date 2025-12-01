import NavButton from "./NavButton";
import Icon from "@mdi/react";
import { mdiFileOutline } from "@mdi/js";
import { mdiAccountMultipleOutline } from "@mdi/js";
import LogoutButton from "./LogoutButton";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LogoIsotipo from "../assets/Buggle_Isotipo.svg";
import LogoTipografia from "../assets/Buggle_tipografia_curvas.svg";
import UserIconVerySmall from "./UserIconVerySmall.jsx";
import { mdiAccountCogOutline } from "@mdi/js";
import Logo from "./Logo.jsx";

const Layout = () => {
  const { isLoggedIn } = useAuth();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#fafafa]">
      <nav className="w-[20rem] h-screen fixed left-0 flex flex-col justify-between pt-0 pb-4">
        <div className="mx-7 flex flex-col items-center">
          <span
            className="font-semibold self-start text-left w-[116px] h-[29px] mt-8 mb-10  text-black cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Logo showText={true} orientation={"horizontal"} iconHeight={30} />
          </span>
          {userData && (
            <div className="flex items-center gap-3 self-start">
              <div>
                <UserIconVerySmall name={userData.fullName} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-black">
                  {userData.fullName} - {userData.role}
                </span>
                <span className="text-sm text-gray-500">{userData.email}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col mt-4 w-full ml-12 gap-[10px]">
            <NavButton
              text={"Logs"}
              route={"/dashboard"}
              icon={<Icon path={mdiFileOutline} size={1} />}
            />
            {(userData?.role === "admin" ||
              userData?.role === "superadmin") && (
              <NavButton
                text={"User Management"}
                route={"/users"}
                icon={<Icon path={mdiAccountMultipleOutline} size={1} />}
              />
            )}
            {isLoggedIn && (
              <NavButton
                text={"Profile"}
                route={"/profile"}
                icon={<Icon path={mdiAccountCogOutline} size={1} />}
              />
            )}
          </div>
        </div>
        <div className="mx-[22px] mt-4 flex flex-col items-center justify-start mb-7">
          <div className="flex flex-col mt-10 w-full mb-2 gap-2">
            <LogoutButton />
          </div>
          <div className="w-full flex justify-start">
            <button
              className="w-fit cursor-pointer text-left text-[#737373] text-sm ml-5 tracking-tighter"
              onClick={() => navigate("/onboarding")}
            >
              Need Help?
            </button>
          </div>
        </div>
      </nav>
      <main className="ml-[20rem] flex-1 flex flex-col py-6 px-6 overflow-auto h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
