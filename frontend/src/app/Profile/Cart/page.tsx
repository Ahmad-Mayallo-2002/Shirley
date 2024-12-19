"use client";
import { getToken, mainUrl } from "@/app/assets/data";
import { Product } from "@/components/ProductCard/ProductCard";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdError } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

type Cart = {
  amount: number;
  book: Product;
};

type CreditCardDetails = {
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  cardHolderName: string;
};

type PaypalDetails = {
  payerId: string;
  paymentId: string;
  payerEmail: string;
};

type Order = {
  items: Array<{ book: string; amount: number }>;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  creditCardDetails?: CreditCardDetails;
  paypalDetails?: PaypalDetails;
};

export default function page() {
  const { token, _id } = getToken();
  const [products, setProducts] = useState<Cart[]>();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [payment, setPayment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Order>();
  const getData = async () => {
    try {
      setLoadingPage(true);
      const { data } = await axios.get(mainUrl + "get-user-cart", {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      setProducts(data.items);
      let price = 0;
      for (let i = 0; i < data.items.length; i++) {
        price += data.items[i].amount * data.items[i].book.price;
      }
      setTotalPrice(price);
    } catch (error) {
      setLoadingPage(false);
      console.log(error);
    } finally {
      setLoadingPage(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const handleRemove = async (id: string) => {
    try {
      const { data } = await axios.delete(mainUrl + `remove-from-cart/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      getData();
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      toast.error(error.response.data.msg, { position: "top-left" });
      console.log(error);
    }
  };
  const handleSelectPaymentMethod = (event: ChangeEvent) => {
    const element = event.currentTarget as HTMLSelectElement;
    setPayment(element.value);
  };
  const onSubmit = async (userData: Order) => {
    try {
      setLoading(true);
      userData.items = [];
      userData.totalPrice = Number(totalPrice.toFixed(2));
      products?.forEach((book) =>
        userData?.items?.push({ amount: book.amount, book: book.book._id })
      );
      const { data } = await axios.post(mainUrl + "add-order", userData, {
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
      <h2 className="mb-4">My Cart</h2>
      {loadingPage ? (
        <AiOutlineLoading3Quarters className="text-greenColor animate-spin mt-[120px] mx-auto text-[120px]" />
      ) : (
        <>
          {" "}
          {products?.length ? (
            <>
              <div className="lg:w-full w-[calc(100vw-80px-4rem)] overflow-x-auto">
                <table className="table-auto lg:w-full w-[300%] border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">
                        Image
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Title
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Price
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Category
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Author
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Amount
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((value, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          <img
                            src={value.book.image}
                            alt="Product"
                            className="h-[100px] w-[75px] mx-auto"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {value.book.title}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {value.book.price}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {value.book.category}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {value.book.author}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {value.amount}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => handleRemove(value.book._id)}
                            className="duration-200 hover:text-white hover:bg-red-500 border-2 py-2 text-center w-full border-red-500 text-red-500"
                          >
                            Delete From Cart
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td colSpan={6} className="font-bold border px-4 py-2">
                        Total Price:
                      </td>
                      <td className="font-bold border px-4 py-2 text-center">
                        {totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <form action="#" onSubmit={handleSubmit(onSubmit)}>
                <div className="address my-4">
                  <input
                    type="text"
                    placeholder="Write Your Address"
                    className="outline-0 py-2 px-3 border-2 w-full"
                    autoComplete="off"
                    {...register("shippingAddress", {
                      required: "Address is Required",
                    })}
                  />
                  {errors.shippingAddress && (
                    <p className="flex items-center text-red-500 gap-4 mt-2">
                      <MdError fontSize={24} /> {errors.shippingAddress.message}
                    </p>
                  )}
                </div>
                <div className="payment-method">
                  <div className="box">
                    <select
                      {...register("paymentMethod", {
                        onChange: handleSelectPaymentMethod,
                        required: "Payment Method is Required",
                      })}
                      className="border-2 py-2 px-3 outline-0 w-full block"
                    >
                      <option value="">Choose Payment Method</option>
                      <option value="cash">Cash</option>
                      <option value="paypal">Paypal</option>
                      <option value="credit card">Credit Card</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} /> {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Credit Cart */}
                <div
                  className={`my-4 credit-card-details grid gap-4 ${
                    payment !== "credit card" && "hidden"
                  }`}
                >
                  <div className="box">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Credit Card Number"
                      className="border-2 w-full py-2 px-3 outline-0"
                      {...register("creditCardDetails.cardNumber", {
                        required: {
                          value: payment === "credit card",
                          message: "Credit Card Number is Required",
                        },
                      })}
                    />
                    {errors.creditCardDetails?.cardNumber && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} />{" "}
                        {errors.creditCardDetails?.cardNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="box">
                    <input
                      type="text"
                      className="border-2 w-full py-2 px-3 outline-0"
                      placeholder="Card Expiry"
                      autoComplete="off"
                      {...register("creditCardDetails.cardExpiry", {
                        required: {
                          value: payment === "credit card",
                          message: "Credit Card Expiry Date is Required",
                        },
                      })}
                    />
                    {errors.creditCardDetails?.cardExpiry && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} />{" "}
                        {errors.creditCardDetails?.cardExpiry.message}
                      </p>
                    )}
                  </div>
                  <div className="box">
                    <input
                      type="text"
                      className="border-2 w-full py-2 px-3 outline-0"
                      placeholder="Card CVV"
                      autoComplete="off"
                      {...register("creditCardDetails.cardCVV", {
                        required: {
                          value: payment === "credit card",
                          message: "Credit Card CVV is Required",
                        },
                      })}
                    />
                    {errors.creditCardDetails?.cardCVV && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} />{" "}
                        {errors.creditCardDetails?.cardCVV.message}
                      </p>
                    )}
                  </div>
                  <div className="box">
                    <input
                      type="text"
                      className="border-2 w-full py-2 px-3 outline-0"
                      placeholder="Card Holder Name"
                      autoComplete="off"
                      {...register("creditCardDetails.cardHolderName", {
                        required: {
                          value: payment === "credit card",
                          message: "Credit Card Holder Name is Required",
                        },
                      })}
                    />
                    {errors.creditCardDetails?.cardHolderName && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} />{" "}
                        {errors.creditCardDetails?.cardHolderName.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* Paypal */}
                <div
                  className={`mt-4 paypal-details grid gap-4 ${
                    payment !== "paypal" && "hidden"
                  }`}
                >
                  <div className="box">
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="PayerId"
                      className="border-2 w-full py-2 px-3 outline-0"
                      {...register("paypalDetails.payerId", {
                        required: {
                          value: payment === "paypal",
                          message: "Paypal Payer Id is Required",
                        },
                      })}
                    />
                    {errors.paypalDetails?.payerId && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} />{" "}
                        {errors.paypalDetails?.payerId.message}
                      </p>
                    )}
                  </div>
                  <div className="box">
                    <input
                      type="text"
                      className="border-2 w-full py-2 px-3 outline-0"
                      placeholder="Payment ID"
                      autoComplete="off"
                      {...register("paypalDetails.paymentId", {
                        required: {
                          value: payment === "paypal",
                          message: "Paypal Payment Id is Required",
                        },
                      })}
                    />
                    {errors.paypalDetails?.paymentId && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} />{" "}
                        {errors.paypalDetails?.paymentId.message}
                      </p>
                    )}
                  </div>
                  <div className="box">
                    <input
                      type="text"
                      className="border-2 w-full py-2 px-3 outline-0"
                      placeholder="Payer Email"
                      autoComplete="off"
                      {...register("paypalDetails.payerEmail", {
                        required: {
                          value: payment === "paypal",
                          message: "Paypal Payer Email is Required",
                        },
                      })}
                    />
                    {errors.paypalDetails?.payerEmail && (
                      <p className="flex items-center text-red-500 gap-4 mt-2">
                        <MdError fontSize={24} />{" "}
                        {errors.paypalDetails?.payerEmail.message}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="special-button mt-4 w-full py-2"
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters className="animate-spin mx-auto text-[24px]" />
                  ) : (
                    "Order"
                  )}
                </button>
              </form>
            </>
          ) : (
            <p className="text-3xl">Cart is Empty</p>
          )}
        </>
      )}
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
