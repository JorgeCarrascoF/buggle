import NavButton from "../components/NavButton";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-[#D00416] mb-3">
        Unauthorized access
      </h1>
      <p className="text-2xl text-[#737373] mb-5 leading-relaxed">
        You do not have permission to access this page. <br />
        Please log in with an administrator account.
      </p>
      <NavButton
        text="Back to home"
        route="/"
        font="font-light"
        variant="dark"
      />
    </div>
  );
};

export default UnauthorizedPage;
