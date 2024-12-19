"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import Cookies from "universal-cookie";
import { mainUrl } from "../assets/data";

type User = {
  password: string;
  confirmPassword: string;
};

export default function page() {
  const [errorMessage, setErrorMessage] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  const email = cookies.get("email");
  console.log(email);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const onSubmit = async (data: User) => {
    try {
      if (data.password !== data.confirmPassword) {
        setErrorMessage(true);
        return;
      } else {
        const { data: result } = await axios.patch(
          mainUrl + "update-password",
          {
            ...data,
            email: email,
          }
        );
        cookies.remove("email");
        console.log(result);
        router.push("/Login");
      }
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
              onChange: () => setErrorMessage(false),
            })}
          />

          {errors.password && (
            <p className="flex items-center text-red-500 gap-4 mt-2">
              <MdError fontSize={24} /> {errors.password.message}
            </p>
          )}
        </div>
        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className="border-2"
            {...register("confirmPassword", {
              required: "Password is Required",
              minLength: {
                value: 9,
                message: "Minimum Length is 9 Characters",
              },
              maxLength: {
                value: 15,
                message: "Maximum Length is 15 Characters",
              },
              onChange: () => setErrorMessage(false),
            })}
          />
          {errors.confirmPassword && (
            <p className="flex items-center text-red-500 gap-4 mt-2">
              <MdError fontSize={24} /> {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {errorMessage && (
          <p className="flex items-center text-red-500 gap-4 mt-2">
            <MdError fontSize={24} /> Passwords Are Not Equal
          </p>
        )}
        {/* Submit Button */}
        <div>
          <button type="submit" className="special-button px-4 py-2 w-full">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
