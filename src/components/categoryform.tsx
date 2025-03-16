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

interface CategoryProps {
  categoryId?: string;
  buttonText: string;
  closeModal: () => void;
  updateCategories: () => void;
}

type FormData = z.infer<typeof CategorySchema>;
const Categoryform: React.FC<CategoryProps> = ({
  categoryId,
  buttonText,
  closeModal,
  updateCategories,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      category_name: "",
      conf_amount: 0,
      workshop_amount: 0,
      accompany_amount: 0,
      cme_amount: 0,
      banquet_amount: 0,
    },
  });

  const getCategory = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/category", {
        params: { categoryId: categoryId },
      });
      if (response.data.success) {
        form.reset(response.data.category);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    if (categoryId && categoryId.length > 0) {
      getCategory();
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      if (categoryId && categoryId.length > 0) {
        const response = await axios.put<ApiResponse>(
          "/api/category?categoryId=" + categoryId,
          data
        );
        if (response.data.success) {
          toast.success(response.data.message);
          closeModal();
          updateCategories();
        }
      } else {
        const response = await axios.post<ApiResponse>("/api/category", data);
        if (response.data.success) {
          toast.success(response.data.message);
          closeModal();
          updateCategories();
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  return (
    <div className="max-w-7xl w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="bg-slate-300 text-center text-xl font-bold rounded-t-lg">
            {categoryId && categoryId.length > 0
              ? "Update Category"
              : " Add New Category"}
          </h2>
          <div className="flex w-full p-2 flex-col items-center gap-4 bg-zinc-100">
            <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-2">
              <FormField
                control={form.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.category_name
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Category Name*
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
                name="conf_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.conf_amount
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Conference Amount
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value)
                          )
                        }
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
                name="banquet_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.banquet_amount
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Banquet Amount
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value)
                          )
                        }
                        className="text-input3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workshop_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.workshop_amount
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Workshop Amount
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value)
                          )
                        }
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
                name="accompany_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.accompany_amount
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      Accompany Amount
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value)
                          )
                        }
                        className="text-input3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cme_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={`text-lg font-semibold ${
                        form.formState.errors.cme_amount
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      CME Amount
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : parseFloat(e.target.value)
                          )
                        }
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
                {buttonText}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Categoryform;
