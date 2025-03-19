"use client";
import { useAppContext } from "@/context/usercontext";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown, FaCircleUser } from "react-icons/fa6";
import { MdLogout, MdOutlinePassword } from "react-icons/md";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState<User>();
  const router = useRouter();

  const { username, setUsername } = useAppContext();

  const getUser = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/user");
      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.log("fff", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
      router.push("/");
    }
  };
  useEffect(() => {
    getUser();
    const handleScroll = () => {
      if (window.screenY > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userData) {
      if (userData.fullname && userData.fullname.length > 0) {
        setUsername(userData.fullname);
      } else {
        setUsername("Delegate");
      }
    }
  }, [userData]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/user/logout");

      if (response.data.success) {
        toast.success("Logged out successfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  return (
    <nav
      className={`print:hidden max-w-screen-2xl flex rounded-t-md mb-1 justify-between items-center min-h-14 z-10 sticky top-0 mx-auto md:px-6 py-2 px-4 ${
        sticky
          ? "shadow-sm bg-gradient-to-r from-green-700 to-blue-700 z-30 text-black sticky"
          : "bg-gradient-to-r from-green-800 to-blue-800 text-black"
      }`}
    >
      <div className="p-1">
        <img src="/img/logo.png" alt="" className="max-w-[180px]" />
      </div>
      <div className="w-80 flex justify-end relative " ref={dropdownRef}>
        <div className=" inline-block  bg-sky-100 px-2 py-1 rounded-lg">
          <div
            className="flex gap-2 items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <button className="w-10 h-10">
              <FaCircleUser className="w-full h-full text-sky-600" />
            </button>
            <h3 className="text-lg font-bold flex gap-2 items-center cursor-pointer">
              <span>{username}</span>{" "}
              <FaChevronDown className="text-sky-600 mt-1" />
            </h3>
          </div>
          {isOpen && (
            <div className="flex flex-col w-full min-w-60 z-[99] absolute right-0 mt-4 bg-slate-800 text-white rounded-md p-3">
              <div className="flex items-center gap-4 w-full mb-2">
                <FaCircleUser className="w-8 h-8 text-sky-600" />
                <h3 className="text-lg font-semibold">{username}</h3>
              </div>
              <div className="border-t border-slate-500/30 mb-2"></div>
              <div className="flex flex-col w-full text-black p-2">
                <Link href={"/changepassword"}>
                  <h2 className="font-semibold flex items-center gap-2 justify-center text-lg cursor-pointer bg-slate-100 hover:bg-slate-200 p-2 text-center ">
                    <MdOutlinePassword /> Change password{" "}
                  </h2>
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-700 flex items-center justify-center gap-2 text-white text-lg font-bold rounded-md mt-2 p-2"
                >
                  <MdLogout /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
