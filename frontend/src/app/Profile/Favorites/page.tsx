"use client";
import { getToken, mainUrl } from "@/app/assets/data";
import { Product } from "@/components/ProductCard/ProductCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

export default function page() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { token, _id } = getToken();
  const [loading, setLoading] = useState<boolean>(false);
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(mainUrl + "get-user-favorite", {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      setFavorites(data.items);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const handleRemove = async (id: string) => {
    try {
      const { data } = await axios.delete(
        mainUrl + `delete-from-favorites/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: _id,
          },
        }
      );
      toast.success(data.msg, { position: "top-left" });
      getData();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.msg, { position: "top-left" });
    }
  };
  return (
    <>
      <h2 className="mb-4">Favorites List</h2>
      {loading ? (
        <AiOutlineLoading3Quarters className="text-greenColor animate-spin mt-[120px] mx-auto text-[120px]" />
      ) : (
        <>
          {" "}
          {!favorites.length ? (
            <p className="text-3xl">Favorites List is Empty</p>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
              {favorites?.map((book, index) => (
                <div className="card border-2" key={index}>
                  {book.image && (
                    <img
                      src={book?.image}
                      alt="Book Image"
                      className="h-[200px] w-full"
                    />
                  )}
                  <div className="body grid gap-2 p-4">
                    <h4 className="text-[18px]">{book.title}</h4>
                    <p>Price: {book.price}$</p>
                    <button
                      onClick={() => handleRemove(book._id)}
                      className="duration-200 hover:text-white hover:bg-red-500 border-2 h-[40px] text-center w-full border-red-500 text-red-500"
                    >
                      Remove From Favorites
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
