"use client";
import Header from "@/components/header";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ThanksPage = () => {
  const [userData, setUserData] = useState<User>();
  const router = useRouter();

  const getUser = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/user");

      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (userData) {
      if (userData.payment_status == "Pending") {
        router.push("/profile");
      }
    }
  }, [userData]);

  return (
    <div className="w-full p-3">
      <Header />
      <div className="w-full max-w-screen-md mx-auto bg-gray-200 mt-4">
        <div className="w-full flex justify-center items-center p-2 bg-green-500 text-white rounded-t-md">
          <h2 className="text-xl md:text-2xl font-semibold">
            REGISTRATION SUCCESSFULL
          </h2>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-xl font-bold text-amber-500">
            Congratulations !
          </h3>
          <p className="p-1 mt-3 text-lg">
            Your registration is submitted successfully
          </p>
          <p className="">
            <Link
              href={"/profile"}
              className="px-4 font-semibold text-gray-700 block py-2 m-3 bg-gradient-to-tr from-amber-600 to-yellow-200 rounded-md hover:from-yellow-300 hover:to-amber-700"
            >
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThanksPage;
