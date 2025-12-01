const variants = {
  primary: {
    base: "text-white bg-[#295ba2] hover:bg-[#244e8a] disabled:bg-[#C7D8F0] disabled:text-[#3974BE]",
  },
  secondary: {
    base: "text-black bg-white hover:bg-[#DBDBDB] disabled:bg-[#DBDBDB] text-[#74797F]",
  },
  tertiary: {
    base: "text-black bg-[#FAFAFA] hover:bg-[#DBDBDB] disabled:bg-[#DBDBDB] border border-[#DBDBDB]",
  },
  pagination: {
    base: "text-black bg-[#F0F2F5]",
    active: "text-white bg-[#295BA2]",
  },
  section: {
    base: "text-black",
    active: "bg-[#E3EBF6]",
  },
};
const justifyMap = {
  left: "justify-left",
  center: "justify-center",
  right: "justify-right",
};

const Button = ({
  onClick,
  disabled,
  active = true,
  children,
  variant = "primary",
  type = "button",
  align = "center",
  font = "font-normal"
}) => {
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`cursor-pointer ${font} rounded-md flex ${justifyMap[align]} 
w-full items-center
${active && v.active ? v.active : v.base} ${
        variant == "pagination" ? "px-[0.7rem] py-[0.2rem] h-full" : "p-2 px-5"
      }
disabled:cursor-not-allowed transition-colors duration-200`}
    >
      {children}
    </button>
  );
};

export default Button;
