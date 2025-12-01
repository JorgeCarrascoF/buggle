import NavButton from "../components/NavButton";

function NotFound() {
  return (
    <div className="mb-4 text-center flex justify-center h-full w-full items-center flex-col">
      <h1 className="text-5xl font-bold">ERROR 404</h1>

      <p className="my-6 mb-7 text-[#737373] text-xl">
        The page you’re looking for doesn’t exist
      </p>
      <NavButton
        text="Back to home"
        route="/"
        font="font-light"
        variant="dark"
      />
    </div>
  );
}

export default NotFound;
