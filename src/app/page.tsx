"use client";
import Header from "@/components/header";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignupSchema } from "@/schemas/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import ProcessingOverlay from "@/components/processing";
import Link from "next/link";

type FormData = z.infer<typeof SignupSchema>;

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post<ApiResponse>(
        "/api/user/create_account",
        data
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };
  return (
    <div className="w-full bg-gradient-to-tr from-amber-100 via-sky-100 to-violet-50 min-h-screen flex items-center justify-center p-1">
      <div className="w-full max-w-3xl border-3 rounded-lg border-green-300">
        <Header />
        <div className="w-full">
          <div className="flex flex-col items-center justify-center py-3 px-2">
            <h3 className="text-4xl   text-center w-full  bg-blue-900 text-white rounded-2xl mx-2 font-[900] py-2 border-b-2 border-t-2 border-green-300/40">
              Registration
            </h3>
            <div className="w-full mt-3 flex justify-center">
              <h3 className="text-xl font-normal py-2 mx-1 w-full text-center bg-white  rounded-4xl ring-2 ring-amber-300/20">
                Create account to begin
              </h3>
            </div>
            <div className=" p-0 bg-gray-100 max-w-[650px] mx-auto w-full  rounded-2xl border  mt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex  p-2 md:mx-5 gap-2 flex-col">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-2 w-full">
                      <FormField
                        control={form.control}
                        name="fname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-lg font-semibold`}>
                              First Name*
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
                        name="lname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-lg font-semibold`}>
                              Last Name*
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
                    </div>
                    <div className="w-full flex flex-col gap-2 justify-center">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-lg font-semibold`}>
                              Email Id (Login Id)*
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
                              Create Password*
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
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    title="Hide Password"
                                  />
                                ) : (
                                  <IoIosEye
                                    className="absolute top-3 right-2 cursor-pointer"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    title="View Password"
                                  />
                                )}
                              </div>
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
                    </div>
                    <div className="flex w-full justify-start mt-3">
                      <Button
                        type="submit"
                        className="mx-auto text-lg bg-green-900 hover:bg-green-600 font-bold px-6 py-2 cursor-pointer"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
              <div className="w-full flex justify-end my-2">
                <p className="p-1 bg-pink-100">
                  Already Resistered?{" "}
                  <Link
                    href={"/login"}
                    className="text-blue-500 hover:text-sky-800"
                  >
                    Click here
                  </Link>
                </p>
              </div>
            </div>
            {form.formState.isSubmitting && <ProcessingOverlay />}
          </div>
        </div>
      </div>
    </div>
  );
}
