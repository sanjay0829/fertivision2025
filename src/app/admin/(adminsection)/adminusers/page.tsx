"use client";
import Adminform from "@/components/adminform";
import Categoryform from "@/components/categoryform";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Adminuser } from "@/models/admin";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";

const page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [btnTxt, setBtnTxt] = useState("Submit");
  const [adminId, setAdminId] = useState("");
  const [adminData, setAdminData] = useState<Adminuser[] | undefined>([]);

  const getAdminusers = async () => {
    try {
      const response = await axios.get("/api/admin/adminuser");
      if (response.data.success) {
        setAdminData(response.data.adminusers);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    getAdminusers();
  }, []);

  return (
    <div className="w-full max-w-screen-2xl">
      <div className=" bg-zinc-700 flex justify-center items-center p-2">
        <h2 className="font-bold md:text-2xl text-xl text-sky-100">
          Admin Users
        </h2>
      </div>
      <div className="w-full md:p-10 p-3 md:mt-1">
        <div className="w-full max-w-screen-lg mx-auto">
          <div className="flex w-full justify-end">
            <button
              className="text-lg font-semibold px-3 py-1 rounded-sm flex justify-center items-center gap-1 bg-gradient-to-tr from-zinc-800 to-gray-700 text-white hover:from-gray-500 hover:to-zinc-800"
              onClick={() => {
                setIsOpen(true);
                setAdminId("");
                setBtnTxt("Submit");
              }}
            >
              <MdLibraryAdd /> Add New
            </button>
          </div>
          <div className="flex w-full">
            {adminData && adminData.length > 0 && (
              <div className="w-full overflow-auto max-h-screen">
                <table className="w-full">
                  <thead>
                    <tr className="bg-black text-white text-left">
                      <td className="border border-gray-100 px-2">
                        Admin Name
                      </td>
                      <td className="border border-gray-100 px-2">Login ID</td>
                      <td className="border border-gray-100 px-2">
                        Admin Type
                      </td>

                      <td className="border border-gray-100 px-2">Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {adminData.map((item, index) => (
                      <tr
                        key={item._id as string}
                        className="hover:bg-zinc-300 text-sm odd:bg-gray-100 even:bg-gray-200"
                      >
                        <td className="border px-2 py-2">{item.name}</td>
                        <td className="border px-2 py-2">{item.login_id}</td>
                        <td className="border px-2 py-2">{item.user_type}</td>

                        <td className="border px-2 py-2">
                          <div className="w-full flex gap2">
                            <FaRegEdit
                              size={20}
                              className="cursor-pointer"
                              onClick={() => {
                                setIsOpen(true);
                                setAdminId(item._id as string);
                                setBtnTxt("Update");
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-2xl w-full flex"
        >
          <DialogHeader className="hidden">
            <DialogTitle>Add new category</DialogTitle>
          </DialogHeader>
          <Adminform
            buttonText={btnTxt}
            adminId={adminId}
            closeModal={() => {
              setIsOpen(false);
            }}
            updateAdminUsers={() => {
              getAdminusers();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default page;
