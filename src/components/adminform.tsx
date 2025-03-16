import React, { FormEvent, useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CategorySchema } from "@/schemas/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { AdminSchema } from "@/schemas/adminSchema";

interface AdminProps {
  adminId?: string;
  buttonText: string;
  closeModal: () => void;
  updateAdminUsers: () => void;
}

type FormData = z.infer<typeof AdminSchema>;

const Adminform: React.FC<AdminProps> = ({
  adminId,
  buttonText,
  closeModal,
  updateAdminUsers,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      name: "",
      login_id: "",
      login_password: "",
      confirm_password: "",
      user_type: "",
    },
  });

  const getAdmin = async () => {
    try {
      const response = await axios.get("/api/admin/adminuser", {
        params: { adminId: adminId },
      });
      if (response.data.success) {
        console.log(response.data);

        form.reset({
          ...response.data.admin,
          confirm_password: response.data.admin.login_password,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    if (adminId && adminId.length > 0) {
      getAdmin();
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      if (adminId && adminId.length > 0) {
        const response = await axios.put<ApiResponse>(
          "/api/admin/adminuser?adminId=" + adminId,
          data
        );
        if (response.data.success) {
          toast.success(response.data.message);
          closeModal();
          updateAdminUsers();
        }
      } else {
        const response = await axios.post<ApiResponse>(
          "/api/admin/adminuser",
          data
        );
        if (response.data.success) {
          toast.success(response.data.message);
          closeModal();
          updateAdminUsers();
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  return (
    <div className="max-w-screen-md w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="bg-slate-300 text-center text-xl font-bold rounded-t-lg">
            {adminId && adminId.length > 0
              ? "Update Admin User"
              : " Add New Admin"}
          </h2>
          <div className="flex w-full p-2 flex-col items-center gap-4 bg-zinc-100">
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.name ? "text-black" : "text-black"
                      }`}
                    >
                      Admin Name*
                    </FormLabel>
                    <FormControl>
                      <input type="text" {...field} className="text-input3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      Login ID
                    </FormLabel>
                    <FormControl>
                      <input type="text" {...field} className="text-input3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-2">
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
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-2">
              <FormField
                control={form.control}
                name="user_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.user_type
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Admin Type*
                    </FormLabel>
                    <FormControl>
                      <select {...field} className="text-input3">
                        <option value="">Select</option>
                        <option>master</option>
                        <option>manager</option>
                        <option>user</option>
                      </select>
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
                {buttonText}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Adminform;
