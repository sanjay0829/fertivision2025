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

import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/usercontext";

type AccompanyPerson = {
  id: string; // react-hook-form requires an `id` field for useFieldArray
  accompany_name: string;
  accompany_age: number;
  accompany_gender: string;
  accompany_banquet: string;
};

type FormData = z.infer<typeof RegisterSchema>;
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      title: "",
      fullname: "",
      //lname: "",
      email: "",
      mobile: "",
      company: "",
      reg_category: "",
      member_no: "",
      gender: "",
      city: "",
      state: "",
      country: "",
      pin: "",
      address: "",
      nationality: "",
      no_of_accompany: 0,
      pre_workshop: "",
      post_workshop: "",
      total_amount: 0,
      accompany_amount: 0,
      workshop_amount: 0,
      cme_amount: 0,
      conf_amount: 0,
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
      const response = await axios.get<ApiResponse>("/api/user");
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
      //lname: userData?.lname,
      email: userData?.email,
      mobile: userData?.mobile,
      company: userData?.company,
      reg_category: userData?.reg_category,
      member_no: userData?.member_no || "",
      gender: userData?.gender,
      city: userData?.city,
      state: userData?.state,
      country: userData?.country,
      pin: userData?.pin,
      address: userData?.address,
      nationality: "",
      no_of_accompany: userData?.no_of_accompany || 0,
      pre_workshop: userData?.pre_workshop,
      post_workshop: userData?.post_workshop,
      accomodation_type: userData?.accomodation_type,
      accomodation_amount: userData?.accomodation_amount,
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
    });
    if (
      userData?.payment_status == "Paid" ||
      userData?.payment_status == "Complementary"
    ) {
      router.push("/profile");
    }
    setCurrencyType();
  }, [userData]);

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

      //Just Hides the extra fields
      // remove(
      //   Array.from(
      //     { length: currentCount - newCount },
      //     (_, i) => currentCount - 1 - i
      //   )
      // );

      // for (let i = newCount; i < currentCount; i++) {
      //   form.setValue(`accompany_persons.${i}.accompany_name`, "");
      //   form.setValue(`accompany_persons.${i}.accompany_age`, 0);
      //   form.setValue(`accompany_persons.${i}.accompany_gender`, "");
      //   form.setValue(`accompany_persons.${i}.accompany_banquet`, "");
      // }
    }
  }, [selectedFamilyCount]); // Only react to selectedFamilyCount changes

  const [totalAmount, setTotalAmount] = useState(0);
  const [conferenceAmount, setConferenceAmount] = useState(0);
  const [accompanyAmount, setAccompanyAmount] = useState(0);
  const [workshopAmount, setWorkshopAmount] = useState(0);
  const [accomodationAmount, setAccomodationAmount] = useState(0);

  const [currency, setCurrency] = useState("INR");

  const [accbanquetChanged, setAccbanquetChanged] = useState(false);

  const [accompanyVisible, setAccompanyVisible] = useState(true);
  const preWorkshop = form.watch("pre_workshop");
  const postWorkshop = form.watch("post_workshop");
  const categorySelected = form.watch("reg_category");
  const countrySelected = form.watch("country");
  const accomodationSelected = form.watch("accomodation_type");
  const accompanyselected = form.watch("accompany_persons", []);

  useEffect(() => {
    setAccbanquetChanged(!accbanquetChanged);
  }, [selectedFamilyCount]);

  const setCurrencyType = () => {
    setCurrency("INR");
    if (
      categorySelected == "IFS Member" ||
      categorySelected == "Non IFS Member" ||
      categorySelected == "Only Workshop Registration" ||
      categorySelected == "PG Students"
    ) {
      setCurrency("INR");

      form.setValue("currency", "INR");
      setAccompanyVisible(true);
    } else if (categorySelected == "") {
      setCurrency("INR");

      form.setValue("currency", "INR");
      setAccompanyVisible(true);
    } else {
      setCurrency("USD");
      form.setValue("currency", "USD");
      form.setValue("no_of_accompany", 0);
      setAccompanyVisible(false);
    }
  };

  useEffect(() => {
    // Calculate total amount dynamically
    //console.log("selected Category", selectedCategory);
    setCurrencyType();
    const category = categories?.find(
      (cat) => cat.category_name === categorySelected
    );

    let workshopTotal = 0;
    if (preWorkshop != "" || postWorkshop != "") {
      workshopTotal = category?.workshop_amount || 0;
    }
    setWorkshopAmount(workshopTotal);
    form.setValue("workshop_amount", workshopTotal);

    const accompanyTotal =
      selectedFamilyCount > 0 ? category?.accompany_amount || 0 : 0;

    setConferenceAmount(category?.conf_amount || 0);
    form.setValue("conf_amount", category?.conf_amount || 0);

    setAccompanyAmount(accompanyTotal * selectedFamilyCount);
    form.setValue("accompany_amount", accompanyTotal * selectedFamilyCount);

    let accomodationTotal = 0;

    if (accomodationSelected != "") {
      if (categorySelected == "Foreign Delegates") {
        accomodationTotal =
          accomodationSelected == "Twin Sharing"
            ? 120
            : accomodationSelected == "Single Room"
            ? 220
            : accomodationSelected == "Double Room"
            ? 180
            : 0;
      } else {
        accomodationTotal =
          accomodationSelected == "Twin Sharing"
            ? 5000
            : accomodationSelected == "Single Room"
            ? 10000
            : accomodationSelected == "Double Room"
            ? 8000
            : 0;
      }
    }

    setAccomodationAmount(accomodationTotal);

    form.setValue("accomodation_amount", accomodationTotal);

    let finalAmount = 0;

    finalAmount =
      (category?.conf_amount || 0) +
      accompanyTotal * selectedFamilyCount +
      workshopTotal +
      accomodationTotal;

    setTotalAmount(finalAmount);
    form.setValue("total_amount", finalAmount);

    console.log("totalAmount2", totalAmount);
  }, [
    categorySelected,
    preWorkshop,
    postWorkshop,
    selectedFamilyCount,
    accomodationSelected,
    form.setValue,
    accbanquetChanged,
    accompanyselected,
  ]);
  const router = useRouter();

  const { setUsername } = useAppContext();

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
      if (data.reg_category == "PG Students") {
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
        "/api/user/register?id=" + userData?._id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/payment");
        setUsername(data.fullname);
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
    <div className="w-full p-2">
      {isLoading && <ProcessingOverlay LabelName="Loading" />}
      <Header />
      <div className="bg-green-900 py-3 rounded-2xl w-full my-2">
        <h2 className="text-2xl text-center font-semibold text-white">
          Registration Form
        </h2>
      </div>
      <div className="md:mx-2 mx-0 md:p-4 p-1 bg-gray-200 rounded-md">
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
                {categorySelected?.startsWith("IFS Member") && (
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
                            IFS Member Number
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
                    <FormLabel className={`text-lg font-semibold `}>
                      First Name*
                    </FormLabel>
                    <FormControl>
                      <input type="text" {...field} className="text-input3" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
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
                name="company"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className={`text-lg font-semibold  `}>
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
                        form.formState.errors.city ? "text-black" : "text-black"
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
                        form.formState.errors.pin ? "text-black" : "text-black"
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
                {categorySelected == "PG Students" && (
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
                        render={({ field: { onChange, value, ...field } }) => (
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
                              Please upload the letter from the HOD/Institution
                              (If you are a PG student)
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
                        render={({ field: { onChange, value, ...field } }) => (
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
            <div className="bg-green-900 py-3 rounded-lg w-full my-2">
              <h2 className="text-2xl text-center font-semibold text-white">
                Pre Conference Workshop (12<sup>th</sup> Dec 2025)
              </h2>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="pre_workshop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-lg font-semibold `}>
                      Pre Lunch Workshop (9:00AM to 1:00PM)
                    </FormLabel>
                    <FormControl className="w-full">
                      <select {...field} className="text-input3">
                        <option value={""}>Select</option>
                        <option>
                          Mastering Technique in Laparoscopic Surgery (Live)
                        </option>
                        <option>
                          Minimal Access Surgery Hands on Skill Course
                        </option>
                        <option>Tracking Quality – KPI & ART Success</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="post_workshop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-lg font-semibold `}>
                      Post Lunch Workshop (2:00PM to 6:00PM)
                    </FormLabel>
                    <FormControl className="w-full">
                      <select {...field} className="text-input3">
                        <option value={""}>Select</option>
                        <option>OPU and ET</option>
                        <option>Counselling Techniques in ART</option>
                        <option>Tips and Tricks of Cryopreservation</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {accompanyVisible && (
              <>
                <div className="bg-green-900 py-3 rounded-lg w-full my-2">
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
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

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
                    <h2 className="text-lg font-semibold px-3 border-b-2 my-1 bg-sky-200">
                      Accompany person {index + 1} details
                    </h2>
                    <div className="w-full gap-1 grid lg:grid-cols-4 md:grid-col-2 grid-cols-1 px-2 pb-2">
                      <FormField
                        control={form.control}
                        name={
                          `accompany_persons.${index}.accompany_name` as const
                        }
                        render={({ field }) => (
                          <FormItem className="md:col-span-2 col-span-1">
                            <FormLabel
                              className={`text-lg font-semibold ${
                                form.formState.errors.accompany_persons?.[index]
                                  ?.accompany_name
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
                                form.formState.errors.accompany_persons?.[index]
                                  ?.accompany_age
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
                                form.formState.errors.accompany_persons?.[index]
                                  ?.accompany_gender
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="bg-green-900 py-3 rounded-lg w-full my-2">
              <h2 className="text-2xl text-center font-semibold text-white">
                Select Accomodation (if required)
              </h2>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
              <FormField
                control={form.control}
                name="accomodation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-lg font-semibold `}>
                      Accomodation Type
                    </FormLabel>
                    <FormControl className="w-full">
                      <select {...field} className="text-input3">
                        <option value={""}>Select</option>
                        <option value={"Twin Sharing"}>
                          Twin Sharing Per Person (Two Person Sharing a Common
                          Room)
                        </option>
                        <option value={"Single Room"}>
                          Single Room (1 Person)
                        </option>
                        <option value={"Double Room"}>
                          Double Room (2 Persons)
                        </option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-1">
              <hr />
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 items-end">
              <div></div>
              <div className="border border-slate-500">
                <h2 className="text-lg font-bold px-1 bg-green-700 text-white py-2">
                  Payment Details
                </h2>
                <table className="w-full font-bold text-lg">
                  <tbody>
                    <tr>
                      <td className="px-2">
                        Conference Amount (13<sup>th</sup> & 14<sup>th</sup>{" "}
                        Dec) :
                      </td>
                      <td>
                        {currency == "INR" ? "₹" : "$"} {conferenceAmount}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2">
                        Workshop Amount (12<sup>th</sup> Dec) :
                      </td>
                      <td>
                        {currency == "INR" ? "₹" : "$"} {workshopAmount}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1">
                        Accompanying Person Amount{" "}
                        <span className="p-1 bg-amber-100">
                          {" "}
                          (x {selectedFamilyCount}) :
                        </span>
                      </td>
                      <td>
                        {currency == "INR" ? "₹" : "$"} {accompanyAmount}
                      </td>
                    </tr>
                    {accomodationSelected != "" && (
                      <tr>
                        <td className="px-2 py-1">Accomodation Amount :</td>
                        <td>
                          {currency == "INR" ? "₹" : "$"} {accomodationAmount}
                        </td>
                      </tr>
                    )}

                    <tr className="bg-gray-700 text-white">
                      <td className="px-2">Total Amount :</td>
                      <td>
                        <span>
                          {currency == "INR" ? "₹" : "$"} {totalAmount}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={2}
                        className="bg-green-500 text-right text-white text-sm"
                      >
                        *Bank Convenience Fee @3.5%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-col justify-start mt-3">
              <hr className="bg-black border border-black" />
              <Button
                type="submit"
                className="ml-3 w-fit mt-3 text-lg bg-green-900 font-bold px-6 py-2"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {form.formState.isSubmitting && <ProcessingOverlay />}
    </div>
  );
};

export default Register;
