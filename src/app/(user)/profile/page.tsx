"use client";
import Header from "@/components/header";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { BiEdit } from "react-icons/bi";
import ProcessingOverlay from "@/components/processing";
import { Button } from "@/components/ui/button";
import { SendConfiramtionEmail } from "@/helpers/sendConfirmationEmail";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [userData, setUserData] = useState<User>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiResponse>("/api/user");
      if (response.data.success) {
        setUserData(response.data.user);
        //console.log(response.data.user);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userData) {
      if (!userData?.reg_category || userData?.reg_category == "") {
        console.log(userData?.fullname);
        router.push("/register");
      }
    }
  }, [userData]);

  return (
    <div className="flex flex-col mx-1">
      {isLoading && <ProcessingOverlay LabelName="Loading" />}
      <Header />

      <div className="w-full p-5 text-[1.10rem] text-sm bg-pink-100">
        <div className="p-2 bg-green-800">
          <h2 className="font-bold text-white sm:text-xl text-lg flex gap-2 justify-between ">
            Registration Details
            {userData?.payment_status == "Pending" && (
              <Link
                href={"/register"}
                className="text-sm flex items-center gap-2 border border-sky-50 px-2 hover:bg-gray-600"
              >
                <BiEdit size={24} title="Edit Details" /> Edit
              </Link>
            )}
          </h2>
        </div>
        <div className="md:px-4 bg-white py-1">
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Registration No.</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.reg_no}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Registration Type</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.reg_category}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Name</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.fullname}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Email ID</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.email}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Mobile</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">+{userData?.mobile}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Institution</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.company}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">City</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.city}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Pre Lunch Workshop</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.pre_workshop}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Post Lunch Workshop</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.post_workshop}</p>
            </div>
          </div>
        </div>
        <div className="p-2 bg-green-800 mt-2">
          <h2 className="font-bold text-white sm:text-xl text-lg ">
            Accompaying Person Details
          </h2>
        </div>
        <div className="md:px-4 bg-white py-1">
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">No. of Accompanying Person</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">{userData?.no_of_accompany}</p>
            </div>
          </div>
          <div className="w-full mt-2">
            {(userData?.accompany_persons?.length || 0) > 0 && (
              <table className="w-full text-[1rem] ">
                <thead>
                  <tr className="bg-gray-500 text-white">
                    <td className="p-1">S.no</td>
                    <td className="p-1">Name</td>
                    <td className="p-1">Age</td>
                    <td className="p-1">Gender</td>
                  </tr>
                </thead>
                <tbody>
                  {userData?.accompany_persons.map((member, index) => (
                    <tr key={member._id as string}>
                      <td className="px-2 border border-gray-100">
                        {index + 1}.
                      </td>
                      <td className="px-2 border border-gray-100">
                        {member.accompany_name}
                      </td>
                      <td className="px-2 border border-gray-100">
                        {member.accompany_age}
                      </td>
                      <td className="px-2 border border-gray-100">
                        {member.accompany_gender}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="p-2 bg-green-800 mt-2">
          <h2 className="font-bold text-white sm:text-xl text-lg ">
            Accommodation Details
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
          <div className="p-2 bg-green-200">
            <h4 className="font-bold ">Accommodation Type</h4>
          </div>
          <div className="p-2 sm:col-span-2">
            <p className="">{userData?.accomodation_type}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
          <div className="p-2 bg-green-200">
            <h4 className="font-bold ">Room Type</h4>
          </div>
          <div className="p-2 sm:col-span-2">
            <p className="">{userData?.room_type}</p>
          </div>
        </div>
        <div className="p-2 bg-green-800 mt-2">
          <h2 className="font-bold text-white sm:text-xl text-lg ">
            Payment Details
          </h2>
        </div>
        <div className="md:px-4 bg-white py-1">
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200">
              <h4 className="font-bold ">Total Amount</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="">
                {userData?.currency} {userData?.total_amount}
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 border border-gray-200 mt-2">
            <div className="p-2 bg-green-200 flex items-center">
              <h4 className="font-bold">Payment Status</h4>
            </div>
            <div className="p-2 sm:col-span-2">
              <p className="flex items-center gap-2">
                {userData?.payment_status}
                {userData?.payment_status == "Pending" && (
                  <Link
                    href={"/payment"}
                    className="px-3 py-1 w-fit flex  rounded-lg  items-center bg-sky-600 hover:bg-slate-700 text-white shadow-md"
                  >
                    <FaMoneyBill1Wave />
                    Pay Now
                  </Link>
                )}
              </p>
            </div>
          </div>
          <div className="mt-3">
            {userData?.payment_status == "Pending" && (
              <Link
                href={"/register"}
                className="bg-green-800 flex w-fit items-center gap-2 text-white hover:bg-zinc-600 px-3 py-1 rounded-lg"
              >
                <BiEdit />
                <span>Edit Registration Details</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
