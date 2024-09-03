"use client";

// components/SubmitBtn.tsx
import React from "react";

interface SubmitBtnProps {
  label: string;
  isSubmitting: boolean;
}

const SubmitBtn: React.FC<SubmitBtnProps> = ({ label, isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`disabled:bg-neutral-8 disabled:cursor-not-allowed mx-auto mt-10 flex gap-2 items-center font-semibold  justify-center rounded-md bg-primary-0 text-white w-full py-4 px-2 `}
    >
      {isSubmitting ? "Loading..." : label}
    </button>
  );
};

export default SubmitBtn;
