"use client";
import Header from "@/components/header";
import ProcessingOverlay from "@/components/processing";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/models/user";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { z } from "zod";

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be atleast 6 characters")
      .max(10, "Password should not be more than 10 characters"),
    confirm_password: z
      .string()
      .min(6, "Confirm Password must be atleast 6 characters")
      .max(10, "Confirm Password should not be more than 10 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords must match",
  });

type FormData = z.infer<typeof ResetPasswordSchema>;
const ResetPassword = () => {
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [tokenVerified, setTokenVerified] = useState(true);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  const verifyToken = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/user/verifyToken", {
        params: { token: window.location.search.split("=")[1] },
      });
      console.log(response);

      if (response.data.success) {
        toast.success("token verified");
        setUserData(response.data.user);
        setTokenVerified(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
      setTokenVerified(false);
    }
  };
  useEffect(() => {
    //console.log("params", params);

    verifyToken();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/user/passwordchange",
        {
          ...data,
          userId: userData?._id,
        }
      );
      if (response.data.success) {
        console.log(response.data.user);
        toast.success(response.data.message);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message as string);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-slate-300 w-full flex flex-col justify-center items-center">
      <div className="max-w-screen-md w-full my-2 p-2 border border-zinc-500 bg-gradient-to-br shadow-lg shadow-fuchsia-500 rounded-lg from-fuchsia-700/20 to-purple-400/10">
        <Header />
        <div className="bg-fuchsia-900 py-3 rounded-2xl w-full my-2">
          <h2 className="text-2xl text-center font-semibold text-white">
            Reset Password
          </h2>
        </div>
        {tokenVerified ? (
          <div className=" p-2 bg-gray-100 md:mx-3 mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex w-full justify-center">
                  <p className="bg-pink-100 p-1 rounded-md w-full text-center text-lg font-bold">
                    Hi {userData?.title} {userData?.fullname}
                  </p>
                </div>
                <div className="m-2 flex flex-col  border rounded-md mt-4">
                  <div className="text-center text-blue-600 mb-3">
                    <p>Enter your New Password</p>
                  </div>
                  <div className="mx-auto w-full max-w-[400px] space-y-4 mb-4 ">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={`text-lg font-semibold ${
                              form.formState.errors.password
                                ? "text-black"
                                : "text-black"
                            }`}
                          >
                            New Password*
                          </FormLabel>
                          <FormControl>
                            <input
                              type="password"
                              {...field}
                              className="text-input3"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={`text-lg font-semibold ${
                              form.formState.errors.confirm_password
                                ? "text-black"
                                : "text-black"
                            }`}
                          >
                            Confirm Password*
                          </FormLabel>
                          <FormControl>
                            <input
                              type="password"
                              {...field}
                              className="text-input3"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col items-center justify-center">
                      <Button
                        type="submit"
                        className="mx-auto text-lg bg-fuchsia-900 font-bold px-6 py-2"
                      >
                        Submit
                      </Button>
                      <p
                        className={`${
                          verified ? "text-green-600" : "text-red-700"
                        }`}
                      >
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="w-full py-3 flex flex-col justify-center gap-5">
            <p className="text-lg text-red-500 text-center">
              Password reset link is expired OR not valid!!!
            </p>
            <Link
              href={"."}
              className="px-4 py-2 mx-auto rounded-lg bg-sky-400 hover:bg-blue-700 text-white"
            >
              Return to home
            </Link>
          </div>
        )}
      </div>
      {form.formState.isSubmitting && <ProcessingOverlay />}
    </div>
  );
};

export default ResetPassword;
