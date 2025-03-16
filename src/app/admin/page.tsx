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
import { AdminLoginSchema } from "@/schemas/adminLoginSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type FormData = z.infer<typeof AdminLoginSchema>;
const AdminPage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: { login_id: "", login_password: "" },
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("/api/admin/adminauth", data);
      if (response.data.success) {
        toast.success("Login Successful");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  return (
    <div className="w-full bg-gradient-to-tr from-amber-100 via-sky-100 to-violet-50 min-h-screen flex items-center justify-center p-1">
      <div className="w-full max-w-2xl border-3 rounded-lg border-green-300 shadow-2xl ">
        <Header />
        <div className="bg-blue-900 py-3 rounded-2xl  my-2 flex mx-1 justify-center">
          <h2 className="text-2xl text-center font-semibold text-white">
            Admin Section
          </h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto w-full max-w-[400px] space-y-4  mb-4 ">
              <FormField
                control={form.control}
                name="login_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.login_id
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Login ID*
                    </FormLabel>
                    <FormControl>
                      <input type="text" {...field} className="text-input3" />
                    </FormControl>
                    <FormMessage className="m-0" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="login_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.login_password
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Password*
                    </FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        {...field}
                        className="text-input3"
                      />
                    </FormControl>
                    <FormMessage className="m-0" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="mx-auto text-lg bg-fuchsia-900 font-bold px-6 py-2"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminPage;
