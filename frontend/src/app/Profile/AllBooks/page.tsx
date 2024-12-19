"use client";
import { getToken, mainUrl } from "@/app/assets/data";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

type Book = {
  _id: string;
  title: string;
  description: string;
  price: number;
  author: string;
  quantity: number;
  image: string;
  category: string;
  publishedDate: Date;
};

export default function page() {
  const { token, _id } = getToken();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const handleDelete = async (id: string) => {
    try {
      const { data } = await axios.delete(mainUrl + `delete-book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      setBooks((prev) => prev.filter((book) => book._id !== id));
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.msg, { position: "top-left" });
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(mainUrl + "get-books");
        setBooks(data);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  return (
    <>
      <main id="books">
        <h2 className="mb-4">All Books</h2>
        {loading ? (
          <AiOutlineLoading3Quarters className="mt-[120px] mx-auto text-[120px] animate-spin text-greenColor" />
        ) : books.length ? (
          <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {books.map((book) => (
              <div key={book._id} className="border-2 shadow-lg">
                <div className="relative">
                  {!book.quantity && (
                    <div
                      className="absolute w-full p-4 text-center bg-red-500 text-white text-3xl top-1/2 left-1/2"
                      style={{ transform: "translate(-50%,-50%)" }}
                    >
                      Sold Out
                    </div>
                  )}
                  <img
                    src={book.image}
                    alt="Book Image"
                    className="h-[200px] w-full"
                  />
                </div>
                <div className="body grid gap-2 p-2">
                  <h4 className="min-h-[60px]">{book.title}</h4>
                  <p>Category: {book.category}</p>
                  <p>Price: {book.price}</p>
                  <p>Author: {book.author}</p>
                  <p>Quantity: {book.quantity}</p>
                </div>
                <div className="foot p-2 pt-0">
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="py-2 w-full text-center border-2 border-red-500 text-red-500 duration-200 hover:bg-red-500 hover:text-white"
                  >
                    Delete Book
                  </button>
                  <Link
                    href={`/Profile/UpdateBook/${book._id}`}
                    className="block special-button p-2 text-center w-full mt-2"
                  >
                    Update Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-3xl">No Book</p>
        )}
      </main>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
