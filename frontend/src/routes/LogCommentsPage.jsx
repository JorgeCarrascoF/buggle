import { useParams } from "react-router-dom";
import NavButton from "../components/NavButton";
import Icon from "@mdi/react";
import AllLogComments from "../components/AllLogComments";
import { mdiArrowLeft } from "@mdi/js";

<Icon path={mdiArrowLeft} size={1} />;

const LogCommentsPage = () => {
  const { id: logId } = useParams();

  return (
    <div className="w-[90%]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Log comments</h1>
        <div className="flex">
          <NavButton
            text="Return to log"
            route={`/dashboard/log/${logId}`}
            variant="dark"
            icon={<Icon path={mdiArrowLeft} size={1} />}
          />
        </div>
      </div>
      <div className="flex flex-col items-center m-2.5">
        <AllLogComments logId={logId} />
      </div>
    </div>
  );
};

export default LogCommentsPage;
