import { useEffect, useState } from "react";
import Button from "./Button";
import PasswordInput from "./PasswordInput";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../queries/changePassword";
import { ClipLoader } from "react-spinners";
import Modal from "./Modal";
import Icon from "@mdi/react";
import { mdiCheckCircleOutline } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ChangePasswordForm = ({ setChangingPassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [validNewPassword, setValidNewPassword] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    const isValid =
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[!@#$%^&*]/.test(newPassword);
    setValidNewPassword(isValid);
  }, [newPassword]);

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      setMessage(data.msg);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      logout();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },

    onError: (error) => {
      setMessage(error.message);
    },
  });

  const passwordIsSafe = () => {
    return (
      newPassword.length >= 8 &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[!@#$%^&*]/.test(newPassword)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    mutation.mutate({ currentPassword, newPassword });
  };

  return (
    <div className="mt-15 2xl:mt-5 flex flex-col w-full h-full items-start justify-start">
      <h2 className="text-2xl font-semibold mb-10">Change password</h2>
      <form className="flex flex-col gap-5 w-[95%]" onSubmit={handleSubmit}>
        <div className="w-[70%]">
          <PasswordInput
            label="Current Password"
            placeholder={"Enter your current password"}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="w-[70%] mt-4">
          <PasswordInput
            label="New Password"
            placeholder={"Enter new password"}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="w-full ml-4 -mt-2 flex flex-col">
            <span
              className={`text-sm w-full text-left mt-0 mb-3 ${
                passwordIsSafe() ? "text-green-500" : "text-red-500"
              }`}
            >
              {newPassword &&
                (passwordIsSafe()
                  ? "✓ Secure password."
                  : "Please add all necessary character to create safe password:")}
            </span>
            <ul className="flex flex-col list-disc ml-5 gap-1 text-[#737373]">
              <li
                className={`text-sm w-full text-left ${
                  newPassword &&
                  (newPassword.length >= 8 ? "text-green-500" : "text-red-500")
                }`}
              >
                Minimum 8 characters
              </li>
              <li
                className={`text-sm w-full text-left ${
                  newPassword &&
                  (/[A-Z]/.test(newPassword)
                    ? "text-green-500"
                    : "text-red-500")
                }`}
              >
                At least 1 uppercase letter
              </li>
              <li
                className={`text-sm w-full text-left ${
                  newPassword &&
                  (/[0-9]/.test(newPassword)
                    ? "text-green-500"
                    : "text-red-500")
                }`}
              >
                At least 1 number
              </li>
              <li
                className={`text-sm w-full text-left ${
                  newPassword &&
                  (/[!@#$%^&*]/.test(newPassword)
                    ? "text-green-500"
                    : "text-red-500")
                }`}
              >
                At least 1 special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div className="w-[70%] mt-6">
          <PasswordInput
            label="Confirm New Password"
            placeholder={"Confirm new password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="w-full ml-4 -mt-2 flex flex-col">
          </div>
        </div>
        <div className="ml-auto flex mt-20 gap-7">
          {setChangingPassword && (
            <div className="w-[170px]">
              <Button
                variant="tertiary"
                onClick={() => setChangingPassword(false)}
              >
                Cancel
              </Button>
            </div>
          )}
          <div className="w-[170px]">
            <Button
              type="submit"
              disabled={newPassword !== confirmPassword || !validNewPassword}
            >
              Saved
            </Button>
          </div>
        </div>
      </form>
      {mutation.isLoading ? (
        <ClipLoader />
      ) : (
        message && (
          <div
            className={`mt-4 text-sm ${
              mutation.isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </div>
        )
      )}
      <Modal
        isOpen={success}
        onClose={() =>
          setChangingPassword ? setChangingPassword(false) : navigate("/")
        }
      >
        <div className="p-4 flex flex-col items-center">
          <Icon path={mdiCheckCircleOutline} size={2} color={"green"} />
          <h3 className="text-2xl text-black font-semibold mt-4">
            Password updated successfully
          </h3>
          <p className="text-sm text-[#737373] mt-3 mb-8">
            You can now log in with your new password.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ChangePasswordForm;
