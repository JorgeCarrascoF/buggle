import capitalizeWords from "../utils/capitalizeWords";

const stylesMap = {
  priority: {
    high: { text: "text-[#E51D1D]", bg: "bg-[#FFF1F1]", point: "bg-[#E51D1D]" },
    medium: {
      text: "text-[#F08401]",
      bg: "bg-[#FFFAE6]",
      point: "bg-[#F08401]",
    },
    low: { text: "text-[#358438]", bg: "bg-[#F3FAF3]", point: "bg-[#358438]" },
  },
  status: {
    pending: { text: "text-[#274673]", bg: "bg-[#E3EBF6]" },
    "in review": { text: "text-[#274673]", bg: "bg-[#EDEDED]" },
    resolved: { text: "text-[#E3EBF6]", bg: "bg-[#295BA2]" },
  },
  assignee: {
    text: "text-[#274673]",
    bg: "bg-[#FAFAFA]",
    border: "border-[#DBDBDB]",
  },
  environment: {
    text: "text-[#737373]",
    bg: "bg-[#FAFAFA]",
    border: "border-[#DBDBDB]",
  },
  userStatus: {
    active: {
      bg: "bg-[#295BA2]",
      text: "text-white",
    },
    inactive: {
      bg: "bg-[#EDEDED]",
      text: "text-[#274673]",
      border: "",
    },
  },
  suggestedUser: {
      bg: "bg-[#E3EBF6]",
      text: "text-[#295BA2]",
      border: "border-[#295BA2]",
  }
};
const chipWidth = {
  environment: "w-[7.5rem]",
  assignee: "w-[7.5rem] 2xl:w-[9rem]",
  status: "w-[7rem]",
  priority: "w-[6.438rem]",
  userStatus: "w-[7.3rem] 2xl:max-w-[6rem]",
  suggestedUser: "w-[5rem]"
};

const Chip = ({ type, value, showPoint }) => {
  const safeValue = (value || "").toLowerCase();
  const style =
    (stylesMap[type]?.[safeValue] || stylesMap[type] || stylesMap.assignee) ??
    {};
  return (
    <div
      className={`text-center ${
        chipWidth[type] || chipWidth.default
      } rounded-lg py-[3px] ${style.bg} ${style.text} ${style.border || ""} ${
        style.border && "border"
      }`}
    >
      <div
        className={`flex items-center ${
          showPoint ? "justify-start pl-5" : "justify-center"
        } gap-2 `}
      >
        {showPoint && style.point && (
          <div className={`w-2 h-2 rounded-full ${style.point}`}></div>
        )}
        <span
          className={`max-w-[12ch] text-sm -mb-[2px] 2xl:max-w-[18ch] truncate overflow-hidden`}
        >
          {capitalizeWords(value)}
        </span>
      </div>
    </div>
  );
};

export default Chip;
