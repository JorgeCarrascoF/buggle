import Accordion from "./Accordion";

const LogDescription = ({
  description = "There is no description for this log.",
  inactive = false,
}) => {
  return (
    <Accordion title="Details" inactive={inactive}>
      <p className="text-sm text-black">
        {description && description !== "error description"
          ? description
          : "No description available."}
      </p>
    </Accordion>
  );
};

export default LogDescription;
