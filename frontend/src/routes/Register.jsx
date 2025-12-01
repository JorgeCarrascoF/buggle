import RegisterForm from "../components/RegisterForm";

const Register = () => {
  return (
    <div className="h-[90%] mt-8 -ml-6">
      <div className="flex flex-col text-left ml-5 mb-10">
        <h1 className="mb-4 text-[32px] font-semibold">Add new user</h1>
        <span className="text-sm text-[#737373]">Start By Filling In The User's Basic Information.</span>
      </div>
      <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white h-[90%] py-3 px-6 mr-10">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
