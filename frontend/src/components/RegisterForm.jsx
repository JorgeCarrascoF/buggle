import { useEffect, useMemo, useState } from "react";
import { registerUser } from "../queries/createUser";
import { useMutation } from "@tanstack/react-query";
import { ClipLoader } from "react-spinners";
import Icon from "@mdi/react";
import { mdiCheckCircleOutline } from "@mdi/js";
import Button from "./Button";
import Modal from "./Modal";
import UserIcon from "./UserIcon";
import TextInput from "./TextInput";
import PasswordInput from "./PasswordInput";
import SelectInput from "./SelectInput";

const RegisterForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    username: "",
    domain: "",
    password: "",
    roleId: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [responseError, setResponseError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  const isButtonDisabled = useMemo(() => {
    return !(
      form.firstName &&
      form.lastName &&
      form.displayName &&
      form.username &&
      form.roleId &&
      form.password
    );
  }, [form]);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      setForm({
        firstName: "",
        lastName: "",
        displayName: "",
        username: "",
        domain: "",
        password: "",
        roleId: "",
        role: "",
      });
      setResponseError("");
      setErrors({});
      setSuccess(true);
    },
    onError: (error) => {
      console.error("Error:", error);
      const jsonError = JSON.parse(error.request.response);
      setResponseError(jsonError.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(form.firstName))
      newErrors.firstName = "2-50 characters, letters and spaces only";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!/^[A-Za-zÀ-ÿ\s]{2,50}$/.test(form.lastName))
      newErrors.lastName = "2-50 characters, letters and spaces only";
    if (form.displayName.length < 5)
      newErrors.displayName = "Display name must be at least 5 characters long";
    if (!form.username) newErrors.username = "Email is required";
    if (!form.domain.includes("@")) newErrors.domain = "Invalid email domain";
    if (!form.roleId) newErrors.roleId = "Role is required";
    if (!form.password || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(form.password))
      newErrors.password =
        "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(form.password))
      newErrors.password = "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(form.password))
      newErrors.password =
        "Password must contain at least one special symbol (!@#$%^&*)";
    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    mutation.mutate(form);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-10 w-full mt-3 h-full px-4 py-5"
      >
        <div className="col-span-2 -mb-8">
          <div className="w-20 h-20 ">
            <UserIcon name="B" />
          </div>
        </div>

        <TextInput
          label="First name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Enter user's name"
          error={errors.firstName}
        />

        <TextInput
          label="Last name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Enter user's last name"
          error={errors.lastName}
        />

        <TextInput
          label="Username"
          name="username"
          value={form.username}
          onChange={(e) => {
            handleChange(e);
            setForm((prev) => ({ ...prev, displayName: e.target.value }));
          }}
          placeholder="Enter user's email"
          error={errors.username}
        />
        <TextInput
          label="Domain"
          name="domain"
          value={form.domain}
          onChange={handleChange}
          placeholder="buggle.com"
          error={errors.domain}
        />
        <div>
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter a password"
            error={errors.password}
          />
          {errors.password && (
            <ul className=" text-sm text-[#737373] -mt-2 list-disc list-inside text-left ml-4">
              <li>Minimum 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character (!@#$%&*)</li>
            </ul>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-left">
            Role
          </label>
          <SelectInput
            value={form.roleId}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, roleId: e.target.value }));
            }}
            colorizeOnActive={false}
            options={[
              { value: "688abe5c6ad4e846fbdb0189", label: "Admin" },
              { value: "688e3fa51825b4d54f064ccc", label: "Dev" },
            ]}
            placeholder="Select role"
            isDisabled={mutation.isPending}
          />
          {errors.roleId && (
            <p className="text-red-500 w-full text-left ml-4 text-sm mt-1">
              {errors.roleId}
            </p>
          )}
        </div>

        {responseError && (
          <div className="col-span-2">
            <p className="text-red-500 text-md mt-1">{responseError}</p>
          </div>
        )}
        <div className="col-span-2 flex justify-end items-center mt-4">
          {mutation.isPending ? (
            <ClipLoader color="#36d7b7" />
          ) : (
            <div className="flex gap-4">
              <div className="w-[10.5rem]">
                <Button
                  variant="tertiary"
                  type="button"
                  onClick={() =>
                    setForm({
                      firstName: "",
                      lastName: "",
                      displayName: "",
                      username: "",
                      domain: "",
                      password: "",
                      roleId: "",
                      role: "",
                    })
                  }
                >
                  Cancel
                </Button>
              </div>
              <div className="w-[10.5rem]">
                <Button type="submit" disabled={isButtonDisabled}>
                  Register
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
      <Modal isOpen={success} onClose={() => setSuccess(false)}>
        <div className="h-full w-full px-4 flex flex-col items-center justify-center">
          <Icon path={mdiCheckCircleOutline} size={2} color={"green"} />
          <span className="text-2xl text-black font-semibold m-2">
            Registration completed successfully
          </span>
          <span className="mb-6 px-4 text-[#737373]">
            The user has been successfully created. An email has been sent to
            the newly created user with a link to verify their account before
            they can access the platform.
          </span>
        </div>
      </Modal>
    </>
  );
};

export default RegisterForm;
