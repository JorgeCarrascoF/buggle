import Icon from "@mdi/react";
import UserComment from "./UserComment";
import { mdiOpenInNew } from "@mdi/js";
import CommentInput from "./CommentInput";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "../queries/getComments";
import { ClipLoader } from "react-spinners";
import Accordion from "./Accordion";
import sortComments from "../utils/sortComments";
import { maxLimitInteger } from "../utils/maxLimitInteger";
import { Link } from "react-router-dom";

const LogComments = ({ logId, inactive }) => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?.id;

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", logId],
    queryFn: () => getComments(logId, { limit: maxLimitInteger }),
  });

  const sortedComments = sortComments(comments?.data || []).slice(0, 5);


  return (
    <Accordion title="Notes and comments" inactive={inactive}>
      <CommentInput logId={logId} inactive={inactive} />
      <div className="text-left ml-1 text-gray-500">
        {isLoading ? (
          <div className="w-full flex items-center justify-center">
            <ClipLoader color="#000000" size={30} />
          </div>
        ) : (
          <>
            {sortedComments.length > 0 ? (
              sortedComments.map((comment, idx) => (
                <div
                  className={`mx-12 ${
                    idx !== 4 && "border-b"
                  } border-[#DBDBDB] py-1`}
                  key={idx}
                >
                  <UserComment comment={comment} currentUserId={userId} />
                </div>
              ))
            ) : (
              <div className="ms-20 mt-5">
                There are no comments for this log.
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex w-fit place-self-end mb-2 mx-1">
        <Link
          to={`/dashboard/log/${logId}/comments`}
          className="px-4 py-3 flex items-center justify-left rounded-lg transition-colors duration-200"
        >
          <Icon path={mdiOpenInNew} size={1} />
        </Link>
      </div>
    </Accordion>
  );
};

export default LogComments;
