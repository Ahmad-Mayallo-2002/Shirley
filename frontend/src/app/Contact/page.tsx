import React from "react";
import { IconType } from "react-icons";
import { FaLocationArrow, FaMobile } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

type Info = {
  Icon: IconType;
  title: string;
};

export default function page() {
  const info: Info[] = [
    {
      Icon: FaLocationArrow,
      title: "Egypt, Dumyat",
    },
    {
      Icon: IoMdMail,
      title: "ahmadmayallo02@gmail.com",
    },
    {
      Icon: FaMobile,
      title: "+0201208943693",
    },
  ];
  return (
    <>
      <main id="contact" className="py-16">
        <div className="container">
          <h2 className="text-center uppercase text-[36px] mb-4">Contact Us</h2>
          <div className="grid mb-8 gap-4 md:grid-cols-2 grid-cols-1">
            <div className="col">
              <ul className="gap-6 grid">
                {info.map((value, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <value.Icon fontSize={30} />{" "}
                    <span className="text-xl">{value.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col">
              <form action="#" className="p-4 shadow-lg grid gap-4">
                <input
                  type="text"
                  placeholder="Write Your Name"
                  className="outline-0 border-2 py-2 px-4"
                />
                <input
                  type="text"
                  placeholder="Write Your Name"
                  className="outline-0 border-2 py-2 px-4"
                />
                <textarea
                  placeholder="Write Message"
                  className="h-[200px] border-2 py-2 px-4 resize-none outline-0"
                ></textarea>
                <button className="p-3 bg-transparent text-greenColor border-2 border-greenColor duration-300 hover:text-white hover:bg-greenColor">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d54493.85830344788!2d31.683904449999996!3d31.3902542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sar!2seg!4v1733827924954!5m2!1sar!2seg"
          height="450"
          className="w-full"
          loading="lazy"
        ></iframe>
      </main>
    </>
  );
}
