import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

const Log = ({ log }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="px-2 py-4 rounded-md text-sm cursor-pointer hover:bg-gray-100 transition-all duration-200"
      onClick={() => navigate(`/dashboard/log/${log.id}`)}
    >
      <td className="px-3 my-2">
        <span className="px-2 py-1 bg-gray-100 rounded-4xl">{log.project}</span>
      </td>
      <td className="px-3 py-2">{log.type}</td>
      <td className="px-3 py-2">{log.status}</td>
      <td className="px-3 py-2">{log.platform}</td>
      <td className="px-3 py-2">{log.filename}</td>
      <td className="px-3 py-2">{log.function}</td>
      <td className="px-3 py-2">
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
            log.priority === "high"
              ? "bg-red-100 text-red-800"
              : log.priority === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {log.priority}
        </span>
      </td>
      <td className="px-3 py-2">{log.count}</td>
      <td className="px-3 py-2">{formatDate(log.firstSeen)}</td>
      <td className="px-3 py-2">{formatDate(log.lastSeen)}</td>
      <td className="px-3 py-2">
        <a
          href={log.linkSentry}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Ver
        </a>
      </td>
    </tr>
  );
};

export default Log;
