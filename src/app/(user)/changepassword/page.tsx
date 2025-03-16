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
import { PasswordSchema } from "@/schemas/passwordSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TbHomeStar } from "react-icons/tb";
import { z } from "zod";

type FormData = z.infer<typeof PasswordSchema>;
const ChangePassword = () => {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: { oldpassword: "", password: "", confirmpassword: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.put<ApiResponse>(
        "/api/user/passwordchange",
        data
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };
  return (
    <div className="w-full p-3">
      <Header />
      <div className="w-full mt-2 bg-pink-50 p-2">
        <div className="bg-fuchsia-900 py-3 rounded-2xl w-full my-2">
          <h2 className="text-2xl text-center font-semibold text-white">
            Change Password
          </h2>
        </div>
        <div className="text-right flex justify-end">
          <Link
            href="/profile"
            className="text-sky-700 hover:text-blue-600 flex w-fit bg-fuchsia-200 hover:bg-slate-300 px-2 py-1 rounded-md"
          >
            <TbHomeStar size={24} /> Home
          </Link>
        </div>
        <div className="max-w-[400px] mx-auto bg-gray-100 p-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="oldpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.oldpassword
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Old Password*
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
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.confirmpassword
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Comfirm Password*
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
              <div className="flex justify-center mt-3">
                <Button
                  type="submit"
                  className="mx-auto text-lg bg-fuchsia-900 font-bold px-6 py-2"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
