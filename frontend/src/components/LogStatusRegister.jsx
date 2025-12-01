import { useQuery } from "@tanstack/react-query";
import getStatusRegister from "../queries/getStatusRegister";
import { maxLimitInteger } from "../utils/maxLimitInteger";
import StatusRegisterTable from "./StatusRegisterTable";
import Accordion from "./Accordion";

const LogStatusRegister = ({ logId, inactive = false }) => {

  const { data: statusRegister } = useQuery({
    queryFn: () => getStatusRegister(logId, { limit: maxLimitInteger }),
    queryKey: ["statusRegister", logId],
  });

  return (
    <Accordion title="Log History" inactive={inactive}>
      <div className="">
        {statusRegister?.data.length > 0 ? (
          <StatusRegisterTable statusRegister={statusRegister.data} />
        ) : (
          <div className="text-left my-5 ml-3 text-gray-500 leading-relaxed break-words">
            There are no status changes about this log.
          </div>
        )}
      </div>
    </Accordion>
  );
};

export default LogStatusRegister;
