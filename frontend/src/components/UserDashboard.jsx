import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../queries/getUsers";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import Button from "./Button";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import UserTable from "./UserTable.jsx";
import { useNavigate } from "react-router-dom";
import SelectInput from "./SelectInput.jsx";
import { jwtDecode } from "jwt-decode";
import getPageNumbers from "../utils/getPageNumbers.js";
import getToken from "../utils/getToken.js";

const USERS_PER_PAGE = 10;

const UserDashboard = ({ search, setSearch }) => {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const navigate = useNavigate();

  let userData = JSON.parse(localStorage.getItem("userData"));

  const token = getToken();

  const decoded = jwtDecode(token);
  const userRole = decoded.role;

  const {
    data: users,
    isLoading: loadingUsers,
    isError: errorLoadingUsers,
    error,
    isPreviousData,
  } = useQuery({
    queryKey: ["users", page, search, roleFilter, activeFilter],
    queryFn: () =>
      getUsers({
        page,
        limit: USERS_PER_PAGE,
        role: roleFilter,
        active: activeFilter,
        search: search.trim(),
      }),
    keepPreviousData: true,
  });

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "createdAt", label: "Date" },
    { key: "active", label: "Status" },
  ];

  if (userData.role === "superadmin") {
    columns.push({ key: "delete", label: "Delete" });
  }

  if (errorLoadingUsers) {
    return (
      <div className="flex flex-col items-center justify-center shadow-md p-4 rounded-md bg-red-100 text-red-800">
        <span className="text-red-600">
          Error: {JSON.parse(error.request.response).msg}
        </span>
      </div>
    );
  }

  let totalPages = users ? Math.ceil(users.total / USERS_PER_PAGE) : 0;

  const handleRowClick = (row) => {
    navigate(`/users/${row.id}`);
  };

  return (
    <div className="flex flex-col h-full w-full self-start">
      <div className=" mr-auto flex gap-5">
        <div className="w-30">
          <SelectInput
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            placeholder="Role"
            options={[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
              { value: "superadmin", label: "Superadmin" },
            ]}
          />
        </div>
        <div>
          {userData.role !== "user" && (
            <SelectInput
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          )}
        </div>
        <div>
          {(search || roleFilter || activeFilter) && (
            <div>
              <Button
                onClick={() => {
                  setActiveFilter("");
                  setRoleFilter("");
                  setSearch("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
      {loadingUsers ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : users.data.length === 0 ? (
        <div>No more users available.</div>
      ) : (
        <>
          <div className="flex flex-col w-full mt-4">
            <UserTable
              columns={columns}
              data={users.data}
              onRowClick={handleRowClick}
              currentUser={userRole}
            />
          </div>
          <div className="flex justify-center items-center mt-auto gap-4">
            <div className="w-[113px]">
              <Button
                variant="pagination"
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                active={false}
              >
                <Icon path={mdiChevronLeft} size={1} />
                Previous
              </Button>
            </div>
            <div className="flex gap-2">
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2">
                    ...
                  </span>
                ) : (
                  <Button
                    key={i}
                    variant="pagination"
                    onClick={() => setPage(p)}
                    active={p === page}
                  >
                    {p}
                  </Button>
                )
              )}
            </div>
            <div className="w-[93px]">
              <Button
                onClick={() => setPage((old) => old + 1)}
                variant="pagination"
                active={false}
                disabled={isPreviousData || users.data.length < USERS_PER_PAGE}
              >
                Next
                <Icon path={mdiChevronRight} size={1} />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
