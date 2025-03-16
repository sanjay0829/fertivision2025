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
import { LoginSchema } from "@/schemas/loginSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { z } from "zod";

type FormData = z.infer<typeof LoginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post<ApiResponse>("/api/user/login", data);
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/profile");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-slate-300 w-full flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full my-2 p-2 border border-zinc-500 bg-gradient-to-br shadow-lg shadow-slate-500 rounded-lg from-amber-100 via-sky-100 to-violet-50">
        <Header />
        <div className="bg-green-900 py-3 rounded-2xl w-full my-2">
          <h2 className="text-2xl text-center font-semibold text-white">
            FERTIVISION 2025 LOGIN
          </h2>
        </div>
        <div className=" p-2 bg-gray-100 md:mx-3 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex w-full justify-end">
                <p className="bg-pink-100 p-1 rounded-md">
                  Not Registered?{" "}
                  <Link
                    href={"/"}
                    className="cursor-pointer text-sky-600 hover:text-blue-500"
                  >
                    {" "}
                    Click Here to register
                  </Link>
                </p>
              </div>
              <div className="m-2 flex flex-col  border rounded-md mt-4">
                <div className="mx-auto w-full max-w-[400px] space-y-4 mb-4 ">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={`text-lg font-semibold ${
                            form.formState.errors.email
                              ? "text-black"
                              : "text-black"
                          }`}
                        >
                          Email ID* (Login ID)
                        </FormLabel>
                        <FormControl>
                          <input
                            type="text"
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
                          Password*
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"} // Toggle input type
                              {...field}
                              className="text-input3"
                            />
                            {showPassword ? (
                              <IoIosEyeOff
                                className="absolute top-3 right-2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                                title="Hide Password"
                              />
                            ) : (
                              <IoIosEye
                                className="absolute top-3 right-2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                                title="View Password"
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className="mx-auto text-lg bg-green-900 font-bold px-6 py-2"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-end">
                <p className="bg-pink-100 p-1 rounded-md">
                  Forgot Password?{" "}
                  <Link
                    href={"/forgotpassword"}
                    className="cursor-pointer text-sky-600 hover:text-blue-500"
                  >
                    {" "}
                    Click Here
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {form.formState.isSubmitting && <ProcessingOverlay />}
    </div>
  );
};

export default Login;
