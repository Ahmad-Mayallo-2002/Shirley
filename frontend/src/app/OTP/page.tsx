"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";

type User = {
  OTP: string;
};

export default function page() {
  const router = useRouter();
  const cookies = new Cookies();
  const otp = cookies.get("OTP");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const onSubmit = async (data: User) => {
    try {
      if (data.OTP !== otp?.otp) {
        toast.error("Error OTP", { position: "top-left" });
        return;
      }
      cookies.remove("OTP");
      router.push("/ChangePassword");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main id="login" className="center h-screen">
      <form
        action="#"
        onSubmit={handleSubmit(onSubmit)}
        className="grid px-6 md:px-0 gap-4 max-w-[550px] w-full"
      >
        {/* OTP */}
        <div>
          <input
            type="text"
            placeholder="Write OTP Number"
            className="border-2"
            {...register("OTP", {
              required: "OTP is Required",
            })}
          />
          {errors.OTP?.message && (
            <p className="flex mt-4 items-center gap-2 text-red-500">
              <MdError fontSize={24} /> {errors.OTP.message}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <div>
          <button type="submit" className="special-button px-4 py-2 w-full">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </main>
  );
}
