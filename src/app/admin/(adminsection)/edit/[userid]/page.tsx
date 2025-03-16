"use client";
import Header from "@/components/header";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Category } from "@/models/category";
import { RegisterSchema } from "@/schemas/registerSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { country_arr, indian_states } from "@/helpers/country.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Label } from "@/components/ui/label";
import { FaCalendarDays } from "react-icons/fa6";
import { PiSparkle } from "react-icons/pi";
import { User } from "@/models/user";
import ProcessingOverlay from "@/components/processing";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { EditSchema } from "@/schemas/editSchema";

type FormData = z.infer<typeof EditSchema>;

const EditRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ userid: string }>();
  const userid = params.userid;

  const form = useForm<FormData>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      title: "",
      fullname: "",
      email: "",
      mobile: "",
      company: "",
      reg_category: "",
      member_no: "",
      mci_no: "",
      dob: undefined,
      age: 0,
      city: "",
      state: "",
      country: "",
      pin: "",
      address: "",
      nationality: "",
      no_of_accompany: 0,
      workshop: "",
      cme: "",
      banquet: "",
      total_amount: 0,
      accompany_amount: 0,
      workshop_amount: 0,
      banquet_amount: 0,
      cme_amount: 0,
      conf_amount: 0,
      payment_status: "Pending",
      receipt_no: "",
    },
  });

  const [categories, setCategories] = useState<Category[] | undefined>([]);
  const getCategories = async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/category");
      if (response.data.success) {
        setCategories(response.data.categoryList);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const [userData, setUserData] = useState<User>();

  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>("/api/user", {
        userId: userid,
      });
      if (response.data.success) {
        setUserData(response.data.user);
        console.log(response.data.user);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [categories]);

  useEffect(() => {
    form.reset({
      title: userData?.title || "",
      fullname: userData?.fullname,
      email: userData?.email,
      mobile: userData?.mobile,
      company: userData?.company,
      reg_category: userData?.reg_category,
      member_no: userData?.member_no || "",
      mci_no: userData?.mci_no,
      dob: userData?.dob || undefined,
      age: userData?.age,
      gender: userData?.gender,
      city: userData?.city,
      state: userData?.state,
      country: userData?.country,
      pin: userData?.pin,
      address: userData?.address,
      nationality: "",
      no_of_accompany: userData?.no_of_accompany || 0,
      workshop: userData?.workshop,
      cme: userData?.cme,
      banquet: userData?.banquet,
      total_amount: userData?.total_amount || 0,
      accompany_amount: userData?.accompany_amount || 0,
      workshop_amount: userData?.workshop_amount || 0,
      cme_amount: userData?.cme_amount || 0,
      banquet_amount: userData?.banquet_amount || 0,
      conf_amount: userData?.conf_amount || 0,
      accompany_persons: userData?.accompany_persons || [],
      pg_certificate_file: "",
      senior_citizen_certificate_file: "",
      currency: userData?.currency || "",
      payment_status: userData?.payment_status,
      receipt_no: userData?.receipt_no,
    });
  }, [userData]);

  const calculateAge = (date: Date | null) => {
    if (!date) return null;
    const today = new Date();
    const birthYear = date.getFullYear();
    const age = today.getFullYear() - birthYear;
    return age;
  };
  const handleDateChange = (date: Date | null) => {
    const age = calculateAge(date);
    form.setValue("age", age || 0); // Set the calculated age
  };

  const { control } = form;
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "accompany_persons",
  });

  const selectedFamilyCount: number = form.watch("no_of_accompany");

  useEffect(() => {
    const currentCount = fields.length;
    const newCount = Number(selectedFamilyCount);

    if (newCount === currentCount) return; // Prevent unnecessary updates

    if (newCount === 0) {
      replace([]); // Reset the array completely when count is 0
    } else if (newCount > currentCount) {
      // Add missing fields
      append(
        Array.from({ length: newCount - currentCount }, () => ({
          accompany_name: "",
          accompany_age: 0,
          accompany_gender: "",
          accompany_banquet: "",
        }))
      );
    } else {
      // Remove extra fields with rest
      const remainingFields = fields.slice(0, newCount);
      replace(remainingFields);
    }
  }, [selectedFamilyCount]); // Only react to selectedFamilyCount changes

  const [accbanquetChanged, setAccbanquetChanged] = useState(false);

  const categorySelected = form.watch("reg_category");
  const countrySelected = form.watch("country");

  useEffect(() => {
    setAccbanquetChanged(!accbanquetChanged);
  }, [selectedFamilyCount]);

  const router = useRouter();
  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          // formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Convert array to string
        } else {
          formData.append(key, String(value));
        }
      });
      if (data.reg_category == "Post Graduate") {
        formData.append(
          "pg_file",
          data.pg_certificate_file ? data.pg_certificate_file : ""
        );
      }
      if (data.reg_category == "FOGSI Member (Above 75 Years)") {
        formData.append(
          "senior_file",
          data.senior_citizen_certificate_file
            ? data.senior_citizen_certificate_file
            : ""
        );
      }

      const response = await axios.post<ApiResponse>(
        "/api/user/updateuser?id=" + userData?._id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          router.push("/admin/reglist");
        }, 2000);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message as string);
    }
  };
  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <div className="max-w-screen-2xl w-full">
      {isLoading && <ProcessingOverlay LabelName="Loading" />}
      <div className=" bg-zinc-700 flex justify-center items-center p-2">
        <h2 className="font-bold md:text-2xl text-xl text-sky-100">
          EDIT USER DETAILS
        </h2>
      </div>
      <div className="w-full md:p-7 p-3 md:pt-2">
        <div className="md:mx-auto mx-0 md:p-4 p-1 bg-gray-200 rounded-md max-w-screen-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="reg_category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.reg_category
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Registration Type*
                      </FormLabel>
                      <FormControl>
                        <select {...field} className="text-input3">
                          <option value=""> Select Category</option>
                          {categories?.map((item, index) => (
                            <option key={item._id as string}>
                              {item.category_name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AnimatePresence>
                  {categorySelected?.startsWith("FOGSI Member") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FormField
                        control={form.control}
                        name="member_no"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={`text-lg font-semibold ${
                                form.formState.errors.member_no
                                  ? "text-black"
                                  : "text-black"
                              }`}
                            >
                              FOGSI Member Number
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.reg_category
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Title*
                      </FormLabel>
                      <FormControl>
                        <div className="px-1 py-2 flex  flex-wrap gap-3">
                          <div className="flex gap-1 items-center">
                            <input
                              type="radio"
                              id="member1"
                              {...field}
                              checked={field.value === "Prof."}
                              value="Prof."
                              className="w-5 h-5 flex-shrink-0"
                            />
                            <Label htmlFor="member1" className="text-lg">
                              Prof.
                            </Label>
                          </div>
                          <div className="flex gap-1 items-center">
                            <input
                              type="radio"
                              id="member2"
                              {...field}
                              value="Dr."
                              checked={field.value === "Dr."}
                              className="w-5 h-5"
                            />
                            <Label htmlFor="member2" className="text-lg">
                              Dr.
                            </Label>
                          </div>
                          <div className="flex gap-1 items-center">
                            <input
                              type="radio"
                              id="member3"
                              {...field}
                              checked={field.value === "Mr."}
                              value="Mr."
                              className="w-5 h-5"
                            />
                            <Label htmlFor="member3" className="text-lg">
                              Mr.
                            </Label>
                          </div>
                          <div className="flex gap-1 items-center">
                            <input
                              type="radio"
                              id="member4"
                              {...field}
                              checked={field.value === "Ms."}
                              value="Ms."
                              className="w-5 h-5"
                            />
                            <Label htmlFor="member4" className="text-lg">
                              Ms.
                            </Label>
                          </div>
                          <div className="flex gap-1 items-center">
                            <input
                              type="radio"
                              id="member5"
                              {...field}
                              checked={field.value === "Mrs."}
                              value="Mrs."
                              className="w-5 h-5"
                            />
                            <Label htmlFor="member5" className="text-lg">
                              Mrs.
                            </Label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.fullname
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Full Name*
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
                  name="mci_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.mci_no
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        State Medical Council Registration No.
                      </FormLabel>
                      <FormControl>
                        <input type="text" {...field} className="text-input3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.company
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Institute/Organization*
                      </FormLabel>
                      <FormControl>
                        <input type="text" {...field} className="text-input3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.dob
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Date of Birth*
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DatePicker
                            placeholderText="Select date"
                            dateFormat="dd-MMM-yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            onChange={(date) => {
                              field.onChange(date ? new Date(date) : null);
                              handleDateChange(date);
                              form.trigger("age");
                            }}
                            className="text-input3 cursor-pointer w-full"
                            selected={field.value}
                            onKeyDown={(e) => e.preventDefault()}
                          />
                          <FaCalendarDays className="absolute top-3 right-5 pointer-events-none cursor-pointer" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.age
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Age*
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          readOnly
                          {...field}
                          className="text-input3 bg-gray-50"
                          placeholder="Auto calculate"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.gender
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Gender*
                      </FormLabel>
                      <FormControl>
                        <select {...field} className="text-input3">
                          <option value="">Select</option>
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.nationality
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Nationality
                      </FormLabel>
                      <FormControl>
                        <input type="text" {...field} className="text-input3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.address
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Address*
                      </FormLabel>
                      <FormControl>
                        <input type="text" {...field} className="text-input3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.country
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Country*
                      </FormLabel>
                      <FormControl>
                        <select {...field} className="text-input3">
                          <option value=""> Select Country</option>
                          {country_arr?.map((item, index) => (
                            <option key={index}>{item}</option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AnimatePresence>
                  {countrySelected == "India" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel
                              className={`text-lg font-semibold ${
                                form.formState.errors.state
                                  ? "text-black"
                                  : "text-black"
                              }`}
                            >
                              State*
                            </FormLabel>
                            <FormControl>
                              <select {...field} className="text-input3">
                                <option value=""> Select State</option>
                                {indian_states?.map((item, index) => (
                                  <option key={index}>{item}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.city
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        City*
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
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.pin
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Pin Code*
                      </FormLabel>
                      <FormControl>
                        <input type="text" {...field} className="text-input3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.mobile
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Mobile Number*
                      </FormLabel>
                      <FormControl className="w-full">
                        <PhoneInput
                          country={"in"} // Default country
                          enableSearch={true}
                          value={field.value}
                          onChange={(phone) => field.onChange(phone)}
                          countryCodeEditable={false}
                          inputProps={{
                            name: "mobile",
                            required: true,
                          }}
                          autoFormat={false}
                          containerClass="p-0 flex w-full"
                          inputClass="phone-input-field text-input3 mr-0 w-full"
                          buttonClass="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        Email Id*
                      </FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          {...field}
                          readOnly
                          className="text-input3"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <AnimatePresence>
                  {categorySelected == "Post Graduate" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="border border-fuchsia-400 p-2">
                        <FormField
                          control={form.control}
                          name="pg_certificate_file"
                          render={({
                            field: { onChange, value, ...field },
                          }) => (
                            <FormItem>
                              <FormLabel
                                className={`text-lg font-semibold ${
                                  form.formState.errors.email
                                    ? "text-black"
                                    : "text-black"
                                }`}
                              >
                                (PG Student) HOD Letter Upload*
                              </FormLabel>
                              <FormControl>
                                <input
                                  type="file"
                                  {...field} // Spread the field props (except `value` and `onChange`)
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]; // Get the selected file
                                    onChange(file); // Update the form state
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Please upload the letter from the
                                HOD/Institution (If you are a PG student)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {categorySelected == "FOGSI Member (Above 75 Years)" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="border border-fuchsia-400 p-2">
                        <FormField
                          control={form.control}
                          name="senior_citizen_certificate_file"
                          render={({
                            field: { onChange, value, ...field },
                          }) => (
                            <FormItem>
                              <FormLabel
                                className={`text-lg font-semibold ${
                                  form.formState.errors
                                    .senior_citizen_certificate_file
                                    ? "text-black"
                                    : "text-black"
                                }`}
                              >
                                (Senior Citizen) Id Proof Upload*
                              </FormLabel>
                              <FormControl>
                                <input
                                  type="file"
                                  {...field} // Spread the field props (except `value` and `onChange`)
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]; // Get the selected file
                                    onChange(file); // Update the form state
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                Please upload the Id Proof (If you are a Senior
                                Citizen)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="bg-fuchsia-900 py-3 rounded-lg w-full my-2">
                <h2 className="text-2xl text-center font-semibold text-white">
                  Workshop Details (14<sup>th</sup> Jan 2026)
                </h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="workshop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.workshop
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Workshop 14<sup>th</sup> Jan 2026{" "}
                      </FormLabel>
                      <FormControl className="w-full">
                        <select {...field} className="text-input3">
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="bg-fuchsia-900 py-3 rounded-lg w-full my-2">
                <h2 className="text-2xl text-center font-semibold text-white">
                  CG Saraiya CME (15<sup>th</sup> Jan 2026)
                </h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="cme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.cme
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        CG Saraiya CME
                      </FormLabel>
                      <FormControl className="w-full">
                        <select {...field} className="text-input3">
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="bg-fuchsia-900 py-3 rounded-lg w-full my-2">
                <h2 className="text-2xl text-center font-semibold text-white">
                  Banquet Dinner for Primary Delegate (17<sup>th</sup> Jan 2026)
                </h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="banquet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.banquet
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Banquet
                      </FormLabel>
                      <FormControl className="w-full">
                        <select {...field} className="text-input3">
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-fuchsia-900 py-3 rounded-lg w-full my-2">
                <h2 className="text-2xl text-center font-semibold text-white">
                  Accompanying Person Details
                </h2>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="no_of_accompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.no_of_accompany
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Number of Accompanying Person
                      </FormLabel>
                      <FormControl className="w-full">
                        <select
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value)
                            )
                          }
                          className="text-input3"
                        >
                          <option value="0">None</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <AnimatePresence>
                {fields.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      overflow: "hidden",
                      marginBottom: "10px",
                      borderBottom: "1px solid #ccc",
                      paddingBottom: "10px",
                    }}
                  >
                    <div className="bg-pink-50">
                      <h2 className="text-lg font-semibold px-3 border-b-2 my-1 bg-fuchsia-200">
                        Accompany person {index + 1} details
                      </h2>
                      <div className="w-full gap-1 grid lg:grid-cols-5 md:grid-col-2 grid-cols-1">
                        <FormField
                          control={form.control}
                          name={
                            `accompany_persons.${index}.accompany_name` as const
                          }
                          render={({ field }) => (
                            <FormItem className="md:col-span-2 col-span-1">
                              <FormLabel
                                className={`text-lg font-semibold ${
                                  form.formState.errors.accompany_persons?.[
                                    index
                                  ]?.accompany_name
                                    ? "text-black"
                                    : "text-black"
                                }`}
                              >
                                Accompany Name*
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
                          name={
                            `accompany_persons.${index}.accompany_age` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={`text-lg font-semibold ${
                                  form.formState.errors.accompany_persons?.[
                                    index
                                  ]?.accompany_age
                                    ? "text-black"
                                    : "text-black"
                                }`}
                              >
                                Age*
                              </FormLabel>
                              <FormControl>
                                <input
                                  type="number"
                                  {...field}
                                  className="text-input3"
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value === ""
                                        ? ""
                                        : parseFloat(e.target.value)
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={
                            `accompany_persons.${index}.accompany_gender` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={`text-lg font-semibold ${
                                  form.formState.errors.accompany_persons?.[
                                    index
                                  ]?.accompany_gender
                                    ? "text-black"
                                    : "text-black"
                                }`}
                              >
                                Gender*
                              </FormLabel>
                              <FormControl>
                                <select {...field} className="text-input3">
                                  <option value="">Select</option>
                                  <option>Male</option>
                                  <option>Female</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={
                            `accompany_persons.${index}.accompany_banquet` as const
                          }
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel
                                className={`text-lg font-semibold ${
                                  form.formState.errors.accompany_persons?.[
                                    index
                                  ]?.accompany_banquet
                                    ? "text-black"
                                    : "text-black"
                                }`}
                              >
                                Banquet*
                              </FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    setAccbanquetChanged(!accbanquetChanged);
                                  }}
                                  className="text-input3"
                                >
                                  <option>No</option>
                                  <option>Yes</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="p-1">
                <hr />
              </div>
              <div className="bg-fuchsia-900 py-3 rounded-lg w-full my-2">
                <h2 className="text-2xl text-center font-semibold text-white">
                  Payment Details
                </h2>
              </div>
              <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.currency
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Currency*
                      </FormLabel>
                      <FormControl>
                        <select className="text-input3" {...field}>
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                        </select>
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
                        Conference Amt.*
                      </FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
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
                        CME Amt.*
                      </FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
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
                        Workshop Amt.*
                      </FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
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
                        Banquet Amt.*
                      </FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
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
                        Accompany Amt.*
                      </FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
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
                  name="total_amount"
                  render={({ field }) => (
                    <FormItem className="bg-green-400/50">
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.total_amount
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        <b> Total Amount*</b>
                      </FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? ""
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
              <div className="grid md:grid-cols-3  border-t-2 border-sky-700 grid-cols-1 gap-3">
                <FormField
                  control={form.control}
                  name="payment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.payment_status
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Payment Status*
                      </FormLabel>
                      <FormControl>
                        <select className="text-input3" {...field}>
                          <option>Pending</option>
                          <option>Paid</option>
                          <option>Complementary</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receipt_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={`text-lg font-semibold ${
                          form.formState.errors.receipt_no
                            ? "text-black"
                            : "text-black"
                        }`}
                      >
                        Receipt no./Remark
                      </FormLabel>
                      <FormControl>
                        <input type="text" {...field} className="text-input3" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-1">
                <hr />
              </div>

              <div className="flex flex-col justify-start mt-3">
                <hr className="bg-black border border-black" />
                <Button
                  type="submit"
                  className="ml-3 w-fit mt-3 text-lg bg-fuchsia-900 font-bold px-6 py-2"
                >
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {form.formState.isSubmitting && <ProcessingOverlay />}
    </div>
  );
};

export default EditRegistration;
