"use client";
import Dateformat from "@/components/date";
import { Category } from "@/models/category";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit, FaSearch } from "react-icons/fa";
import { MdCategory, MdOutlineAttachEmail } from "react-icons/md";
import { PiMicrosoftExcelLogoDuotone } from "react-icons/pi";
import { RiSecurePaymentFill } from "react-icons/ri";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { SendConfiramtionEmail } from "@/helpers/sendConfirmationEmail";
import ProcessingOverlay from "@/components/processing";
import { exportToExcel } from "@/helpers/exportToexcel";

const formatDate = (dateString: Date) => {
  if (!dateString) return ""; // Handle empty dates
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0"); // Ensure two-digit day
  const month = date.toLocaleString("en-GB", { month: "short" }); // Get short month
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${day}-${month}-${year} ${hour}:${minute}`;
};

const RegList = () => {
  const [searchString, setSearchString] = useState<string | undefined>("");
  const [category, setCategory] = useState<string | undefined>("");
  const [payment, setPayment] = useState<string | undefined>("");
  const [categories, setCategories] = useState<Category[] | undefined>([]);
  const [users, setUsers] = useState<User[] | undefined>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/admin/reports", {
        params: {
          search: searchString,
          category: category,
          payment_status: payment,
        },
      });
      if (response.data.success) {
        setUsers(response.data.userList);
        if (response.data.userList?.length == 0) {
          toast.error("No data to diaplay for given search query");
        }
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/category");

      if (response.data.success) {
        setCategories(response.data.categoryList);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    // Define column headers
    worksheet.columns = [
      { header: "Registration ID", key: "reg_no", width: 15 },
      { header: "Name", key: "fullname", width: 20 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Email", key: "email", width: 25 },
      { header: "Payment Status", key: "payment_status", width: 15 },
      { header: "Reg Category", key: "reg_category", width: 20 },
      { header: "Payment Date", key: "payment_date", width: 20 },
    ];
    const formattedUsers = users?.map((user) => ({
      ...user,
      payment_date: formatDate(user?.payment_date), // Format date before adding
    }));
    // Add data rows
    worksheet.addRows(formattedUsers!);

    // Generate Excel file as a Blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Trigger file download
    saveAs(blob, "users_data.xlsx");
  };

  return (
    <div className="max-w-screen-2xl w-full">
      <div className=" bg-zinc-700 flex justify-center items-center p-2">
        <h2 className="font-bold md:text-2xl text-xl text-sky-100">
          REGISTRATION LIST
        </h2>
      </div>
      <div className="w-full md:p-10 p-3 md:pt-2">
        <div className="flex w-full items-center bg-slate-300 p-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-wrap w-full gap-1  md:flex-nowrap"
          >
            <div className="relative border md:max-w-[350px] rounded-lg flex items-center focus-within:shadow-md focus-within:shadow-gray-300 focus-within:outline focus-within:outline-2 focus-within:outline-gray-500 bg-white md:w-[98%] w-[95%]  p-1">
              <FaSearch className="absolute right-4 text-orange-500" />
              <input
                type="text"
                placeholder="Name/Reg no./email"
                className="text-input2"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>
            <div className="relative border md:max-w-[350px] rounded-lg flex items-center focus-within:shadow-md focus-within:shadow-gray-300 focus-within:outline focus-within:outline-2 focus-within:outline-gray-500 bg-white md:w-[98%] w-[95%]  p-1">
              <MdCategory className="absolute right-4 text-orange-500" />
              <select
                className="text-input2 bg-none appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Category Filter</option>
                {categories?.map((item) => (
                  <option key={item._id as string} value={item.category_name}>
                    {item.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative border md:max-w-[350px] rounded-lg flex items-center focus-within:shadow-md focus-within:shadow-gray-300 focus-within:outline focus-within:outline-2 focus-within:outline-gray-500 bg-white md:w-[98%] w-[95%]  p-1">
              <RiSecurePaymentFill className="absolute right-4 text-orange-500" />
              <select
                className="text-input2 bg-none appearance-none"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="">Payment Filter</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Complementary</option>
              </select>
            </div>
            <button
              type="submit"
              className="text-center mx-2 my-2 md:my-0 disabled:opacity-70 disabled:pointer-events-none hover:scale-105 transition-all duration-500 bg-gray-800 hover:bg-gray-900 w-fit py-1 rounded-lg text-white px-5 min-w-[200px] text-lg"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="flex justify-start">
          {users && users.length > 0 && (
            <button
              onClick={() => exportToExcel(users, "UserData.xlsx")}
              className="px-4 py-1 flex items-center bg-zinc-600 text-white hover:bg-zinc-700 rounded-sm shadow-lg"
            >
              <PiMicrosoftExcelLogoDuotone /> Download as Excel
            </button>
          )}
        </div>
        <div className="w-full max-w-screen-xl mt-2 mx-auto">
          {users && users?.length > 0 && (
            <div className="w-full overflow-auto">
              <table className=" border-collapse w-full">
                <thead>
                  <tr className="bg-black text-white ">
                    <th className="text-left font-bold border px-2">S.No</th>
                    <th className="text-left font-bold border px-2">Reg no</th>
                    <th className="text-left  font-bold border  px-2">Name</th>
                    <th className="text-left  font-bold border  px-2">Email</th>
                    <th className="text-left  font-bold border  px-2">
                      Category
                    </th>
                    <th className="text-left  font-bold border px-2">
                      Payment Status
                    </th>
                    <th className="text-left  font-bold border px-2">
                      Payment Date
                    </th>
                    <th className="text-left  font-bold border px-2">
                      Confirmation
                    </th>
                    <th className="text-left  font-bold border px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id as string}
                      className="hover:bg-gray-100 odd:bg-sky-100"
                    >
                      <td className="border px-2 text-sm py-2">{index + 1}.</td>
                      <td className="border px-2 text-sm py-2">
                        {user.reg_no}
                      </td>
                      <td className="border px-2 text-sm py-2">
                        {user.fullname}
                      </td>
                      <td className="border px-2 text-sm py-2">{user.email}</td>
                      <td className="border px-2 text-sm py-2">
                        {user.reg_category}
                      </td>
                      <td
                        className={`border px-2 text-sm py-2 text-center font-extrabold text-black ${
                          user.payment_status == "Pending"
                            ? "bg-red-200"
                            : "bg-green-200"
                        }`}
                      >
                        {user.payment_status}
                      </td>
                      <td className="border px-2 text-sm py-2">
                        {user.payment_date && (
                          <Dateformat
                            datestring={user.payment_date.toString()}
                          />
                        )}
                      </td>
                      <td className="border px-2 text-sm py-2">
                        {user.payment_status != "Pending" && (
                          <button
                            onClick={async () => {
                              setIsSaving(true);
                              const result = await SendConfiramtionEmail(
                                user._id as string
                              );
                              if (result.success) {
                                toast.success(
                                  `Confirmation email sent on ${user.email}`
                                );
                                setIsSaving(false);
                              }
                            }}
                            className="bg-sky-700 flex gap-2 items-center hover:bg-zinc-900 text-white px-4 py-2 rounded-md"
                          >
                            <MdOutlineAttachEmail />
                            Send
                          </button>
                        )}
                      </td>
                      <td className="border px-2 text-sm py-2">
                        <button
                          onClick={() => {
                            router.replace(`/admin/edit/${user._id}`);
                          }}
                          className="bg-zinc-800 flex items-center hover:bg-zinc-900 text-white px-4 py-2 rounded-md"
                        >
                          <FaRegEdit />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {isSaving && <ProcessingOverlay />}
    </div>
  );
};

export default RegList;
