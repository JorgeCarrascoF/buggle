import Chip from "./Chip";

const RelatedLogRow = ({ log, onClick }) => {
  return (
    <tr
      className="h-[72px] cursor-pointer border-t border-t-gray-200 hover:bg-gray-50"
      onClick={() => onClick(log.id)}
    >
      <td className=" text-left text-sm px-3 truncate">{log.id}</td>
      <td className="">
        <div className="w-[90%] flex justify-center">
          <Chip
            type={"status"}
            value={
              log.status == "unresolved"
                ? "Pending"
                : log.status == "solved"
                ? "Resolved"
                : log.status
            }
          />{" "}
        </div>
      </td>
      <td className="text-left px-4 truncate text-sm">{log.message}</td>
      <td className="">
        <div className="flex justify-center">
          <Chip type={"environment"} value={log.environment} />
        </div>
      </td>
    </tr>
  );
};

export default RelatedLogRow;
