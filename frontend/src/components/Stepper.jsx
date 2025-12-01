const Step = ({ number, title, description }) => {
  return (
    <li className="mb-10 ml-6 flex items-center">
      {" "}
      <span className="absolute flex items-center justify-center w-[22px] h-[22px] bg-[#EDEDED] select-none rounded-full -left-3 ring-13 ring-white text-[#295ba2] font-bold text-sm">
        {" "}
        {number}{" "}
      </span>{" "}
      <div>
        {" "}
        <h3 className="font-semibold text-sm text-gray-800"> {title} </h3>{" "}
        <p className="text-gray-500 text-sm"> {description} </p>{" "}
      </div>{" "}
    </li>
  );
};

const Stepper = ({ steps }) => {
  return (
    <ol className="relative ml-6">
      {steps.map((step, index) => (
        <Step
          key={index}
          number={index + 1}
          title={step.title}
          description={step.description}
          color={step.color}
        />
      ))}
    </ol>
  );
};

export default Stepper;
