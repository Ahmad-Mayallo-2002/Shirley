import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function page() {
  return (
    <div className="min-h-[calc(100vh-56px)] center">
      <AiOutlineLoading3Quarters className="text-[160px] text-greenColor animate-spin" />
    </div>
  );
}
