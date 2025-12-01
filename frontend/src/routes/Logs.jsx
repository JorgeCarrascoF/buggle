import NavButton from "../components/NavButton";
import PaginatedLogDashboard from "../components/PaginatedLogDashboard";
import Icon from "@mdi/react";
import { mdiFileOutline  } from "@mdi/js";
import { mdiMagnify } from "@mdi/js";
import { useState } from "react";
import PageWrapper from "../components/PageWrapper";

const Logs = () => {
  const [search, setSearch] = useState("");

  return (
    <PageWrapper
      title="Logs"
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
            text="New log"
            route="/dashboard/log/create"
            variant="dark"
            font="font-light"
            icon={<Icon path={mdiFileOutline } size={1} />}
          />
        </>
      }
    >
      <PaginatedLogDashboard search={search} setSearch={setSearch} />
    </PageWrapper>
  );
};

export default Logs;
