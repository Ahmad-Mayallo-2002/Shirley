"use client";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import { links } from "@/app/assets/data";
import { usePathname } from "next/navigation";
import DropdownMenu from "../Dropdown/Dropdown";
import Cookies from "universal-cookie";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [client, setClient] = useState(false);
  const pathname = usePathname();
  const cookies = new Cookies();
  useEffect(() => {
    setClient(true);
  }, []);
  return (
    <nav className="min-h-[74px] bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container flex-wrap md:flex-nowrap mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <img src="/logo.avif" alt="Logo Image" width={150} />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <FaBars />
        </button>

        {/* Links */}
        <div
          className={`md:flex gap-4 mt-2 md:mt-0 w-full md:w-fit flex-col md:flex-row md:items-center ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`${
                pathname === link.href ? "text-greenColor" : "text-black"
              } duration-200 hover:text-greenColor block py-2 md:py-0 text-lg text-[18px]`}
            >
              {link.name}
            </Link>
          ))}
          {client && cookies.get("token") ? (
            <DropdownMenu />
          ) : (
            <>
              <Link
                href="/Login"
                className="text-[18px] w-fit bg-[#eeee] py-2 px-4 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/SignUp"
                className="text-[18px] w-fit bg-greenColor text-white py-2 px-4 rounded-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
