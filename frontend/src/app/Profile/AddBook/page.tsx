"use client";
import { categories, getToken, mainUrl } from "@/app/assets/data";
import axios from "axios";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

type Book = {
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
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Book>();
  const handleImageChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };
  const onSubmit = async (bookData: Book, event: any) => {
    try {
      setLoading(true);
      const form = new FormData(event.target);
      const { data } = await axios.post(mainUrl + "add-book", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      toast.error(error.response.data.msg, { position: "top-left" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <main id="add-book">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action="#"
          className="grid gap-2"
        >
          {/* Image */}
          <div className="flex flex-col image">
            {!selectedImage ? (
              <label
                htmlFor="fileInput"
                className="flex items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 cursor-pointer bg-gray-100 hover:bg-gray-200"
              >
                <span className="text-gray-500">Choose Image</span>
              </label>
            ) : (
              <div className="relative w-full h-80">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="object-cover w-full h-full rounded"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => setSelectedImage("")}
                >
                  Remove
                </button>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              className="hidden"
              {...register("image", {
                onChange: handleImageChange,
                required: "Image is Required",
              })}
            />
            {errors.image?.message && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} /> {errors.image?.message}
              </p>
            )}
          </div>
          {/* Title */}
          <div className="title">
            <input
              type="text"
              className="outline-0 py-2 px-4 border-2 w-full"
              placeholder="Write Book Title"
              autoComplete="off"
              {...register("title", { required: "Title is Required" })}
            />
            {errors.title && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} /> {errors.title.message}
              </p>
            )}
          </div>
          {/* Author */}
          <div className="author">
            <input
              type="text"
              className="outline-0 py-2 px-4 border-2 w-full"
              placeholder="Write Book Author Name"
              autoComplete="off"
              {...register("author", { required: "Author is Required" })}
            />
            {errors.author && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} /> {errors.author.message}
              </p>
            )}
          </div>
          {/* Published Date */}
          <div className="publishedDate">
            <input
              type="date"
              className="outline-0 py-2 px-4 border-2 w-full"
              placeholder="Write Book Author Name"
              autoComplete="off"
              {...register("publishedDate", {
                required: "Published Date is Required",
              })}
            />
            {errors.publishedDate && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} /> {errors.publishedDate.message}
              </p>
            )}
          </div>
          {/* Price */}
          <div className="price">
            <input
              type="text"
              className="outline-0 py-2 px-4 border-2 w-full"
              placeholder="Write Book Price"
              autoComplete="off"
              {...register("price", { required: "Price is Required" })}
            />
            {errors.price && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} /> {errors.price.message}
              </p>
            )}
          </div>
          {/* Quantity */}
          <div className="quantity">
            <input
              type="text"
              className="outline-0 py-2 px-4 border-2 w-full"
              placeholder="Write Book Quantity"
              autoComplete="off"
              {...register("quantity", { required: "Quantity is Required" })}
            />
            {errors.quantity && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} />
                {errors.quantity.message}
              </p>
            )}
          </div>
          {/* Category */}
          <div className="category">
            <select
              className="outline-0 py-2 px-4 border-2 w-full"
              {...register("category", { required: "Category is Required" })}
            >
              <option value="">Choose Book Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} /> {errors.category.message}
              </p>
            )}
          </div>
          {/* Description */}
          <div className="description">
            <textarea
              placeholder="Write Book Description"
              className="h-80 flex resize-none outline-0 py-2 px-4 border-2 w-full"
              autoComplete="off"
              {...register("description", {
                required: "Description is Required",
              })}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 flex items-center gap-3">
                <MdError fontSize={24} />
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Button Submit */}
          <div>
            <button
              type="submit"
              className="mt-0 special-button w-full py-2 text-center"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-3xl mx-auto" />
              ) : (
                "Add Book"
              )}
            </button>
          </div>
        </form>
      </main>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
