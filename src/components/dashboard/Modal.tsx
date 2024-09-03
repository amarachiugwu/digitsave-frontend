import React from "react";

interface ModalProps {
  status: React.ReactNode;
  title: string;
  subtitle: string;
  button: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ status, title, subtitle, button }) => {
  if (!status) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-tertiary-7 px-8 py-20 rounded-lg w-[400px] max-w-sm text-center">
          {/* status */}
          <div className="flex justify-center mb-8">
            {status}
          </div>

          {/* Title and Subtitle */}
          <h2 className="text-xl text-white font-semibold mb-4">{title}</h2>
          <p className="text-neutral-6 mb-4">{subtitle}</p>

          <div className="mt-4">{button}</div>

        </div>
      </div>
    </>
  );
};

export default Modal;
