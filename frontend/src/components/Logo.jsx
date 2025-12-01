import LogoIsotipo from "../assets/Buggle_Isotipo.svg";
import LogoTipografia from "../assets/Buggle_tipografia_curvas.svg";

const Logo = ({
  showText = false,
  orientation = "horizontal",
  iconHeight = "8",
}) => {
  return (
    <div
      className={`flex ${
        orientation == "horizontal" ? "items-baseline" : "items-center"
      } ${orientation === "vertical" ? "flex-col" : "flex-row"}`}
    >
      <img
        src={LogoIsotipo}
        alt="Isotipo"
        style={{ height: `${iconHeight}px` }}
      />
      {showText && (
        <img
          src={LogoTipografia}
          alt="Tipografía"
          className={`pb-[1px] w-[70%] ${
            orientation === "vertical" ? "pt-2" : "ml-2"
          }`}
        />
      )}
    </div>
  );
};

export default Logo;
