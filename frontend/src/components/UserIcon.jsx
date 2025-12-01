import { getColorForName } from "../utils/getColorForName";
import { getInitials } from "../utils/getInitials";

const lightColors = ["#F3F6FC", "#E6EDF8", "#96B7E3"];
const UserIcon = ({ name = "Default User" }) => {
  const initials = getInitials(name);
  const bgColor = getColorForName(name);
  return (
    <div
      className={`rounded-full h-full w-full flex items-center justify-center`}
      style={{ fontSize: "60%", backgroundColor: bgColor }}
    >
      <span
        className={`${
          lightColors.includes(bgColor) ? "text-[#1F365B]" : "text-white"
        }  select-none text-5xl`}
      >
        {initials}
      </span>
    </div>
  );
};

export default UserIcon;
