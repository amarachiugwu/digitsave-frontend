import React from "react";
import { PlusIcon } from "../../icon";
import { motion, AnimatePresence } from "framer-motion";
type FaqProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

const FAQ: React.FC<FaqProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="w-full mx-auto pt-4 text-neutral-12">
      <div className="border p-6 text-neutral-3 rounded-lg">
        <div className="flex justify-between item-center">
          <p className="font-medium sm:text-xl text-base">{question}</p>
          <span
            className="cursor-pointer hover:bg-white rounded-full transition-all duration-300 ease-in-out"
            onClick={() => onToggle()}
          >
            <PlusIcon />
          </span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              exit={{ height: 0, opacity: 0, transition: { duration: 0.6 } }}
              animate={{
                height: "100%",
                opacity: 1,
                transition: { duration: 0.9 },
              }}
              initial={{ height: 0 }}
              className={`overflow-hidden transition-all duration-300 ease-in-out `}
            >
              <div className="pt-3 text-sm sm:text-base">{answer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FAQ;
