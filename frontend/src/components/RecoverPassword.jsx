import { useState } from "react";
import TextInput from "./TextInput";
import Button from "./Button";
import { useMutation } from "@tanstack/react-query";
import { recoverPassword } from "../queries/recoverPassword";
import { changeUserFirstLoginStatus } from "../queries/changeUserFirstLoginStatus";
import { useToast } from "../hooks/useToast";

const RecoverPassword = ({ setForgotPassword }) => {
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const mutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      setErrorMessage("");
      showToast(
        "A new password has been generated and sent to your email.",
        "success"
      );
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleRecover = () => {
    if (isEmailValid(email)) {
      mutation.mutate(email);
    } else {
      showToast("Please enter a valid email address.", "error");
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRecover();
      }}
      className="w-full flex flex-col items-center py-6"
    >
      <h1 className=" text-4xl font-semibold">Recover your password</h1>
      <div className="flex flex-col justify-center w-[75%] p-10 rounded-md gap-10 ">
        <TextInput
          label="Reset your password using your email"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          onChange={(e) => setEmail(e.target.value)}
          error={errorMessage}
        />
        <div className="w-[50%] self-center">
          <Button
            type="button"
            disabled={!email || !isEmailValid(email) || mutation.isLoading}
            onClick={handleRecover}
          >
            Send reset link
          </Button>
        </div>
        <span
          onClick={() => setForgotPassword(false)}
          className="cursor-pointer underline"
        >
          Back to login
        </span>
      </div>
    </form>
  );
};

export default RecoverPassword;
