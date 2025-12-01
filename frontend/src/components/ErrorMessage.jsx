import Icon from "@mdi/react";
import { mdiAlertCircleOutline } from "@mdi/js";

const ErrorMessage = ({ message, inactive }) => {
  return (
    <div
      className={`flex items-center justify-left rounded-lg min-w-[311px] w-[65%] border border-[#DBDBDB] py-6 px-2 ${
        inactive ? "opacity-50" : ""
      }`}
    >
      <Icon
        path={mdiAlertCircleOutline}
        size={2.8}
        className={` mr-3 mb-3 ${inactive ? "text-gray-500" : "text-[#D90932]"}`}
      />
      <div className="flex flex-col items-start justify-center h-28 max-w-[80%]">
        <h1 className="text-black font-medium py-1">Error message</h1>
        <p className="text-[#737373] text-left leading-9 break-words w-full">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
