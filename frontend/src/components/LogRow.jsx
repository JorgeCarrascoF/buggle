import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../queries/getUsers";
import { formatDate } from "../utils/formatDate";
import Chip from "./Chip";
import { maxLimitInteger } from "../utils/maxLimitInteger";

const LogRow = ({ log, onRowClick }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const {
    data: users
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ page: 1, limit: maxLimitInteger }),
  });

  const userOptions =
    users?.data?.map((u) => ({
      value: u.id,
      label: u.username,
    })) || [];

  return (
    <tr
      className="cursor-pointer h-[4.6rem] 2xl:h-[4rem] border-t text-left border-gray-200 text-sm hover:bg-gray-50
                 [&>td]:px-4 [&>td]:py-1 [&>td]:border-t [&>td]:border-gray-200"
      onClick={() => onRowClick(log)}
    >
      {/*<td className="w-[10ch] truncate">{log.id}</td>*/}
      <td className="w-[10ch] truncate" title={log.id}>{log.id}
      </td>
      <td>
        <Chip type="environment" value={log.environment || "Unknown"} />
      </td>
      <td className={`truncate max-w-[200px]`}>
        {" "}
        {/*<div className="truncate overflow-hidden">{log.message}</div>*/}
        <div className="truncate overflow-hidden" title={log.message}>{log.message}
        </div>
      </td>
      <td>
        <Chip type="priority" value={log.priority || "low"} showPoint />
      </td>
      <td>
        <Chip
          type="status"
          value={
            (log.status == "unresolved"
              ? "Pending"
              : log.status == "solved"
              ? "Resolved"
              : log.status) || "Pending"
          }
        />
      </td>
      {userData.role != "user" && (
        <td>
          <Chip
            type="assignee"
            value={
              userOptions.find((u) => u.value === log.assigned_to)?.label ||
              log.assigned_to ||
              "Unassigned"
            }
          />
        </td>
      )}
      <td>{formatDate(log.created_at)}</td>
    </tr>
  );
};

export default LogRow;
