import { getColorForName } from "../utils/getColorForName";
import { getInitials } from "../utils/getInitials";

const lightColors = ["#F3F6FC", "#E6EDF8", "#96B7E3"];

const UserIconVerySmall = ({ name = "Default User" }) => {
  const initials = getInitials(name);
  const bgColor = getColorForName(name);
  return (
    <div
      className={`rounded-full h-full flex items-center justify-center w-[30px] aspect-square`}
      style={{ backgroundColor: bgColor }}
    >
      <span
        className={`${
          lightColors.includes(bgColor) ? "text-[#1F365B]" : "text-white"
        }  font-bold select-none text-xs`}
      >
        {initials}
      </span>
    </div>
  );
};

export default UserIconVerySmall;
