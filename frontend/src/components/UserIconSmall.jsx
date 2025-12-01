import { getColorForName } from "../utils/getColorForName";
import { getInitials } from "../utils/getInitials";

const lightColors = ["#F3F6FC", "#E6EDF8", "#96B7E3"];
const UserIconSmall = ({ name = "Default User" }) => {
  const initials = getInitials(name);
  const bgColor = getColorForName(name);
  return (
    <div
      className={`rounded-full h-full flex items-center justify-center w-[3.125rem] aspect-square`}
      style={{ backgroundColor: bgColor }}
    >
      <span
        className={`${
          lightColors.includes(bgColor) ? "text-[#1F365B]" : "text-white"
        } font-bold select-none text-xl`}
      >
        {initials}
      </span>
    </div>
  );
};

export default UserIconSmall;
