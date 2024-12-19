"use client";
import { getToken, mainUrl } from "@/app/assets/data";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

type Order = {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
    image: string;
    country: string;
  };
  shippingAddress: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

export default function page() {
  const { token, _id } = getToken();
  const [orders, setOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(mainUrl + "get-orders", {
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
  const handleDeleteOrder = async (id: string) => {
    try {
      const { data } = await axios.delete(mainUrl + `delete-order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      setOrder((prev) => prev.filter((order) => order._id !== id));
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      toast.error(error.response.data.msg, { position: "top-left" });
      console.log(error);
    }
  };
  return (
    <>
      <h2 className="mb-4">All Orders</h2>
      {loading ? (
        <AiOutlineLoading3Quarters className="text-[120px] text-greenColor mx-auto mt-[120px]" />
      ) : (
        <>
          {orders.length ? (
            <div className="overflow-x-auto">
              <table className="w-[125%] border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border-2 bg-gray-300">No.</th>
                    <th className="p-2 border-2 bg-gray-300">User</th>
                    <th className="p-2 border-2 bg-gray-300">Email</th>
                    <th className="p-2 border-2 bg-gray-300">Total Price</th>
                    <th className="p-2 border-2 bg-gray-300">
                      ShippingAddress
                    </th>
                    <th className="p-2 border-2 bg-gray-300">Ordered At</th>
                    <th className="p-2 border-2 bg-gray-300">Payment Method</th>
                    <th className="p-2 border-2 bg-gray-300">Payment Status</th>
                    <th className="p-2 border-2 bg-gray-300">Order Status</th>
                    <th className="p-2 border-2 bg-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="border-2 p-2">{index + 1}</td>
                      <td className="border-2 p-2">
                        <div>
                          <img
                            src={order.user.image}
                            alt="User Image"
                            className="mx-auto w-[50px] h-[50px] rounded-full"
                          />
                          <p className="text-center mt-2">
                            {order.user.username} - {order.user.country}
                          </p>
                        </div>
                      </td>
                      <td className="border-2 p-2">{order.user.email}</td>
                      <td className="border-2 p-2">
                        {order.totalPrice.toFixed(2)}
                      </td>
                      <td className="border-2 p-2">{order.shippingAddress}</td>
                      <td className="border-2 p-2">
                        {new Date(order.createdAt).toLocaleDateString()} <br />
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="border-2 p-2">{order.paymentMethod}</td>
                      <td className="border-2 p-2">{order.paymentStatus}</td>
                      <td className="border-2 p-2">{order.orderStatus}</td>
                      <td className="border-2 p-2">
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="py-2 w-full text-center border-2 border-red-500 text-red-500 duration-200 hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-3xl">No Orders</p>
          )}
        </>
      )}
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
