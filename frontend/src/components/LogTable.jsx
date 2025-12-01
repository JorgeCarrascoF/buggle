import LogRow from "./LogRow";

export default function LogTable({ data, onRowClick }) {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const columns = [
    { key: "id", label: "ID", width: "w-[8rem]" },
    { key: "environment", label: "Environment", width: "w-[9.063rem]" },
    { key: "message", label: "Error title", width: "w-[10rem]" },
    { key: "priority", label: "Priority", width: "w-[8rem]" },
    { key: "status", label: "Status", width: "w-[8rem]" },
  ];

  if (userData.role == "admin" || userData.role == "superadmin") {
    columns.push({ key: "assignee", label: "Assignee", width: "w-[9rem]" });
  }

  columns.push({ key: "date", label: "Date", width: "w-[8.375rem]" });

  return (
    <div className="flex flex-col w-full h-full border border-gray-200 rounded-md overflow-hidden">
      <div className="flex-1 w-full overflow-y-auto">
        <table className="min-w-max table-fixed w-full">
          <thead className="bg-[#fafafa]">
            <tr className="[&>th]:px-4 [&>th]:py-2 [&>th]:text-left [&>th]:font-medium [&>th]:text-sm [&>th]:border-b [&>th]:border-gray-200">
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className={`${col.width ?? ""} ${
                    i === 0 ? "rounded-tl-md" : ""
                  } ${i === columns.length - 1 ? "rounded-tr-md" : ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <LogRow key={row.id} log={row} onRowClick={onRowClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
