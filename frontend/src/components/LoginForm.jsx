import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import RecoverPassword from "./RecoverPassword";
import Logo from "./Logo";

const loginUser = async (data) => {
  const response = await api.post(`/auth/login`, data);
  return response.data;
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remember, setRemember] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setSuccess("Login successful!");
      login(data.token, data.user.id, data.user, remember);

      setEmail("");
      setPassword("");

      setTimeout(() => {
        if (data.user.isFirstLogin) {
          navigate("/change-password-first");
        } else {
          navigate("/");
        }
      }, 1000);
    },
    onError: (error) => {
      setError("Login error: " + error.response?.data?.message);
      setPassword("");
    },
  });

  const handleSubmit = (e) => {
    if (forgotPassword) return;
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");
    setSuccess("");
    let error = false;

    if (!email.includes("@")) {
      setEmailError("Invalid email");
      error = true;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      error = true;
    }

    if (!error) {
      mutation.mutate({ email, password });
    }
  };

  return (
    <div className="flex flex-col py-2 items-center mt-8 w-full">
      {forgotPassword ? (
        <RecoverPassword setForgotPassword={setForgotPassword} />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-[83%] flex flex-col items-center"
        >
          <div className="w-[200px] -mb-10">
            <Logo showText orientation="vertical" iconHeight={55} />
          </div>
          <div className="flex flex-col items-center justify-center w-[85%] p-10 rounded-md gap-8 mt-2 ">
            <h2 className="text-2xl text-[#2A2A2A] w-full text-left font-bold mt-6 -mb-2">
              Log in
            </h2>
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col w-full gap-2 mb-10">
                <TextInput
                  label="Username"
                  id="email"
                  type="text"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                />
              </div>
              <div className="flex flex-col w-full gap-2 mb-1">
                <PasswordInput
                  label="Password"
                  id="password"
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                />
              </div>
              <div className="flex items-center w-full px-2">
                <input
                  type="checkbox"
                  checked={remember}
                  className="rounded-full mr-2 h-5 w-5"
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="text-sm text-[#737373]">Remember me</label>
              </div>
            </div>
            {mutation.isPending ? (
              <ClipLoader color="#36d7b7" size={20} />
            ) : success ? (
              success && <p className="text-green-500">{success}</p>
            ) : (
              <div className="flex flex-col items-center w-[40%] gap-4">
                <div className="w-[75%]">
                  <Button type="submit" disabled={!email || !password}>
                    Log in
                  </Button>
                </div>
                <span
                  onClick={() => setForgotPassword(true)}
                  className="text-[#737373] cursor-pointer text-sm"
                >
                  Forgot your password?
                </span>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
