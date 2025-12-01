import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col justify-center items-center m-auto ">
      <div className="flex flex-col items-center rounded-lg border border-[#DBDBDB] bg-white w-[52%] 2xl:w-[35%] py-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
