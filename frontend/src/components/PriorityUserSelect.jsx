import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../queries/getUsers";
import { maxLimitInteger } from "../utils/maxLimitInteger";
import { getSuggestedUsers } from "../queries/getSuggestedUsers";
import Select from "react-select";
// eslint-disable-next-line no-unused-vars
import { components } from "react-select";
import Chip from "./Chip";

const UserOption = (props) => (
  <components.Option {...props}>
    <div className="text-left w-full flex align-center justify-between">
      <span className="w-[100%] truncate">{props.data.label}</span>
      {props.data.isSuggested && (
        <div className=" font-semibold text-[10px] text-blue-500">
          <Chip type="suggestedUser" value={"suggested"} />
        </div>
      )}
    </div>
  </components.Option>
);

const PriorityUserSelect = ({ label, log, isInactive, handleAssignedChange, selectedUser }) => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      getUsers({ page: 1, limit: maxLimitInteger, isActive: "true" }),
  });

  const { data: suggestedUsers } = useQuery({
    queryKey: ["suggestedUsers", log.error_signature],
    queryFn: () => getSuggestedUsers({ error_signature: log.error_signature }),
    enabled: !!log.error_signature,
  });

  const suggestedIds = suggestedUsers?.suggestions?.map((u) => u.userId) || [];

  const suggested = [];
  const normal = [];

  users?.data?.forEach((u) => {
    const option = {
      value: u.id,
      label: u.username,
      isSuggested: suggestedIds.includes(u.id),
    };
    if (option.isSuggested) suggested.push(option);
    else normal.push(option);
  });

  const userOptions = [...suggested, ...normal];

  return (
    <div className="w-full flex flex-col">
      {label && (<span className="mb-1 w-full text-left">{label}</span>)}
    <Select
      options={userOptions}
      value={selectedUser || userOptions.find((u) => u.value === log.assigned_to) || null}
      onChange={handleAssignedChange}
      isSearchable
      className="w-[264px] cursor-pointer"
      isDisabled={isInactive}
      components={{ Option: UserOption }}
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
          color: "black",
          textAlign: "left",
        }),
        placeholder: (provided) => ({
          ...provided,
          color: "#737373",
          textAlign: "left",
        }),
      }}
    />
    </div>
  );
};

export default PriorityUserSelect;
