"use client";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

interface catData {
  _id: string;
  COUNT: number;
}

const Piechart = () => {
  const [chartData, setChartData] = useState<catData[]>([]);
  const [pData, setpData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        "/api/admin/dashboardreports?calltype=categorypaid"
      );
      if (response.data.success) {
        setChartData(response.data.categorypaid);
        console.log(response.data.categorypaid);
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
      console.log(chartData);

      setIsLoading(false);
      const labels = chartData.map((item) => item._id);

      setpData({
        labels,
        datasets: [
          {
            label: "Paid",
            data: chartData.map((item) => item.COUNT),
            backgroundColor: [
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(255, 159, 64, 0.5)",
            ],
          },
        ],
      });
    }
  }, [chartData]);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
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
  return <Pie data={pData} options={options} />;
};

export default Piechart;
