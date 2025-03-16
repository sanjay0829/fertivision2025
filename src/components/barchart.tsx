"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";

ChartJs.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface PaymentData {
  category: string;
  paid: number;
  pending: number;
  free: number;
}

const Barchart = () => {
  const [chartData, setChartData] = useState<PaymentData[]>([]);
  const [bData, setbData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/admin/dashboardreports?calltype=paymentStatus"
      );
      if (response.data.success) {
        setChartData(response.data.paymentStatus);
        console.log(response.data.paymentStatus);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!chartData || chartData.length == 0) {
      return;
    }
    if (chartData) {
      setIsLoading(false);
      const labels = chartData.map((item) => item.category);

      setbData({
        labels,
        datasets: [
          {
            label: "Paid",
            data: chartData.map((item) => item.paid),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Pending",
            data: chartData.map((item) => item.pending),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Free",
            data: chartData.map((item) => item.free),
            backgroundColor: "rgba(96, 232, 7, 0.5)",
          },
        ],
      });
    }
  }, [chartData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false, // ✅ Enable title
        text: "Registration Payment Status", // ✅ Set your desired title
        font: {
          size: 20, // ✅ Adjust font size
        },
        color: "#333", // ✅ Set title color
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
  };
  if (isLoading) return <p>Loading chart...</p>;
  return <Bar data={bData} options={options} className="mt-3"></Bar>;
};

export default Barchart;
