"use client";
import React, { useEffect, useState } from "react";
import {
  FaCartShopping,
  FaHeart,
  FaHouse,
  FaBookMedical,
  FaBook,
  FaUsers,
  FaCartPlus,
  FaBorderAll,
} from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbLogout } from "react-icons/tb";
import Cookies from "universal-cookie";
import { getToken } from "@/app/assets/data";
import { IconType } from "react-icons";

type Links = {
  name: string;
  path: string;
  icon: IconType;
};

const links: Links[] = [
  {
    name: "My Home",
    path: "/Profile",
    icon: FaHouse,
  },
  {
    name: "My Favorites",
    path: "/Profile/Favorites",
    icon: FaHeart,
  },
  {
    name: "My Cart",
    path: "/Profile/Cart",
    icon: FaCartShopping,
  },
  {
    name: "My Order",
    path: "/Profile/Order",
    icon: AiFillProduct,
  },
];

const adminLinks: Links[] = [
  {
    name: "Add Book",
    path: "/Profile/AddBook",
    icon: FaBookMedical,
  },
  {
    name: "All Books",
    path: "/Profile/AllBooks",
    icon: FaBook,
  },
  {
    name: "All Users",
    path: "/Profile/AllUsers",
    icon: FaUsers,
  },
  {
    name: "Users Orders",
    path: "/Profile/UsersOrders",
    icon: FaBorderAll,
  },
];

const arrayFunction = (
  role: string,
  arrayOne: Links[],
  arrayTwo: Links[]
): Links[] => {
  const finalArray = role === "admin" ? [...arrayTwo, ...arrayOne] : arrayOne;
  return finalArray;
};

export default function ProfileSidebar() {
  const pathname = usePathname();
  const cookies = new Cookies();
  const { role } = getToken();
  const [isClient, setIsClient] = useState(false);
  const finalArray = arrayFunction(role, adminLinks, links);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient)
    return (
      <aside className="p-4 border-e-2">
        <ul className="grid gap-4">
          {finalArray.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`flex items-center justify-center lg:justify-start lg:gap-x-2 text-xl ${
                  pathname === link.path && "text-greenColor"
                } hover:text-greenColor duration-200`}
              >
                <link.icon className="text-2xl lg:text-xl" />
                <span className="hidden lg:inline">{link.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/"
          onClick={() => cookies.remove("token")}
          className="flex items-center lg:px-4 justify-center lg:justify-start gap-2 mt-4 block text-center py-2 border-2 border-red-600 text-red-600 hover:text-white hover:bg-red-600 duration-200"
        >
          <TbLogout fontSize={24} />
          <span className="lg:inline hidden">Logout</span>
        </Link>
      </aside>
    );
}
