import { useState } from "react";
import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Accordion = ({
  title = "Accordion Title",
  children,
  inactive = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`w-full m-2 border border-[#DBDBDB] bg-white ${
        inactive ? "text-[#737373]" : "text-black"
      } rounded-lg`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 py-4 cursor-pointer flex justify-between items-center"
      >
        <h2 className="text-[18px] text-left font-semibold ml-2">{title}</h2>

        <Icon
          path={mdiChevronDown}
          size={1}
          className={`mr-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="border-t mx-8 border-[#DBDBDB]"
          >
            <div className="text-left my-5 mx-3 text-gray-500 leading-relaxed break-words">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
