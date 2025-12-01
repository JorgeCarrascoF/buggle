import { Link } from "react-router-dom";
import NavButton from "../components/NavButton";
import Icon from "@mdi/react";
import { mdiArrowRight } from "@mdi/js";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[100%] border border-[#DBDBDB] bg-white px-4 rounded-xl">
      <div className="w-full text-center flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 leading-snug w-fit right-3">
          Welcome back to Buggle, <br /> manage your logs easily
        </h1>
        <p className="text-gray-500 mb-10 text-sm md:text-xl">
          Here are your quick actions to get started today. <br />
          What would you like to do first?
        </p>
        <div className="space-y-3 mb-12 w-full flex flex-col items-center">
          <Link
            to="/dashboard/log/create"
            className="flex justify-between items-center w-[70%] border border-gray-300 rounded-md px-4 py-4 text-left hover:bg-gray-100 transition cursor-pointer"
          >
            <span className="flex my-1.5 mx-1.5">
              <span className="block font-medium text-gray-900 me-2.5 text-lg">
                Add a log
              </span>
              <span className="text-sm text-gray-500 mt-1.5">
                Create and add a new entry in seconds.
              </span>
            </span>
            <span className="text-gray-400 text-lg">
              <Icon path={mdiArrowRight} size={1} />
            </span>
          </Link>

          <Link
            to="/dashboard"
            className="flex justify-between items-center w-[70%] border border-gray-300 rounded-md px-4 py-4 text-left hover:bg-gray-100 transition cursor-pointer"
          >
            <span className="flex my-1.5 mx-1.5">
              <span className=" block font-medium text-gray-900 me-2.5 text-lg">
                View logs list
              </span>
              <span className="text-sm text-gray-500 mt-1.5">
                Access and review all your saved logs.
              </span>
            </span>
            <span className="text-gray-400 text-lg">
              <Icon path={mdiArrowRight} size={1} />
            </span>
          </Link>

          <Link
            to="/profile"
            className="flex justify-between items-center w-[70%] border border-gray-300 rounded-md px-4 py-4 text-left hover:bg-gray-100 transition cursor-pointer"
          >
            <span className="flex my-1.5 mx-1.5">
              <span className="block font-medium text-gray-900 me-2.5 text-lg">
                View my profile
              </span>
              <span className="text-sm text-gray-500 mt-1.5">
                Manage your account details and settings.
              </span>
            </span>
            <span className="text-gray-400 text-lg">
              <Icon path={mdiArrowRight} size={1} />
            </span>
          </Link>
        </div>

        <span className="text-[#737373] text-sm">
          Begin by creating a new log entry.
        </span>
        <div className="mt-6">
          <NavButton
            text="New log"
            route="/dashboard/log/create"
            variant="dark"
            font="font-light"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
