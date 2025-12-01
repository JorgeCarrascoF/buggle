import splitDate from "../utils/splitDate";
import Chip from "./Chip";

const StatusRow = ({ register }) => {
  const { day, hour } = splitDate(register.created_at);
  return (
    <tr className="h-[72px] cursor-pointer border-t border-t-gray-200 hover:bg-gray-50">
      <td className="text-left px-4 w-full truncate">{register.user.email}</td>
      <td className="">
        <div className="w-[80%] flex justify-center">
          <Chip
            type={"status"}
            value={
              register.status == "unresolved"
                ? "Pending"
                : register.status == "solved"
                ? "Resolved"
                : register.status
            }
          />{" "}
        </div>
      </td>
      <td className="text-left">{day}</td>
      <td className="text-left">{hour}</td>
    </tr>
  );
};

export default StatusRow;
