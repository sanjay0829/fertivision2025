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
import { z } from "zod";

const ForgotSchema = z.object({
  email: z
    .string()
    .email("Please enter valid email id")
    .min(1, "Email id is required"),
});

type FormData = z.infer<typeof ForgotSchema>;

const ForgotPassword = () => {
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(ForgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.get<ApiResponse>("/api/user/checkemail", {
        params: { email: data.email },
      });

      if (response.data.success) {
        toast.success("Password reset link is sent to registered email id");
        setMessage("Password reset link is sent to registered email id");
        setVerified(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
      setMessage(axiosError.response?.data.message as string);
      setVerified(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-slate-300 w-full flex flex-col justify-center items-center">
      <div className="max-w-screen-md w-full my-2 p-2 border border-zinc-500 bg-gradient-to-br shadow-lg shadow-fuchsia-500 rounded-lg from-fuchsia-700/20 to-purple-400/10">
        <Header />
        <div className="bg-fuchsia-900 py-3 rounded-2xl w-full my-2">
          <h2 className="text-2xl text-center font-semibold text-white">
            Forgot Password
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
                <div className="text-center text-blue-600 mb-3">
                  <p>
                    Enter your registered email id to get password reset link
                  </p>
                </div>
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
                          Registered Email ID*
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
      </div>
      {form.formState.isSubmitting && <ProcessingOverlay />}
    </div>
  );
};

export default ForgotPassword;
