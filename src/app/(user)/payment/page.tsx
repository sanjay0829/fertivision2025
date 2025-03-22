"use client";
import { Button } from "@/components/ui/button";
import { updatePaymentDetails } from "@/helpers/updatePaymentDetails";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbHomeStar } from "react-icons/tb";

const Paymentpage = () => {
  const [userData, setUserData] = useState<User>();
  const [isSaving, setIsSaving] = useState(false);
  const [amountTotal, setAmountTotal] = useState(0);

  const router = useRouter();

  const getUser = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/user");

      if (response.data.success) {
        setUserData(response.data.user);
        //console.log(response.data.user);
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
      const total =
        userData?.conf_amount +
        userData?.accompany_amount +
        userData.workshop_amount +
        userData.accomodation_amount;

      setAmountTotal(total);
    }

    if (userData?.total_amount == 0) {
      setIsSaving(true);
      updatePaymentDetails(userData._id as string, "Complementary", "NA").then(
        (data: any) => {
          // console.log(data);

          if (data.success) {
            router.replace(`/thanks`);
            setIsSaving(false);
          }
        }
      );
    }
  }, [userData]);

  const createOrder = async () => {
    try {
      setIsSaving(true);
      if (!userData) {
        return;
      }

      if (userData.payment_status && userData.payment_status != "Pending") {
        return;
      }
      const amount = userData.total_amount;

      const res = await axios.post("/api/user/createRzpOrder", {
        amount: (amount + Math.round(amount * 0.035)) * 100,
        currency: userData.currency,
        receipt_id: userData.reg_no,
        userId: userData._id,
      });

      const data = await res.data.data;

      if (data) {
        const paymentData = {
          name: userData.fullname,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: data.id,
          image: "https://groupthink.events/images/gt.png",
          handler: async function (response: any) {
            // verify payment
            const res = await fetch("/api/user/verifyOrder", {
              method: "POST",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
              // do whatever page transition you want here as payment was successful
              setIsSaving(true);
              updatePaymentDetails(
                userData._id as string,
                "Paid",
                response.razorpay_payment_id
              ).then((data: any) => {
                console.log(data);

                if (data.success) {
                  router.replace(`/thanks`);
                  setIsSaving(false);
                }
              });
            } else {
              alert("Payment failed");
              setIsSaving(false);
            }
          },
          prefill: {
            name: userData.fullname,
            email: userData.email,
            contact: userData.mobile,
          },
          theme: {
            color: "#EFA735",
          },
        };

        const payment = new (window as any).Razorpay(paymentData);
        payment.open();
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full p-3">
      <Script
        type="text/javascript"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="text-right flex justify-end">
        <Link
          href="/profile"
          className="text-sky-700 hover:text-blue-600 flex w-fit bg-fuchsia-200 hover:bg-slate-300 px-2 py-1 rounded-md"
        >
          <TbHomeStar size={24} /> Home
        </Link>
      </div>
      <div className="max-w-screen-md mx-auto rounded-lg">
        <div className="p-2 bg-red-400 rounded-t-lg">
          <h2 className="text-xl md:text-3xl text-white font-bold text-center">
            PAYMENT PAGE
          </h2>
        </div>
        <div className="bg-gray-200 p-3">
          <div className="">
            <h2 className="text-2xl font-semibold text-center">
              Hi, {userData?.fullname}
            </h2>
          </div>
          <div className="flex p-2 w-full  border justify-center">
            <div className="border border-blue-500 rounded-md max-w-[500px] w-full flex justify-center bg-sky-100 p-2">
              <table className="table max-w-[400px] w-full">
                <tbody>
                  <tr>
                    <td className="border border-blue-400 p-2 font-semibold">
                      Conference Amount
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {userData?.currency == "USD" ? "$" : "₹"}
                    </td>
                    <td className="border border-blue-400 p-2">
                      {userData?.conf_amount}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-blue-400 p-2 font-semibold">
                      Workshop Amount
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {userData?.currency == "USD" ? "$" : "₹"}
                    </td>
                    <td className="border border-blue-400 p-2">
                      {userData?.workshop_amount}
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-blue-400 flex justify-between p-2 font-semibold">
                      Accompanying Person Amount{" "}
                      <span className="bg-yellow-100 ml-3 px-2">
                        X {userData?.no_of_accompany}
                      </span>
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {userData?.currency == "USD" ? "$" : "₹"}
                    </td>
                    <td className="border border-blue-400 p-2">
                      {userData?.accompany_amount}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-blue-400 flex justify-between p-2 font-semibold">
                      Accomodation Amount{" "}
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {userData?.currency == "USD" ? "$" : "₹"}
                    </td>
                    <td className="border border-blue-400 p-2">
                      {userData?.accomodation_amount}
                    </td>
                  </tr>
                  <tr className="bg-black/80 text-white">
                    <td className="border border-blue-400 p-2 font-bold">
                      Total Amount
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {userData?.currency == "USD" ? "$" : "₹"}
                    </td>
                    <td className={`"border border-blue-400 p-2 font-bold" $`}>
                      {amountTotal}
                    </td>
                  </tr>

                  <tr className="bg-black/80 text-white">
                    <td className="border border-blue-400 p-2 font-bold">
                      Bank Charge (3.5%)
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {userData?.currency == "USD" ? "$" : "₹"}
                    </td>
                    <td className="border border-blue-400 p-2 font-bold">
                      {Math.round((userData?.total_amount || 0) * 0.035)}
                    </td>
                  </tr>
                  <tr className="bg-black/80 text-white text-lg">
                    <td className="border border-blue-400 p-2 font-bold">
                      Grand Total Amount
                    </td>
                    <td className="border border-blue-400 p-2 font-semibold text-center">
                      {userData?.currency == "USD" ? "$" : "₹"}
                    </td>
                    <td className="border border-blue-400 p-2 font-bold">
                      {(userData?.total_amount || 0) +
                        Math.round((userData?.total_amount || 0) * 0.035)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex w-full justify-center p-1">
            <Button
              disabled={isSaving}
              onClick={createOrder}
              className="rounded-md bg-gradient-to-br hover:scale-105 transition-all duration-150 ease-in-out from-amber-600 to-yellow-300 hover:from-yellow-300 hover:to-amber-700 text-lg font-bold px-4 py-1 m-2"
            >
              {isSaving ? "Processing..." : "Continue to Pay"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paymentpage;
