import CreateLogForm from "../components/CreateLogForm";

const LogCreatePage = () => {
  return (
    <div className="mt-7 h-[90%]">
      <div className="flex flex-col text-left ms-2 mb-10">
        <h1 className="mb-2 text-[33px] font-bold">New Log</h1>
        <h1 className="ms-1 -mt-1 text-sm text-[#737373]">Manually Enter New Log</h1>
      </div>
      <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white h-[85%] mr-20 py-2 px-6">
        <CreateLogForm />
      </div>
    </div>
  );
};

export default LogCreatePage;