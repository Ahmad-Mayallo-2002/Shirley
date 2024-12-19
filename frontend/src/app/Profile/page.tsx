"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import { countryList, getToken, mainUrl } from "../assets/data";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type User = {
  username: string;
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
  const [image, setImage] = useState<string>(
    "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  );
  const [loading, setLoading] = useState(false);
  const { token, _id } = getToken();
  const handleChangeImage = (event: ChangeEvent) => {
    const file = event.target as HTMLInputElement;
    if (file.files) setImage(URL.createObjectURL(file.files[0]));
  };
  const onSubmit = async (data: User, event: any) => {
    const form = new FormData(event.target);
    try {
      setLoading(true);
      const { data } = await axios.patch(mainUrl + "update-user", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.msg, { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main id="update-user-data" className="center h-screen">
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
        </div>
        {/* Email */}
        <div>
          <input
            type="text"
            placeholder="Write Email"
            className="border-2"
            {...register("email", {
              pattern: {
                value: /^[A-Za-z][0-9]+@gmail\.com$/,
                message: "Email Must Contain At Least One Number",
              },
            })}
          />
        </div>
        {/* Country */}
        <div>
          <select
            className="border-2 outline-0 w-full py-2 px-4"
            {...register("country")}
          >
            <option value="">Select Country</option>
            {countryList.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
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
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </main>
  );
}
