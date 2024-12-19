"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ProductCard, { Product } from "@/components/ProductCard/ProductCard";
import { categories, mainUrl } from "../assets/data";
import axios from "axios";

export default function page() {
  const [categoryValue, setCategoryValue] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>();
  // Books
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          mainUrl + `get-books?search=${categoryValue}`
        );
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    getData();
  }, [categoryValue]);
  // Handle Filter
  const handleFilter = (category: string) => {
    if (category === "all") {
      setCategoryValue("all");
      setProducts(products); // Show all products
    } else {
      setCategoryValue(category);
      setProducts(products?.filter((product) => product.category === category));
    }
    console.log(categoryValue);
  };
  return (
    <>
      <main id="books">
        <div className="bg-[#f6f6f6] p-[55px] mb-6">
          <p className="text-center">
            <Link href="/" className="hover:text-greenColor">
              Home
            </Link>{" "}
            / Books
          </p>
        </div>
        <div className="container">
          <div className="my-4 flex flex-wrap gap-4">
            <button
              className={`px-4 py-2 special-button ${
                categoryValue === "all" && "!bg-greenColor !text-white"
              }`}
              value="all"
              onClick={() => handleFilter("all")}
            >
              All
            </button>
            {categories &&
              categories.map((category) => (
                <button
                  value={category}
                  key={category}
                  className={`px-4 py-2 special-button ${
                    categoryValue === category && "!bg-greenColor !text-white"
                  }`}
                  onClick={(event) => handleFilter(category)}
                >
                  {category}
                </button>
              ))}
          </div>
          <div className="col p-4 border-2 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {products &&
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  _id={product._id}
                  image={product.image}
                  category={product.category}
                  title={product.title}
                  price={product.price}
                  quantity={product.quantity}
                />
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
