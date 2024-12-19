import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex-col text-center px-4 h-[calc(100vh-200px)] center">
      <h1 className="md:text-[50px] text-[36px]">
        404 Error Page is Not Found
      </h1>
      <p className="mt-4 text-[24px]">
        Return To{" "}
        <Link href="/" className="text-greenColor">
          Home Page
        </Link>
      </p>
    </div>
  );
}
