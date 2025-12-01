import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createLog } from "../queries/createLog";
import Button from "./Button";
import { getUsers } from "../queries/getUsers";
import { maxLimitInteger } from "../utils/maxLimitInteger";
import SelectInput from "./SelectInput";
import Select from "react-select";
import Modal from "./Modal";
import Icon from "@mdi/react";
import { mdiCheckCircleOutline } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";

export default function CreateLogForm() {
  const [log, setLog] = useState({});
  const [labelCount, setLabelCount] = useState(0);
  const [labelMessageCount, setLabelMessageCount] = useState(0);
  const [message, setMessage] = useState("");
  const [logCreated, setLogCreated] = useState(false);

  const { showToast } = useToast();

  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers({ page: 1, limit: maxLimitInteger }),
  });

  useEffect(() => {
    let timer;
    if (logCreated) {
      timer = setTimeout(() => {
        setLogCreated(false);
        navigate("/dashboard");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [logCreated]);

  const userOptions =
    users?.data?.map((u) => ({
      value: u.id,
      label: u.username,
    })) || [];

  const mutation = useMutation({
    mutationFn: (newLog) => createLog(newLog),
    onSuccess: () => {
      setLogCreated(true);
    },
    onError: (error) => {
      if (error.response.status === 409) {
        showToast(
          "This log entry already exists and has been updated",
          "info"
        );
      } else {
        setMessage("Error creating log");
      }
    },
  });

  const clearFields = () => {
    setLog({});
    setLabelCount(0);
    setLabelMessageCount(0);
    setMessage("");
  };

  const isButtonDisabled = useMemo(() => {
    return !(
      log.message &&
      log.message.length >= 5 &&
      log.description &&
      log.description.length >= 100 &&
      (userData.role == "user" || log.assigned_to) &&
      log.priority &&
      log.environment
    );
  }, [log, userData.role]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!log.status) log.status = "unresolved";
    if (!log.type) log.error_type = "error";
    else log.error_type = log.type;
    mutation.mutate(log);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full flex flex-col mt-10 justify-center"
    >
      <label className="block mb-2 font-medium text-left">Error Message*</label>
      <div className="flex justify-between items-start w-[80%] gap-4 mb-10">
        <div className="w-[62%] flex flex-col">
          <div className="relative flex flex-col w-full">
            <input
              placeholder="Type error message..."
              className={`border w-full border-gray-300 h-[56px] rounded-lg px-3 py-2 text-sm ${
                !log.message && "bg-[#fafafa]"
              }`}
              value={log.message || ""}
              maxLength={100}
              minLength={5}
              onChange={(e) => {
                setLog({ ...log, message: e.target.value });
                setLabelMessageCount(e.target.value.length);
              }}
            />
            <span className="absolute -bottom-5 right-3 text-xs text-gray-400">
              {labelMessageCount}/100
            </span>
          </div>
        </div>
        <div className="w-[214px] 2xl:w-[20rem]">
          <SelectInput
            colorizeOnActive={false}
            placeholder="Status"
            options={[
              { value: "unresolved", label: "Pending", default: true },
              { value: "in review", label: "In Review" },
              { value: "solved", label: "Resolved" },
            ]}
            onChange={(e) => setLog({ ...log, status: e.target.value })}
            value={log.status || "unresolved"}
          />
        </div>
      </div>

      <label className="block mb-2 font-medium mt-6 text-left">Details</label>
      <div className="flex justify-between  w-[82%] gap-4 mb-10">
        <div className="relative flex flex-col w-[60%]">
          <textarea
            placeholder="Add more information..."
            className={`border rounded-lg border-gray-300 px-3 py-2 text-sm w-full h-[134px] resize-none ${
              !log.description && "bg-[#fafafa]"
            }`}
            maxLength={5000}
            minLength={100}
            onChange={(e) => {
              setLog({ ...log, description: e.target.value });
              setLabelCount(e.target.value.length);
            }}
            value={log.description || ""}
          />
          <span className="absolute -bottom-5 right-3 text-xs text-gray-400">
            {labelCount}/5000
          </span>
        </div>

        <div className="w-[30%]">
          <SelectInput
            colorizeOnActive={false}
            options={[
              { value: "info", label: "Info" },
              { value: "warning", label: "Warning" },
              { value: "error", label: "Error" },
            ]}
            placeholder="Error type*"
            onChange={(e) => setLog({ ...log, type: e.target.value })}
            value={log.type || ""}
          />
        </div>
      </div>

      {/* Tercera fila */}

      <div className="flex justify-between w-[85%] mt-10">
        <div className="flex items-center justify-between w-[58%]">
          {userData.role !== "user" && (
            <div className="w-[56%] flex flex-col">
              <Select
                options={userOptions}
                value={
                  userOptions.find((u) => u.value === log.assigned_to) || null
                }
                onChange={(e) =>
                  setLog({ ...log, assigned_to: e ? e.value : null })
                }
                isSearchable
                placeholder="Select user*"
                className={`w-full`}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderRadius: "8px",
                    borderColor: state.isFocused ? "#295ba2" : "#d1d5db",
                    backgroundColor: "#ffffff",
                    color: "black",
                    cursor: "pointer",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                    cursor: "pointer",
                  }),
                  option: (provided, state) => ({
                    backgroundColor: state.isFocused ? "#e3ebf6" : "#ffffff",
                    padding: 8,
                    paddingLeft: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 10,
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    paddingRight: 5,
                  }),
                  indicatorSeparator: () => ({
                    display: "none",
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "#737373",
                    textAlign: "left",
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "#737373",
                    textAlign: "left",
                  }),
                }}
                isDisabled={mutation.isLoading || userData.role == "user"}
              />
            </div>
          )}
          <div className="w-[40%] flex flex-col">
            <SelectInput
              colorizeOnActive={false}
              options={[
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
              placeholder="Priority*"
              onChange={(e) => setLog({ ...log, priority: e.target.value })}
              value={log.priority || ""}
            />
          </div>
        </div>
        <div className="h-full w-[32.5%] flex flex-col">
          <SelectInput
            colorizeOnActive={false}
            options={[
              { value: "production", label: "Production" },
              { value: "development", label: "Development" },
              { value: "testing", label: "Testing" },
            ]}
            placeholder="Set environment*"
            onChange={(e) => setLog({ ...log, environment: e.target.value })}
            value={log.environment || ""}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-15 w-[85%] mt-auto mb-11 ml-[5px]">
        <div className="w-[145px]">
          <Button
            type="button"
            variant="tertiary"
            disabled={
              !(
                log.message ||
                log.description ||
                log.assigned_to ||
                log.priority ||
                log.environment ||
                log.status ||
                log.type
              )
            }
            onClick={clearFields}
          >
            Cancel
          </Button>
        </div>
        <div className="w-[131px]">
          <Button type="submit" disabled={isButtonDisabled}>
            Save
          </Button>
        </div>
      </div>
      <Modal isOpen={logCreated} onClose={() => setLogCreated(false)}>
        <div className="flex flex-col items-center p-8">
          <Icon
            path={mdiCheckCircleOutline}
            size={1.5}
            className="text-green-500 mb-4"
          />
          <h2 className="text-2xl font-semibold mb-4">
            Log created successfully
          </h2>
          <span className="text-[16px]">
            You can now view it in the log list.
          </span>
        </div>
      </Modal>
      {message && (
        <p
          className={`text-sm ${
            mutation.isSuccess ? "text-green-600" : "text-red-600"
          } mt-4`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
