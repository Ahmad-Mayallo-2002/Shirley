"use client";
import { getToken, mainUrl } from "@/app/assets/data";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

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
  _id: string;
  items: Array<{ book: string; amount: number }>;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  creditCardDetails?: CreditCardDetails;
  paypalDetails?: PaypalDetails;
  orderStatus: string;
  createdAt: string;
  paymentStatus: string;
};

export default function page() {
  const [order, setOrder] = useState<Order[]>([]);
  const { token, _id } = getToken();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(mainUrl + "get-user-order", {
          headers: {
            Authorization: `Bearer ${token}`,
            id: _id,
          },
        });
        setOrder(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { data } = await axios.patch(
        mainUrl + `update-order-status/${id}`,
        { orderStatus: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: _id,
          },
        }
      );
      setOrder((prev) => {
        prev.filter((orders) => orders.orderStatus !== status);
        return prev;
      });
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      toast.error(error.response.data.msg, { position: "top-left" });
      console.log(error);
    }
  };
  return (
    <>
      <h2 className="mb-4">My Orders</h2>
      {loading ? (
        <>
          <AiOutlineLoading3Quarters
            fontSize={120}
            className="animate-spin text-greenColor mx-auto mt-[120px]"
          />
        </>
      ) : order.length ? (
        <>
          <div className="lg:w-full w-[calc(100vw-80px-4rem)] overflow-x-auto">
            <table className="table-auto lg:w-full w-[300%] border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">No.</th>
                  <th className="border border-gray-300 px-4 py-2">Address</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Order Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Payment Method
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Payment Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Total Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Ordered At
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {order.map((value, index) => (
                  <tr key={value._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {value.shippingAddress}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {value.orderStatus}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {value.paymentMethod}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {value.paymentStatus}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {value.totalPrice.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(value.createdAt).toLocaleDateString()} <br />
                      {new Date(value.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          handleUpdateStatus(value._id, "cancelled")
                        }
                        className="duration-200 hover:text-white hover:bg-red-500 border-2 py-2 text-center w-full border-red-500 text-red-500"
                      >
                        Cancel Order
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(value._id, "delievered")
                        }
                        className="special-button py-2 w-full mt-2"
                      >
                        Deliver Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-3xl">No Orders</p>
      )}
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
