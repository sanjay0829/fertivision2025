"use client";
import Categoryform from "@/components/categoryform";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Category } from "@/models/category";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdLibraryAdd } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const CategoryPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [btnTxt, setBtnTxt] = useState("Submit");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[] | undefined>([]);

  const getCategories = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/category");
      if (response.data.success) {
        setCategories(response.data.categoryList);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="w-full">
      <div className=" bg-zinc-700 flex justify-center items-center p-2">
        <h2 className="font-bold md:text-2xl text-xl text-sky-100">
          CATEGORIES
        </h2>
      </div>
      <div className="w-full md:p-10 p-3 md:mt-1">
        <div className="w-full max-w-screen-lg mx-auto">
          <div className="flex w-full justify-end">
            <button
              className="text-lg font-semibold px-3 py-1 rounded-sm flex justify-center items-center gap-1 bg-gradient-to-tr from-zinc-800 to-gray-700 text-white hover:from-gray-500 hover:to-zinc-800"
              onClick={() => {
                setIsOpen(true);
                setCategoryId("");
                setBtnTxt("Submit");
              }}
            >
              <MdLibraryAdd /> Add New
            </button>
          </div>
          <div className="flex w-full">
            {categories && categories.length > 0 && (
              <div className="w-full overflow-auto max-h-screen">
                <table className="w-full">
                  <thead>
                    <tr className="bg-black text-white text-left">
                      <td className="border border-gray-100 px-2">Category</td>
                      <td className="border border-gray-100 px-2">
                        Conf. Amount
                      </td>
                      <td className="border border-gray-100 px-2">
                        Workshop Amount
                      </td>
                      <td className="border border-gray-100 px-2">
                        CME Amount
                      </td>
                      <td className="border border-gray-100 px-2">
                        Banquet Amount
                      </td>
                      <td className="border border-gray-100 px-2">
                        Accompany Amount
                      </td>
                      <td className="border border-gray-100 px-2">Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item, index) => (
                      <tr
                        key={item._id as string}
                        className="hover:bg-zinc-300 text-sm odd:bg-gray-100 even:bg-gray-200"
                      >
                        <td className="border px-2 py-2">
                          {item.category_name}
                        </td>
                        <td className="border px-2 py-2">{item.conf_amount}</td>
                        <td className="border px-2 py-2">
                          {item.workshop_amount}
                        </td>
                        <td className="border px-2 py-2">{item.cme_amount}</td>
                        <td className="border px-2 py-2">
                          {item.banquet_amount}
                        </td>
                        <td className="border px-2 py-2">
                          {item.accompany_amount}
                        </td>
                        <td className="border px-2 py-2">
                          <div className="w-full flex gap2">
                            <FaRegEdit
                              size={20}
                              className="cursor-pointer"
                              onClick={() => {
                                setIsOpen(true);
                                setCategoryId(item._id as string);
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
          className="max-w-[700px] w-full flex"
        >
          <DialogHeader className="hidden">
            <DialogTitle>Add new category</DialogTitle>
          </DialogHeader>
          <Categoryform
            buttonText={btnTxt}
            categoryId={categoryId}
            closeModal={() => {
              setIsOpen(false);
            }}
            updateCategories={() => {
              getCategories();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryPage;
