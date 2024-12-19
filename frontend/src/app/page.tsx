"use client";
import Link from "next/link";
import { features, mainUrl } from "./assets/data";
import { useEffect, useState } from "react";
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import axios from "axios";

export default function Home() {
  const [books, setBooks] = useState<Product[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(mainUrl + "get-books?limit=4");
        setBooks(data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  useEffect(() => {
    const counter = setInterval(() => {
      const currentDate = new Date();
      setSeconds(currentDate.getSeconds());
      setMinutes(currentDate.getMinutes());
      setHours(currentDate.getHours());
      setDays(currentDate.getDay());
    }, 1000);
    return () => {
      clearInterval(counter);
    };
  }, []);
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="h-[calc(100vh-74px)] center">
        <div className="text-white container px-4 text-center">
          <h1 className="text-[27px] mb-3">
            Welcome to out Shop You Will Find Your Targets Book Here
          </h1>
          <p style={{ lineHeight: 2 }} className="max-w-[750px] mx-auto">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="my-16">
        <div className="container grid gap-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          {features.map((feature) => (
            <div key={feature.title} className="col flex justify-center gap-4">
              <div className="image">
                <img
                  className="w-[70px]"
                  src={feature.image}
                  alt={feature.title}
                />
              </div>
              <div className="content">
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Banner Section */}
      <section id="banner" className="my-16">
        <div className="container grid gap-6 md:grid-cols-2 grid-cols-1">
          <div className="box overflow-hidden p-6 relative">
            <div className="content text-white">
              <p>$50.00</p>
              <h3 className="mb-1">
                Praise for <br />
                The Night Child
              </h3>
              <Link href="/Books" className="uppercase underline">
                shop now
              </Link>
            </div>
          </div>
          <div className="box overflow-hidden p-6 relative h-[300px]">
            <div className="content text-white">
              <p className="uppercase">specail offer</p>
              <h3 className="mb-1">
                Buy 3. Get <br />1 Free
              </h3>
              <Link href="/Books" className="uppercase underline">
                shop now
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Time Section */}
      <div id="time" className="my-16 py-16">
        <div className="container grid gap-4 md:grid-cols-2 grid-cols-1">
          <div className="col text-white">
            <h2>Start a new series - Up to 50% off</h2>
            <p className="my-6">
              we has the weekly promotion, keep up with us and you’ll get the
              best deal to get your loved stuff. Our design reflects the purity
              of contemporary forms for enduring appeal.
            </p>
            <div className="date mb-6 border-2 border-white">
              <div className="p-4">
                <h5>{days < 10 ? `0${days}` : days}</h5>
                <p>Days</p>
              </div>
              <div className="p-4">
                <h5>{hours < 10 ? `0${hours}` : hours}</h5>
                <p>Hours</p>
              </div>
              <div className="p-4">
                <h5>{minutes < 10 ? `0${minutes}` : minutes}</h5>
                <p>Min</p>
              </div>
              <div className="p-4">
                <h5>{seconds < 10 ? `0${seconds}` : seconds}</h5>
                <p>Sec</p>
              </div>
            </div>
            <Link
              href="/Books"
              className="border border-white py-3 px-8 block w-fit uppercase"
            >
              shop now
            </Link>
          </div>
          <div className="col">
            <img src="/slide-1.webp" className="mx-auto" alt="Book Image" />
          </div>
        </div>
      </div>
      {/* Top Sells */}
      <div id="top-sells" className="my-16">
        <div className="container">
          <h2 className="text-center mb-4 uppercase">Top Sells</h2>
          <div className="grid gap-4 md:grid-cols-4 grid-cols-1">
            {books.map((book) => (
              <ProductCard
                key={book._id}
                _id={book._id}
                author={book.author}
                category={book.category}
                description={book.description}
                image={book.image}
                price={book.price}
                quantity={book.quantity}
                title={book.title}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Testimonial Section */}
      <section id="testimonial" className="my-16 py-12 flex items-center">
        <div className="container text-center text-white">
          <figure>
            <img
              src="/me.jpg"
              className="w-[75px] mx-auto h-[75px] rounded-full"
              alt="My Image"
            />
            <figcaption>
              <p className="my-4 max-w-[550px] mx-auto leading-[2]">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Suscipit iure facilis, hic earum unde omnis facere dolor.
                Aliquam blanditiis molestias dolore sunt vitae iure, est nemo
                molestiae consectetur nihil quae.
              </p>
              <h4 className="uppercase">Ahmad Mayallo</h4>
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
