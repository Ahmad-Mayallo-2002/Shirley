import Link from "next/link";
import React from "react";
import { IoIosSend } from "react-icons/io";

type FooterLink = {
  name: string;
  path: string;
};

const links: FooterLink[] = [
  {
    name: "Facebook",
    path: "http://facebook.com",
  },
  {
    name: "Twitter",
    path: "http://twitter.com",
  },
  {
    name: "Linkedin",
    path: "http://linkedin.com",
  },
  {
    name: "Instagram",
    path: "http://instagram.com",
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="foot-1 py-12">
        <div className="container grid gap-3 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <div className="col">
            <Link href="/">
              <img src="/logo.avif" alt="Logo Image" width={150} />
            </Link>
            <p className="my-6">
              Subscribe to our newsleter, Enter your emil address
            </p>
            <form action="#" className="flex items-center">
              <input
                type="text"
                className="w-full py-2 px-3 border border-black outline-0"
                placeholder="Write Email"
              />
              <button
                type="submit"
                className="bg-black text-white self-stretch p-2 text-2xl"
              >
                <IoIosSend />
              </button>
            </form>
          </div>
          <div className="col">
            <h3 className="mb-3">Account</h3>
            <ul className="grid gap-4">
              <li>
                <Link href="/Login">Login</Link>
              </li>
              <li>
                <Link href="/SignUp">Register</Link>
              </li>
              <li>
                <Link href="/Profile">My Account</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h3 className="mb-3">Footer Menu</h3>
            <ul className="grid gap-4">
              <li>
                <Link href="/">Search</Link>
              </li>
              <li>
                <Link href="/Contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/Books">Books</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h3 className="mb-3">About Store</h3>
            <address>Egypt, Dumyat</address>
            <address>
              Phone: +0201208943693 <br />
              Email: ahmadmayallo02@gmail.com
            </address>
          </div>
        </div>
      </div>
      <div className="foot-2 p-4 border-t-2">
        <div className="container flex items-center justify-between lg:flex-row flex-col gap-y-4">
          <ul className="flex gap-4 text-gray-500">
            {links.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="hover:underline">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-gray-500">Copyright &copy; All Right Reserved</p>
          <div className="image">
            <img src="/visa.avif" alt="Payment Image" />
          </div>
        </div>
      </div>
    </footer>
  );
}
