import UserIcon from "../components/UserIcon";
import Button from "../components/Button";
import { useState } from "react";
import PersonalInformation from "../components/PersonalInformation";
import ChangePasswordForm from "../components/ChangePasswordForm";

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [changingPassword, setChangingPassword] = useState(false);

  return (
    <div className=" w-full -ml-4 h-[90%]">
      <div className="flex items-center justify-between mb-4 mt-8">
        <h1 className="text-2xl font-bold ml-6">Edit profile</h1>
      </div>
      <div className="flex items-center justify-between m-2.5 rounded-2xl h-[90%]">
        <div className="border border-gray-200 bg-white rounded-2xl h-full w-[27%] flex flex-col items-center justify-start gap-16 py-10">
          <div className="w-full flex items-center mt-4 flex-col">
            <div className=" rounded-full w-[30%] aspect-square flex items-center justify-center">
              <UserIcon name={userData?.fullName} />
            </div>
            <div className="text-center mt-10 flex flex-col items-center gap-1">
              <p className="text-2xl font-semibold">
                {userData?.fullName || "Default Username"}
              </p>
              <p className="text-sm text-black">{userData?.email}</p>
              <p className="text-md text-black font-bold">{userData?.role}</p>
            </div>
          </div>
          <div className="flex flex-col w-[85%] gap-3 mt-8 items-center">
            <Button
              active={!changingPassword}
              variant="section"
              align="left"
              onClick={() => setChangingPassword(false)}
            >
              Account information
            </Button>
            <Button
              active={changingPassword}
              variant="section"
              align="left"
              onClick={() => setChangingPassword(true)}
            >
              Change password
            </Button>
          </div>
        </div>
        <div className="border border-gray-200 bg-white rounded-2xl -mr-2 h-full w-[72%]">
          {changingPassword ? (
            <div className="ms-15">
              <ChangePasswordForm setChangingPassword={setChangingPassword} />
            </div>
          ) : (
            <PersonalInformation data={userData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
