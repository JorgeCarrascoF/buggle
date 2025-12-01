import { mdiDelete } from "@mdi/js";
import Icon from "@mdi/react";
import Chip from "./Chip";
import Modal from "./Modal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeUserStatus } from "../queries/changeUserStatus";
import Button from "./Button";
import { useToast } from "../hooks/useToast";

const UserTable = ({ data, onRowClick, currentUser }) => {
  const [changingUserStatus, setChangingUserStatus] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { showToast } = useToast();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (isActive) => changeUserStatus(selectedUser, isActive),
    onSuccess: () => {
      setChangingUserStatus(false);
      queryClient.invalidateQueries(["user", selectedUser]);
    },
    onError: (error) => {
      console.error("Error changing user status:", error);
    },
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm w-full mx-auto mb-4">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-[10.438rem] px-4 py-2 text-left font-medium text-gray-600 border-b border-b-gray-200">
              Username
            </th>
            <th className="w-[6.25rem] px-4 py-2 text-left font-medium text-gray-600 border-b border-b-gray-200">
              Role
            </th>
            <th className="w-[15.625rem] px-4 py-2 text-left font-medium text-gray-600 border-b border-b-gray-200">
              Email
            </th>
            <th className="w-[7.5rem] px-4 py-2 text-left font-medium text-gray-600 border-b border-b-gray-200">
              Date
            </th>
            <th className="w-[7.5rem] px-4 py-2 text-left font-medium text-gray-600 border-b border-b-gray-200">
              Status
            </th>

            {currentUser === "superadmin" && (
              <th className="w-[8.375rem] px-4 py-2 text-center font-medium text-gray-600 border-b border-b-gray-200">
                Delete
              </th>
            )}
          </tr>
        </thead>

        <tbody className="bg-white divide-y">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 h-[4.6rem] 2xl:h-[4rem] cursor-pointer border-t border-b-gray-200"
            >
              <td
                className="px-4 py-2 text-left text-[#737373] truncate whitespace-nowrap overflow-hidden"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {row.fullName || row.username}
              </td>

              <td
                className="px-4 py-2 text-left text-[#737373] capitalize"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {row.role}
              </td>

              <td
                className=" px-4 py-2 text-left text-[#737373] truncate whitespace-nowrap overflow-hidden"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {row.email || "No email provided"}
              </td>

              <td
                className="px-4 py-2 text-left text-[#737373]"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {row.createdAt
                  ? new Date(row.createdAt).toLocaleDateString()
                  : "No date"}
              </td>

              <td
                className="px-4 py-2 text-center"
                onClick={() => onRowClick && onRowClick(row)}
              >
                <Chip
                  type={"userStatus"}
                  value={row.isActive ? "Active" : "Inactive"}
                />
              </td>

              {currentUser === "superadmin" && (
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => {
                      if (row.role == "superadmin") {
                        showToast(
                          "Superadmin cannot be changed to inactive",
                          "error"
                        );
                        return;
                      }
                      setSelectedUser(row.id);
                      setChangingUserStatus(true);
                    }}
                    disabled={!row.isActive}
                    className="text-black cursor-pointer disabled:cursor-not-allowed ml-12 hover:text-red-600"
                  >
                    <Icon path={mdiDelete} size={0.9} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        onClose={() => setChangingUserStatus(false)}
        isOpen={changingUserStatus}
        title={`Are you sure you want to change this user's status to Inactive?`}
      >
        <p>Inactive users will no longer be able to access the system</p>

        <div className="flex mt-12 w-[70%] justify-evenly">
          <div className="w-[40%]">
            <Button
              variant="tertiary"
              onClick={() => {
                setChangingUserStatus(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <div className="w-[40%]">
            <Button
              variant="primary"
              onClick={() => {
                mutation.mutate(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
        {mutation.isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <ClipLoader color="#000000" size={50} />
          </div>
        ) : mutation.isError ? (
          <div className="text-red-500 m-8">
            {mutation.error.response.data.msg}
          </div>
        ) : (
          ""
        )}
      </Modal>
    </div>
  );
};

export default UserTable;
