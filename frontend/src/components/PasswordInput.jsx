import { useState } from "react";
import Icon from "@mdi/react";
import { mdiEye } from "@mdi/js";
import { mdiEyeOff } from "@mdi/js";

export default function PasswordInput({
  label,
  value,
  onChange,
  name,
  placeholder,
  error,
}) {
  let [inputType, setInputType] = useState("password");
  const id = `password-input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-md text-left font-medium mb-1"
        >
          {label}
        </label>
      )}
      <div
        className={`w-full px-3 py-3 relative border placeholder:text-sm rounded-md bg-[#FAFAFA] focus:outline-none focus:ring ${
          error ? "border-red-500" : "border-[#DBDBDB]"
        }`}
      >
        <input
          id={id}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `error-${id}` : undefined}
          className={`w-full border-0 focus:ring-0 bg-transparent p-0 focus:border-gray-300 focus:outline-none placeholder:text-sm `}
        />
        <button
          onClick={() => {
            inputType === "password"
              ? setInputType("text")
              : setInputType("password");
          }}
          type="button"
          className="absolute right-6 cursor-pointer top-1/2 transform -translate-y-1/2"
        >
          {inputType === "password" ? (
            <Icon path={mdiEye} size={1} />
          ) : (
            <Icon path={mdiEyeOff} size={1} />
          )}
        </button>
      </div>
      {error && (
        <p
          id={`error-${id}`}
          className="text-sm text-red-500 w-full text-left mt-1 ml-4"
        >
          {error}
        </p>
      )}
    </div>
  );
}
