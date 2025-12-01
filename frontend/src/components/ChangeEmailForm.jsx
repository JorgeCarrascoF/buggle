import { useEffect, useState } from "react";
import Button from "./Button";
import { useMutation } from "@tanstack/react-query";
import { changeEmail } from "../queries/changeEmail";
import TextInput from "./TextInput";
import Modal from "./Modal";
import Icon from "@mdi/react";
import { mdiCheckCircleOutline } from "@mdi/js";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";

const ChangeEmailForm = ({ setChangingEmail }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [message, setMessage] = useState("");

  const [validNewEmail, setValidNewEmail] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const isValid =
      newEmail.length >= 5 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
    setValidNewEmail(isValid);
  }, [newEmail]);

  const mutation = useMutation({
    mutationFn: changeEmail,
    onSuccess: (data) => {
      setMessage(data.msg);
      setNewEmail("");
      setConfirmEmail("");
      let userData = localStorage.getItem("userData");
      userData = JSON.parse(userData);
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...userData, email: newEmail })
      );
      logout();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error) => {
      setMessage(error.message);
    },
  });

  const currentEmailMismatch = () => {
    return currentEmail !== userData?.email;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentEmail === newEmail){
      showToast("New email cannot be the same as current email", "error");
      return;
    }
    mutation.mutate({ newEmail });
  };

  return (
    <div className="p-10 flex flex-col w-full h-[90%] items-start justify-start pt-0 2xl:-mt-15 ms-10">
      <h2 className="text-2xl font-bold mb-10">Change Email</h2>
      <form
        className="flex flex-col gap-5 ml-0 w-[95%]"
        onSubmit={handleSubmit}
      >
        <div className="w-[70%]">
          <TextInput
            label="Current Email"
            placeholder={"Enter your current email"}
            onChange={(e) => setCurrentEmail(e.target.value)}
            error={
              currentEmail &&
              currentEmailMismatch() &&
              "Email does not match with this account's email"
            }
          />
        </div>
        <div className=" mt-10 w-[70%]">
          <TextInput
            label="New Email"
            placeholder={"Enter new email"}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <div className="w-full ml-4 mt-1 flex flex-col">
            <span
              className={`text-sm w-full text-left mt-0 ${
                !newEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)
                  ? "text-transparent"
                  : "text-red-500"
              }`}
            >
              Enter a valid email
            </span>
          </div>
        </div>
        <div className="mt-8 w-[70%]">
          <TextInput
            label="Confirm New Email"
            placeholder={"Confirm new email"}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
          <div className="w-full ml-4 mt-1 flex flex-col">
            <span
              className={`text-sm w-full text-left mt-0 ${
                !confirmEmail || confirmEmail === newEmail
                  ? "text-transparent"
                  : "text-red-500"
              }`}
            >
              Email addresses do not match
            </span>
          </div>
        </div>
        <div className="ml-auto flex mt-25 gap-4">
          <div className="w-[170px]">
            <Button variant="tertiary" onClick={() => setChangingEmail(false)}>
              Cancel
            </Button>
          </div>
          <div className="w-[170px]">
            <Button
              type="submit"
              variant="primary"
              disabled={
                !validNewEmail ||
                confirmEmail !== newEmail ||
                currentEmailMismatch()
              }
            >
              Saved
            </Button>
          </div>
        </div>
        <div
          className={`mt-4 text-sm text-red-500 ${
            mutation.isError ? "block" : "hidden"
          }`}
        >
          {message}
        </div>
      </form>

      <Modal
        isOpen={mutation.isSuccess}
        onClose={() => setChangingEmail(false)}
      >
        <div className="p-4 flex flex-col items-center gap-8">
          <Icon path={mdiCheckCircleOutline} size={4} color={"green"} />
          <h3 className="text-lg font-semibold text-[#008000]">
            Email updated successfully
          </h3>
          <p className="text-sm text-gray-600 mb-5">
            You can now log in using your new email address.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ChangeEmailForm;
