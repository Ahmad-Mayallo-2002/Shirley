import { getToken, mainUrl } from "@/app/assets/data";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Logging } from "../Context/Context";

type User = {
  username: string;
  email: string;
  image: string;
  country: string;
};

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User>();
  const toggleDropdown = () => setIsOpen(!isOpen);
  const { token, _id } = getToken();
  const cookies = new Cookies();
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(mainUrl + `get-users/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            id: _id,
          },
        });
        setUserData(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token, _id]);
  return (
    <div className="relative inline-text-left">
      {loading ? (
        <AiOutlineLoading3Quarters
          className="animate-spin text-greenColor"
          fontSize={36}
        />
      ) : (
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center md:w-full w-fit"
        >
          <img
            src={userData?.image}
            className="w-[50px] h-[50px] rounded-full"
            alt="Personal Image"
          />
        </button>
      )}
      {isOpen && (
        <div className="absolute md:right-0 left-0 left-[initial] mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Username: {userData?.username}
            </p>
            <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Email: {userData?.email}
            </p>{" "}
            <p className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Country: {userData?.country}
            </p>
            <Link
              className="px-4 py-2 block text-sm text-gray-700 hover:bg-gray-100"
              href="/Profile"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
