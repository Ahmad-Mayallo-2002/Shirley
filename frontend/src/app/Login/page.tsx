"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import { mainUrl } from "../assets/data";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";

type User = {
  password: string;
  email: string;
};

export default function page() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const onSubmit = async (userData: User) => {
    try {
      setLoading(true);
      const { data } = await axios.post(mainUrl + "login", userData, {
        withCredentials: true,
      });
      toast.success(data.msg, { position: "top-left" });
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.msg, { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main id="login" className="center h-screen">
        <form
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          className="grid px-6 md:px-0 gap-4 max-w-[550px] w-full"
        >
          {/* Email */}
          <div>
            <input
              type="text"
              placeholder="Write Email"
              className="border-2"
              {...register("email", {
                required: "Email is Required",
                pattern: {
                  value: /^[A-Za-z]{5,20}[0-9]+@gmail\.com$/,
                  message: "Email Must Contain At Least One Number",
                },
              })}
            />

            {errors.email && (
              <p className="flex items-center text-red-500 gap-4 mt-2">
                <MdError fontSize={24} /> {errors.email.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Write Password"
              className="border-2"
              {...register("password", {
                required: "Password is Required",
                minLength: {
                  value: 9,
                  message: "Minimum Length is 9 Characters",
                },
                maxLength: {
                  value: 15,
                  message: "Maximum Length is 15 Characters",
                },
              })}
            />
            {errors.password && (
              <p className="flex items-center text-red-500 gap-4 mt-2">
                <MdError fontSize={24} /> {errors.password.message}
              </p>
            )}
          </div>
          {/* Submit Button */}
          <div>
            <button type="submit" className="special-button px-4 py-2 w-full">
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin mx-auto text-[24px]" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
          {/* Forgot Password */}
          <div>
            <p className="text-center">
              You Don't Remember Password ? &nbsp;
              <Link className="text-greenColor underline" href="/ConfirmEmail">
                Change Password
              </Link>
            </p>
          </div>
        </form>
      </main>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
