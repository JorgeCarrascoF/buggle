import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLogById } from "../queries/getLogById";
import { getUsers } from "../queries/getUsers";
import { updateLog } from "../queries/updateLog";
import { ClipLoader } from "react-spinners";
import LogDescription from "./LogDescription";
import LogComments from "./LogComments";
import LogAISuggestion from "./LogAISuggestion";
import Chip from "./Chip";
import SelectInput from "./SelectInput";
import { maxLimitInteger } from "../utils/maxLimitInteger";
import RelatedLogs from "./RelatedLogs";
import { registerStatusChange } from "../queries/registerStatusChange";
import DeactivateLog from "./DeactivateLog";
import LogStatusRegister from "./LogStatusRegister";
import PriorityUserSelect from "./PriorityUserSelect";
import { formatDateAndHour } from "../utils/formatDateAndHour";
import { getComments } from "../queries/getComments";
import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { useToast } from "../hooks/useToast";

const LogInfo = ({ logId }) => {
  const queryClient = useQueryClient();
  let currentUser = JSON.parse(localStorage.getItem("userData"));

  const { showToast } = useToast();

  const [selectedUser, setSelectedUser] = useState(null);

  const {
    data: log,
    isLoading: isLoadingLog,
    isError: isErrorLog,
    error: logError,
  } = useQuery({
    queryKey: ["log", logId],
    queryFn: () => getLogById(logId),
  });

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ page: 1, limit: maxLimitInteger }),
  });

  const mutation = useMutation({
    mutationFn: ({ updates }) => updateLog(logId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["log", logId]);
      showToast("Log has been updated successfully", "success");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ newStatus }) => registerStatusChange(logId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries(["log", logId]);
      queryClient.invalidateQueries(["statusRegister", logId]);
    },
    onError: (error) => {
      console.error("Error changing status:", error);
    },
  });

  const userOptions =
    users?.data?.map((u) => ({
      value: u.id,
      label: u.username,
    })) || [];

  if (isLoadingLog || isLoadingUsers)
    return <ClipLoader color="#000000" size={50} />;

  if (isErrorLog)
    return <div className="text-red-500">Error: {logError.message}</div>;

  if (isErrorUsers)
    return (
      <div className="text-red-500">
        Error cargando usuarios: {usersError.message}
      </div>
    );

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "superadmin";

  const isInactive = log.active === false;

  const currentUserId = localStorage.getItem("userId");

  const handleAssignedChange = (selected) => {
    if (log.assigned_to === selected.value) {
      showToast("The log is already assigned to that user", "error");
      return;
    }
    const selectedUserData = users?.data?.find((u) => u.id === selected.value);

    if (selectedUserData && !selectedUserData.isActive) {
      showToast("The user is in the inactive state, unable to assign", "error");
      setSelectedUser(null);
      return;
    }

    if (selectedUserData.role === "superadmin") {
      showToast("The user is not valid for log assignment");
      setSelectedUser(null);
      return;
    }

    setSelectedUser(selected);
    mutation.mutate({
      updates: { assigned_to: selected.value },
    });
  };

  const handlePriorityChange = (e) => {
    mutation.mutate({
      updates: { priority: e.target.value },
    });
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (newStatus === "solved") {
      const hasComments = await checkIfLogHasComments(logId);

      if (!hasComments) {
        showToast(
          "Cannot mark as solved without at least one comment",
          "error"
        );
        return;
      }
    }

    statusMutation.mutate(
      { newStatus: e.target.value },
      {
        onSuccess: () => {
          mutation.mutate(
            { updates: { status: e.target.value } },
            {
              onSuccess: () =>
                showToast("Log has been updated successfully", "success"),
            }
          );
        },
      }
    );
  };

  const checkIfLogHasComments = async (logId) => {
    try {
      let comments = queryClient.getQueryData(["comments", logId]);

      if (!comments) {
        comments = await getComments(logId, { limit: maxLimitInteger });
      }

      return comments?.data?.length > 0;
    } catch (error) {
      console.error("Error checking comments:", error);
      return false;
    }
  };

  return (
    <>
      <div
        className={`w-full flex flex-col gap-6 border border-[#DBDBDB] bg-white rounded-lg pt-8 pb-16 px-12 mb-4 ${
          isInactive ? " text-[#737373]" : " text-black"
        }`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-left mb-1">Log #{logId}</h1>
          </div>
        </div>

        <div className="flex flex-col items-start mb-">
          <div className="mb-4 flex w-[90%] justify-between">
            <ErrorMessage message={log.message} inactive={isInactive} />

            {currentUser?.role === "superadmin" ? (
              <div className="mt-4">
                <DeactivateLog logId={logId} inactive={isInactive} />
              </div>
            ) : currentUser?.role === "user" ? (
              <div className="mt-6">
                <InfoItem label="Priority" value={log.priority} badge />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="w-[90%] mt-7 grid grid-cols-3 gap-10 gap-y-7">
            <InfoItem label="Environment" value={log.environment} />
            <InfoItem
              label="Error Type"
              value={log.error_type || "Undetermined"}
            />
            <InfoItem
              label="Location"
              value={
                log.culprit === "error culprit" || !log.culprit
                  ? "Undetermined"
                  : log.culprit
              }
            />
            <InfoItem
              label="Creation date"
              value={formatDateAndHour(log.created_at)}
            />
            <InfoItem
              label="Last seen"
              colSpan={isAdmin ? 1 : 0}
              value={formatDateAndHour(log.last_seen_at)}
            />

            {isAdmin && (
              <div className="w-fit flexflex-col items-start">
                <div className="w-[184px]">
                  <SelectInput
                    options={[
                      { value: "high", label: "High", color: "#ff5252" },
                      { value: "medium", label: "Medium", color: "#fb8c00" },
                      { value: "low", label: "Low", color: "#4CAF50" },
                    ]}
                    label="Priority"
                    value={log.priority}
                    onChange={handlePriorityChange}
                    className="w-48"
                    colorizeOnActive={false}
                    isDisabled={mutation.isLoading || isInactive}
                  />
                </div>
              </div>
            )}

            <div className="w-fit flex flex-col items-start">
              {isAdmin || currentUserId === log.assigned_to ? (
                <div className="w-[224px] max-w-[70%] h-full">
                  <SelectInput
                    label="Status"
                    options={[
                      { value: "unresolved", label: "Pending" },
                      { value: "in review", label: "In Review" },
                      { value: "solved", label: "Resolved" },
                    ]}
                    value={log.status}
                    onChange={handleStatusChange}
                    colorizeOnActive={false}
                    isDisabled={mutation.isLoading || isInactive}
                  />
                </div>
              ) : (
                <InfoItem
                  label="Status"
                  value={
                    log.status == "unresolved"
                      ? "Pending"
                      : log.status == "in review"
                      ? "In Review"
                      : "Resolved"
                  }
                />
              )}
            </div>

            <div className="w-fit flex flex-col items-start ">
              {isAdmin ? (
                <div className="ml-0">
                  <PriorityUserSelect
                    log={log}
                    label="Assigned user"
                    isInactive={mutation.isLoading || isInactive}
                    handleAssignedChange={handleAssignedChange}
                    selectedUser={selectedUser}
                  />
                </div>
              ) : (
                <InfoItem
                  label="Assigned to"
                  value={
                    userOptions.find((u) => u.value === log.assigned_to)
                      ?.label ||
                    log.assigned_to ||
                    "Unassigned"
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <LogDescription description={log.description} inactive={isInactive} />
      <LogComments logId={logId} inactive={isInactive} />
      <RelatedLogs log={log} inactive={isInactive} />
      <LogStatusRegister logId={logId} inactive={isInactive} />
      <LogAISuggestion log={log} inactive={isInactive || !log.culprit} />
    </>
  );
};

const InfoItem = ({ label, value, badge, colSpan }) => (
  <div
    className={`${colSpan ? "col-span-2" : ""} w-fit flex flex-col ${
      badge ? "items-center" : "items-start"
    }`}
  >
    <span className="mb-3 w-full text-left">{label}</span>
    {badge ? (
      <div className="w-28">
        <Chip
          type={label.toLowerCase().replace(" ", "_")}
          value={value}
          showPoint={label == "Priority"}
        />
      </div>
    ) : (
      <p className="break-all text-gray-500 text-left">{value}</p>
    )}
  </div>
);

export default LogInfo;
