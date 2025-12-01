import { useState } from "react";
import Button from "./Button";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLog } from "../queries/updateLog";
import Icon from "@mdi/react";
import { mdiCheckCircleOutline } from "@mdi/js";
import Modal from "./Modal";

const DeactivateLog = ({ logId, inactive }) => {
  const queryClient = useQueryClient();
  const [changingActive, setChangingActive] = useState(false);

  const [showingConfirmation, setShowingConfirmation] = useState(false);

  const mutation = useMutation({
    mutationFn: (active) => updateLog(logId, active),
    onSuccess: () => {
      queryClient.invalidateQueries(["log", logId]);
    },
    onError: (error) => {
      console.error("Error updating log:", error);
    },
  });
  const handleInactive = () => {
    mutation.mutate({ active: false });
    setChangingActive(false);
  };

  const handleActive = () => {
    mutation.mutate({ active: true });
    setShowingConfirmation(true);
    setChangingActive(false);
    const timer = setTimeout(() => {
      setShowingConfirmation(false);
    }, 2000);
  };

  return (
    <div className="relative">
      {showingConfirmation && (
        <div className="absolute border-1 px-6 py-16 flex flex-col items-center justify-center border-[#DBDBDB] w-100 top-15 -right-40 bg-white rounded-md">
          <Icon
            path={mdiCheckCircleOutline}
            size={1.5}
            className="text-green-500 mb-2"
          />
          <h2 className="text-2xl mb-4 font-medium text-black">
            Log reactivated
          </h2>
          <span className="text-[#737373]">
            This log is now active and ready for tracking
          </span>
        </div>
      )}
      <Button
        active={true}
        onClick={() => {
          setChangingActive(true);
          inactive && handleActive();
        }}
        className={`px-4 py-2 rounded-md font-medium transition ${
          inactive
            ? "bg-[#295ba2] text-white hover:bg-[#3f77c6]"
            : "bg-[#295ba2] text-white hover:bg-[#3f77c6]"
        }`}
      >
        <span className="text-sm font-light">
          {inactive ? "Activate Log" : "Deactivate Log"}
        </span>
      </Button>
      <Modal
        isOpen={changingActive && !inactive}
        onClose={() => setChangingActive(false)}
      >
        <div className="flex flex-col  items-center justify-center [&>span]:text-[#737373]">
          <WarningAmberRoundedIcon
            className="text-yellow-500 mb-2"
            fontSize="large"
          />
          <h2 className="text-2xl mb-2 font-medium text-black">
            Deactivate this log?
          </h2>
          <span>This action will mark the log as inactive.</span>
          <span>It can be reactivated later if needed.</span>
          <div className="flex gap-4 mt-10">
            <div className="w-[9rem]">
              <Button
                active={true}
                variant="tertiary"
                onClick={() => setChangingActive(false)}
              >
                Cancel
              </Button>
            </div>
            <div className="w-[9rem]">
              <Button active={true} font="font-normal" onClick={handleInactive}>
                Saved
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeactivateLog;
