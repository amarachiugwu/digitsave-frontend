import React from "react";

interface ModalProps {
  isOpen?: boolean;
  status?: React.ReactNode;
  title?: string;
  subtitle?: string;
  button?: React.ReactNode;
  centerBg?: boolean;
  onCloseModal?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  status,
  isOpen = true,
  title,
  subtitle,
  button,
  centerBg = true,
  onCloseModal,
}) => {
  if (!status) return null;

  return (
    <>
      <div
        className={`${
          isOpen ? "fixed" : "hidden"
        } inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-30`}
        onClick={onCloseModal}
      >
        <div
          className={`${
            centerBg ? "bg-tertiary-7" : "bg-transparent"
          } px-8 py-20 rounded-lg w-[400px] max-w-sm text-center`}
        >
          {/* status */}
          <div className="flex justify-center mb-8">{status}</div>

          {/* Title and Subtitle */}
          <h2 className="text-xl text-white font-semibold mb-4">{title}</h2>
          <p className={`${centerBg ? "text-neutral-6" : "text-white"} mb-4`}>
            {subtitle}
          </p>

          <div className="mt-4">{button}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
