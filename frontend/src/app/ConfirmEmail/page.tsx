"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MdError } from "react-icons/md";
import { mainUrl } from "../assets/data";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Cookies from "universal-cookie";

type User = {
  email: string;
};

export default function page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const onSubmit = async (data: User) => {
    try {
      setLoading(true);
      const { data: result } = await axios.post(mainUrl + "send-email", data, {
        withCredentials: true,
      });
      cookies.set("email", data.email, { maxAge: 1000 * 900 });
      router.push("/OTP");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.msg, { position: "top-left" });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
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
            autoComplete="off"
            className="border-2"
            {...register("email", {
              required: "Email is Required",
            })}
          />
          {errors.email?.message && (
            <p className="flex mt-4 items-center gap-2 text-red-500">
              <MdError fontSize={24} /> {errors.email.message}
            </p>
          )}
        </div>
        {/* Submit Button */}
        <div>
          <button type="submit" className="special-button px-4 py-2 w-full">
            {loading ? (
              <AiOutlineLoading3Quarters className="text-[24px] mx-auto animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </main>
  );
}
