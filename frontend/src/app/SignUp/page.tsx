"use client";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import { countryList, mainUrl } from "../assets/data";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type User = {
  username: string;
  password: string;
  email: string;
  image: string;
  country: string;
};

export default function page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>(
    "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  );
  const handleChangeImage = (event: ChangeEvent) => {
    const file = event.target as HTMLInputElement;
    if (file.files) setImage(URL.createObjectURL(file.files[0]));
  };
  const onSubmit = async (_userData: User, event: any) => {
    const form = new FormData(event.target);
    try {
      setLoading(true);
      const { data } = await axios.post(mainUrl + "sign-up", form);
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main id="sign-up" className="center h-screen">
        <form
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          className="grid px-6 md:px-0 gap-4 max-w-[550px] w-full"
        >
          {/* Image */}
          <label htmlFor="image" className="cursor-pointer w-fit mx-auto">
            <img
              src={image}
              className="w-[80px] h-[80px] rounded-full"
              alt="User Image"
            />
            <input
              type="file"
              hidden
              id="image"
              {...register("image", { onChange: handleChangeImage })}
            />
          </label>
          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Write Username"
              className="border-2"
              {...register("username", {
                required: "Username is Required",
                minLength: {
                  value: 5,
                  message: "Minimum Length is 5 Characters",
                },
                maxLength: {
                  value: 15,
                  message: "Maximum Length is 15 Characters",
                },
              })}
            />
            {errors.username && (
              <p className="flex items-center text-red-500 gap-4 mt-2">
                <MdError fontSize={24} /> {errors.username.message}
              </p>
            )}
          </div>
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
          {/* Country */}
          <div>
            <select
              className="border-2 !text-[#9ca3af] w-full py-2 px-4"
              {...register("country")}
            >
              <option value="">Select Country</option>
              {countryList.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="flex items-center text-red-500 gap-4 mt-2">
                <MdError fontSize={24} /> {errors.country.message}
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
          <div>
            <button type="submit" className="special-button px-4 py-2 w-full">
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin mx-auto text-[24px]" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </main>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
