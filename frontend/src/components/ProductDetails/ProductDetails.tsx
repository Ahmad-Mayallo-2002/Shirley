"use client";
import { getToken, mainUrl } from "@/app/assets/data";
import { Product } from "@/components/ProductCard/ProductCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ProductDetails({ id }: { id: string }) {
  const { token, _id } = getToken();
  const [product, setProducts] = useState<Product>({
    price: 0,
    description: "",
    title: "",
    category: "",
    quantity: 0,
    image: "",
    _id: "",
  });
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState<number>(1);
  const handleIncrease = () => setAmount((prev) => ++prev);
  const handleDecrease = () => amount >= 2 && setAmount((prev) => --prev);
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(mainUrl + `get-books/${id}`);
        setProducts(data);
        setQuantity(data.quantity);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  const handleAddToFavorites = async (id: string) => {
    try {
      if (!quantity) {
        toast.error("Book is Sold Out", { position: "top-left" });
        return;
      }
      const { data } = await axios.post(
        mainUrl + `add-to-favorites/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: _id,
          },
        }
      );
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      toast.error(error.response.data.msg, { position: "top-left" });
      console.log(error);
    }
  };
  const handleAddToCart = async (id: string) => {
    try {
      if (!quantity) {
        toast.error("Book is Sold Out", { position: "top-left" });
        return;
      }
      const { data } = await axios.post(
        mainUrl + `add-to-cart/${id}`,
        {
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: _id,
          },
        }
      );
      setQuantity((prev) => prev - amount);
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.msg, { position: "top-left" });
    }
  };
  return (
    <>
      <main className="py-16">
        <div className="container grid md:grid-cols-2 grid-cols-1">
          {product && (
            <>
              <div className="border-2 md:border-b-2 md:border-e-0 border-b-0 p-4">
                {product.image && (
                  <img
                    src={product.image}
                    className="w-full h-[500px]"
                    alt="Product Image"
                  />
                )}
              </div>
              <div className="border-2 grid gap-4 p-4 text-xl">
                <h2 className="leading-[1.5]">{product.title}</h2>
                <p>Description: {product.description}</p>
                <p>Category: {product.category}</p>
                <p>Quantity: {quantity}</p>
                <p>Price: {product.price}$</p>
                <div className="flex w-fit items-center">
                  <button
                    onClick={handleDecrease}
                    className="px-4 py-2 border-2"
                  >
                    -
                  </button>
                  <p className="px-4 py-2 border-2 border-s-0 border-e-0">
                    {amount}
                  </p>
                  <button
                    onClick={handleIncrease}
                    className="px-4 py-2 border-2"
                  >
                    +
                  </button>
                </div>
                <p>Total Price: {(product.price * amount).toFixed(2)}</p>
                <div className="flex w-fit">
                  <button
                    onClick={() => handleAddToCart(id)}
                    className="px-4 border-2 border-e-0"
                  >
                    Add To Cart
                  </button>
                  <button
                    onClick={() => handleAddToFavorites(id)}
                    className="px-4 border-2"
                  >
                    Add To Favorites
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
