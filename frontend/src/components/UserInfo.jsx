import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import UserIcon from "./UserIcon";
import { getUserById } from "../queries/getUserById";
import NavButton from "./NavButton";
import Icon from "@mdi/react";
import { mdiOpenInNew, mdiAlertOutline, mdiCheckCircleOutline } from "@mdi/js";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { changeUserStatus } from "../queries/changeUserStatus";
import SelectInput from "./SelectInput";
import { useToast } from "../hooks/useToast";

const UserInfo = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [newStatus, setNewStatus] = useState(null);
  const [changingUserStatus, setChangingUserStatus] = useState(false);
  const [statusChangeConfirmed, setStatusChangeConfirmed] = useState(false);

  useEffect(() => {
    if (statusChangeConfirmed) {
      const timer = setTimeout(() => {
        setStatusChangeConfirmed(false);
        setChangingUserStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusChangeConfirmed]);

  const { showToast } = useToast();

  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });

  const mutation = useMutation({
    mutationFn: (isActive) => changeUserStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", userId]);
      setStatusChangeConfirmed(true);
      setNewStatus(null);
    },
    onError: (error) => {
      console.error("Error changing user status:", error);
    },
  });

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <ClipLoader color="#000000" size={50} />
      </div>
    );
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="w-full h-[99%] -ml-4">
      <div className="flex items-center justify-between mt-8 mb-4">
        <h1 className="text-2xl font-bold ms-6">Profile</h1>
        <div className="me-6">
          <NavButton
            text="User list"
            route="/users"
            variant="dark"
            icon={<Icon path={mdiOpenInNew} size={1} />}
          />
        </div>
      </div>

      <div className="flex gap-6 m-2.5 h-[65%] 2xl:h-[70%]">
        <div className="border border-gray-200 bg-white rounded-[10px] h-full w-[27%] flex flex-col items-center py-12">
          <div className="flex flex-col items-center">
            <div className="rounded-full w-24 h-24 flex items-center justify-center">
              <UserIcon name={userData?.username || "Profile"} />
            </div>
            <div className="text-center mt-3 flex flex-col items-center gap-1">
              <p className="text-2xl font-medium">
                {userData?.username || "Profile"}
              </p>
              <p className="text-md text-gray-500">{userData?.email}</p>
              <p className="text-md text-black">{userData?.role}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-16 w-[90%] px-3">
            <Button
              variant="section"
              align="left"
              active={activeTab === "info"}
              onClick={() => setActiveTab("info")}
            >
              Account information
            </Button>
            <Button
              variant="section"
              align="left"
              active={activeTab === "status"}
              onClick={() => setActiveTab("status")}
            >
              Change status
            </Button>
          </div>
        </div>

        <div className="border border-gray-200 bg-white rounded-[10px] h-full w-[73%] p-8 flex flex-col justify-between">
          {activeTab === "info" && (
            <div className="mt-10 ms-8">
              <h2 className="flex justify-start text-2xl font-bold mb-8">
                Account Information
              </h2>
              <div className="grid grid-cols-2 gap-14">
                <div className="mb-10 mt-5">
                  <label className="flex justify-start text-md text-gray-600 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={userData?.fullName?.split(" ")[0] || "User"}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-[#737373] h-[80%]"
                  />
                </div>
                <div className="mb-10 mt-5">
                  <label className="flex justify-start text-md text-gray-600 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userData?.fullName?.split(" ")[1] || "name"}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-[#737373] h-[80%]"
                  />
                </div>
                <div className="mb-10">
                  <label className="flex justify-start text-md text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    value={userData?.email || ""}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-[#737373] h-[80%]"
                  />
                </div>
                <div className="mb-10">
                  <label className="flex justify-start text-md text-gray-600 mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={userData?.createdAt?.slice(0, 10) || ""}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-[#737373] h-[80%]"
                  />
                </div>
                <div className="mb-10 -mt-6">
                  <label className="flex justify-start text-md text-gray-600 mb-2">
                    Status
                  </label>
                  <input
                    type="text"
                    value={userData?.isActive ? "Active" : "Inactive"}
                    disabled
                    className={`w-full border ${
                      userData?.isActive ? "border-[#4CAF50]" : "border-red-500"
                    } rounded-md px-3 py-2 h-[80%]`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "status" && (
            <div className="mt-3 ms-2 h-full flex flex-col justify-between">
              <div>
                <h2 className="flex justify-start text-2xl font-bold ms-6 mb-6 mt-7">
                  Account Information
                </h2>
                <div className="grid grid-cols-1 gap-6 w-[45%] ms-6 mt-14">
                  <div>
                    <label className="flex justify-start font-semibold text-md text-gray-600 mb-2">
                      Status
                    </label>
                    <input
                      type="text"
                      value={userData?.isActive ? "Active" : "Inactive"}
                      disabled
                      className={`w-full text-sm border ${
                        userData?.isActive
                          ? "border-[#4CAF50]"
                          : "border-red-500"
                      } rounded-md px-3  h-[90%]`}
                    />
                  </div>

                  <div className="mt-21">
                    <label className="flex justify-start font-semibold text-md text-gray-600 mb-2">
                      Status
                    </label>

                    <SelectInput
                      value={
                        newStatus === null
                          ? userData.isActive
                            ? "true"
                            : "false"
                          : newStatus.toString()
                      }
                      onChange={(e) => setNewStatus(e.target.value === "true")}
                      colorizeOnActive={false}
                      options={[
                        { value: "true", label: "Active" },
                        { value: "false", label: "Inactive" },
                      ]}
                      placeholder="Select status"
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-fit gap-4 mt-auto ml-auto mr-5">
                <div className="w-[170px]">
                  <Button
                    variant="tertiary"
                    disabled={
                      newStatus === null || newStatus === userData.isActive
                    }
                    onClick={() => setNewStatus(userData.isActive)}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="w-[170px]">
                  <Button
                    disabled={
                      newStatus === userData.isActive || newStatus === null
                    }
                    onClick={() => {
                      if (userData.role == "superadmin") {
                        showToast(
                          "Superadmin cannot be changed to inactive",
                          "error"
                        );
                        return;
                      }
                      setChangingUserStatus(true);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        onClose={() => setChangingUserStatus(false)}
        isOpen={changingUserStatus}
      >
        <Icon
          path={statusChangeConfirmed ? mdiCheckCircleOutline : mdiAlertOutline}
          color={statusChangeConfirmed ? "green" : "#ffa60a"}
          size={1.5}
        />
        <h2 className={`text-2xl mb-2 mt-3 px-8 text-black font-semibold`}>
          {statusChangeConfirmed
            ? "User status changed successfully"
            : `Are you sure you want to change this user's status to ${
                newStatus ? "Active" : "Inactive"
              }?`}
        </h2>
        <p className={statusChangeConfirmed ? "mb-8" : ""}>
          {statusChangeConfirmed
            ? "You can update this status later if required."
            : newStatus
            ? "Active users will be able to access the system"
            : "Inactive users will no longer be able to access the system"}
        </p>

        {statusChangeConfirmed ? (
          ""
        ) : (
          <div className="flex mt-12 w-[70%] justify-evenly">
            <div className="w-[40%]">
              <Button
                variant="tertiary"
                onClick={() => {
                  setChangingUserStatus(false);
                  setNewStatus(null);
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="w-[40%]">
              <Button
                variant="primary"
                font="font-light"
                onClick={() => {
                  mutation.mutate(newStatus);
                }}
              >
                Saved
              </Button>
            </div>
          </div>
        )}
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

export default UserInfo;
