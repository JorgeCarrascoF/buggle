import { useEffect, useState } from "react";
import Button from "./Button";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiCreation } from "@mdi/js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLogReport } from "../queries/getLogReport";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { ClipLoader } from "react-spinners";
import { createLogReport } from "../queries/createLogReport";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const LogAISuggestion = ({ log, inactive = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [report, setReport] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: logReport,
    isLoading: isLoadingLogReport,
    isSuccess: isSuccessLogReport,
  } = useQuery({
    queryKey: ["logReport", log.id],
    queryFn: () => getLogReport(log.id),
  });

  const createLogReportMutation = useMutation({
    mutationFn: createLogReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logReport", log.id] });
    },
    onError: (error) => {
      console.error("Error creating log report:", error);
    },
  });

  useEffect(() => {
    if (isSuccessLogReport && logReport?.result?.report) {
      setReport(logReport?.result?.report);
    }
  }, [isSuccessLogReport, logReport]);

  useEffect(() => {
    setLoadingReport(createLogReportMutation.isLoading);
  }, [createLogReportMutation.isLoading]);

  return (
    <div
      className={`w-full m-2 border border-[#DBDBDB] bg-white ${
        inactive ? "text-[#737373]" : "text-black"
      } rounded-lg`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 py-4 cursor-pointer flex justify-between items-center"
      >
        <h2 className="text-[18px] text-left font-semibold ml-2">
          Automated support with AI
        </h2>

        {isLoadingLogReport ? (
          <div className="mr-4">
            <ClipLoader size={15} />
          </div>
        ) : logReport?.result ? (
          <Icon
            path={mdiChevronDown}
            size={1}
            className={`mr-3 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        ) : (
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setLoadingReport(true);
                createLogReportMutation.mutate({ logId: log.id });
              }}
              // disabled={inactive}
              disabled={true}
            >
              {loadingReport ? (
                <ClipLoader color="white" size={15} />
              ) : (
                <div className="flex">
                  <Icon path={mdiCreation} size={1} className="mr-3" />
                  {inactive
                    ? "Not suitable for AI report"
                    : "Generate suggestion with AI"}
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="border-t mx-8 border-[#DBDBDB] overflow-hidden"
          >
            <div className="text-left my-5 pb-5 px-10 prose min-w-full prose-code:text-[16px]">
              {inactive ? (
                <span className="text-[#737373]">
                  This log is not suitable for AI reports
                </span>
              ) : report ? (
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {report}
                </ReactMarkdown>
              ) : (
                <span className="text-[#737373]">
                  There is no report generated for this log.
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogAISuggestion;
