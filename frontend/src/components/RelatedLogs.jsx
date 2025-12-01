import { getRelatedLogs } from "../queries/getRelatedLogs";
import { useQuery } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import RelatedLogsTable from "./RelatedLogsTable";
import Accordion from "./Accordion";

const RelatedLogs = ({ log, inactive = false }) => {
  const errorSignature = log.error_signature;
  const {
    data: relatedLogs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: () => getRelatedLogs({ error_signature: errorSignature }),
    queryKey: ["relatedLogs", errorSignature],
    enabled: !!errorSignature,
  });

  const noErrorSignature = !errorSignature;

  return (
    <Accordion title="Related Log" inactive={inactive}>
      <div className="pb-4overflow-x-auto">
        {!noErrorSignature ? (
          <div className="mt-4 w-[90%]">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <ClipLoader color="#000000" size={20} />
              </div>
            )}
            {isError && (
              <p className="text-left my-5 ml-3">
                Error fetching related logs: {error?.message}
              </p>
            )}
            {relatedLogs?.data.length === 0 && !isLoading && (
              <p className="text-left my-5 ml-3 text-gray-500">
                No related logs found.
              </p>
            )}
            {relatedLogs?.data.length > 0 && (
              <RelatedLogsTable relatedLogs={relatedLogs} />
            )}
          </div>
        ) : (
          <p className="text-left my-5 ml-3 text-gray-500">
            No related logs found.
          </p>
        )}
      </div>
    </Accordion>
  );
};

export default RelatedLogs;
