"use client";
import Barchart from "@/components/barchart";
import Linechart from "@/components/linechart";
import Piechart from "@/components/piechart";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface counts {
  TOTAL_REG: number;
  PAID: number;
  PENDING: number;
  FREE: number;
}

const dashboard = () => {
  const [countData, setCountData] = useState<counts>({
    TOTAL_REG: 0,
    PAID: 0,
    PENDING: 0,
    FREE: 0,
  });

  const getDataCounts = async () => {
    try {
      const response = await axios.get(
        "/api/admin/dashboardreports?calltype=counts"
      );
      if (response.data.success) {
        setCountData(response.data.countdata[0]);
        console.log(response.data.countdata);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    getDataCounts();
  }, []);

  useEffect(() => {
    console.log("Datass", countData);
  }, [countData]);

  return (
    <div className="max-w-screen-2xl w-full">
      <div className=" bg-zinc-700 flex justify-center items-center p-2">
        <h2 className="font-bold md:text-2xl text-xl text-sky-100">
          DASHBOARD
        </h2>
      </div>
      <div className="w-full md:p-10 p-3 md:pt-2">
        <div className="flex gap-4 justify-center flex-wrap ">
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              TOTAL REGISTRATION
            </div>
            <div className="bg-sky-900/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.TOTAL_REG}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              PAID REGISTRATION
            </div>
            <div className="bg-green-400/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.PAID}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              FREE REGISTRATION
            </div>
            <div className="bg-green-400/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.FREE}
              </h3>
            </div>
          </div>
          <div className="w-full max-w-72 text-xl rounded-lg overflow-hidden shadow-lg shadow-sky-500">
            <div className="bg-neutral-600 font-semibold text-center py-1 text-white">
              PENDING REGISTRATION
            </div>
            <div className="bg-red-400/40 p-2 ">
              <h3 className="text-2xl text-center font-semibold">
                {countData.PENDING}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p2 grid md:grid-cols-2 grid-cols-1 gap-1">
        <div className="px-6 border border-gray-700 mx-1">
          <h2 className="text-center font-semibold text-xl">
            Category wise payment stats
          </h2>
          <Barchart />
        </div>
        <div className="px-6 border border-gray-700 mx-1">
          <h2 className="text-center font-semibold text-xl">
            Category wise Paid registration
          </h2>
          <div className="max-w-[400px] mx-auto">
            <Piechart />
          </div>
        </div>
        <div className="px-6 border border-gray-700 mx-1">
          <h2 className="text-center font-semibold text-xl">
            Last 7 days Completed Registration
          </h2>
          <Linechart />
        </div>
      </div>
    </div>
  );
};

export default dashboard;
