import UserDashboard from "../components/UserDashboard";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { mdiMagnify } from "@mdi/js";
import NavButton from "../components/NavButton";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";

const Users = () => {
  const [search, setSearch] = useState("");

  return (
    <PageWrapper
      title="Users"
      headerRight={
        <>
          <div className="mr-6 relative bg-[#f0f2f5] rounded-lg">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-2 outline-none h-full w-[12.5rem] focus:w-[31.25rem] transition-all"
            />
            <Icon
              path={mdiMagnify}
              size={1}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <NavButton
            text="New user"
            route="/users/register"
            variant="dark"
            font="font-light"
            icon={<Icon path={mdiPlus} size={1} />}
          />
        </>
      }
    >
      <UserDashboard search={search} setSearch={setSearch} />
    </PageWrapper>
  );
};

export default Users;
