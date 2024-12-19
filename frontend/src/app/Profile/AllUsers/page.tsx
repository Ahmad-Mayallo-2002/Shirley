"use client";
import { getToken, mainUrl } from "@/app/assets/data";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

type User = {
  _id: string;
  username: string;
  email: string;
  image: string;
  country: string;
};

export default function page() {
  const { token, _id } = getToken();
  const [users, setUsers] = useState<User[]>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(mainUrl + "get-users", {
          headers: {
            Authorization: `Bearer ${token}`,
            id: _id,
          },
        });
        setUsers(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);
  const handleDeleteUser = async (id: string) => {
    try {
      const { data } = await axios.delete(mainUrl + `delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: _id,
        },
      });
      setUsers((prev) => prev?.filter((user) => user._id !== id));
      toast.success(data.msg, { position: "top-left" });
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.msg, { position: "top-left" });
    }
  };
  return (
    <>
      <main id="users">
        <h2 className="mb-4">All Users</h2>
        {loading ? (
          <AiOutlineLoading3Quarters className="text-greenColor text-[120px] mx-auto mt-[120px]" />
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-2 bg-gray-100">No.</th>
                <th className="p-2 border-2 bg-gray-100">User</th>
                <th className="p-2 border-2 bg-gray-100">Email</th>
                <th className="p-2 border-2 bg-gray-100">Country</th>
                <th className="p-2 border-2 bg-gray-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={user._id}>
                  <td className="p-2 border-2">{index + 1}</td>
                  <td className="p-2 border-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={user.image}
                        alt="User Image"
                        className="w-[50px] h-[50px] rounded-full"
                      />
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td className="p-2 border-2">{user.email}</td>
                  <td className="p-2 border-2">{user.country}</td>
                  <td className="p-2 border-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="py-2 w-full text-center border-2 border-red-500 text-red-500 duration-200 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className="p-2 border-2 bg-gray-100 text-start" colSpan={4}>
                  Total Users:
                </th>
                <th className="p-2 border-2 bg-gray-100 text-start">
                  {users?.length}
                </th>
              </tr>
            </tfoot>
          </table>
        )}
      </main>
      <ToastContainer pauseOnFocusLoss={false} pauseOnHover={false} />
    </>
  );
}
