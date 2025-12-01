import { useState } from "react";
import Icon from "@mdi/react";
import { mdiPencil } from "@mdi/js";
import Button from "./Button";
import TextInput from "./TextInput";
import ChangeEmailForm from "./ChangeEmailForm";

const PersonalInformation = ({ data }) => {
  const fullName = data?.fullName || "Default Name";

  const [editingEmail, setEditingEmail] = useState(false);

  return (
    <div className="p-2 px-3 w-full flex flex-col items-center mt-18">
      {editingEmail ? (
        <ChangeEmailForm setChangingEmail={setEditingEmail} />
      ) : (
        <>
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-2xl ml-11 text-left w-full font-bold mb-4">
              Account Information
            </h2>
            <div className="w-[80px] flex items-center gap-1 cursor-pointer hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 -mb-15 mr-10">
              <Button
                variant="primary"
                onClick={() => {
                  setEditingEmail(true);
                }}
              >
                <div className="mr-2">
                  <Icon path={mdiPencil} size={0.9} />
                </div>
                Edit
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-between items-center p-6 px-6 ml-10 mb-0">
            <div className="mb-4 flex justify-start items-start flex-col w-[44%]">
              <label className="block font-semibold mb-2">First name</label>
              <p className="text-sm  border p-4 text-left w-full rounded-lg text-[#737373] border-[#DBDBDB]">
                {fullName.split(" ")[0] || "Default Name"}
              </p>
            </div>
            <div className="mb-4 flex justify-start items-start flex-col w-[44%] me-9">
              <label className="block font-semibold mb-2">Last name</label>
              <p className="text-sm  border p-4 text-left w-full rounded-lg text-[#737373] border-[#DBDBDB]">
                {fullName.split(" ").slice(1).join(" ") || "Default Name"}
              </p>
            </div>
          </div>
          <div className="w-[90%] flex justify-between items-end mb-4">
            <div className="mb-4 flex justify-start items-start flex-col mt-3 w-[47%]">
              <div className="w-full ml-2 text-left">
                <label className="block font-medium mb-2">
                  Email
                </label>
                <p className="text-sm  border p-4 text-left w-full rounded-lg bg-[#FAFAFA] text-[#737373] border-[#DBDBDB]">
                  {data?.email || "Default Email"}
                </p>
              </div>
            </div>
          </div>{" "}
        </>
      )}
    </div>
  );
};

export default PersonalInformation;
