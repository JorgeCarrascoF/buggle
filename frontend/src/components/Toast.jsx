import { useEffect } from "react";
import Icon from "@mdi/react";
import { mdiInformationOutline, mdiCheck, mdiAlertOutline } from "@mdi/js";

const Toast = ({ message, onClose, type = "info", duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeIcon = {
    info: mdiInformationOutline,
    success: mdiCheck,
    error: mdiAlertOutline,
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`pointer-events-auto flex gap-3 px-4 py-2 rounded shadow text-white bg-[#295ba2]`}
      >
        <Icon path={typeIcon[type]} size={1} />
        {message}
      </div>
    </div>
  );
};

export default Toast;
