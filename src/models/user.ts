import mongooose, { Schema, Document } from "mongoose";

export interface Accompany_Person extends Document {
  accompany_name: string;
  accompany_age: number;
  accompany_gender: string;
  accompany_banquet: string;
}

const AccompanySchema: Schema<Accompany_Person> = new Schema(
  {
    accompany_name: {
      type: String,
      required: [true, "Accompnay Name is required"],
    },
    accompany_age: { type: Number },
    accompany_gender: { type: String },
    accompany_banquet: { type: String },
  },
  { timestamps: true }
);

export interface User extends Document {
  title: string;
  reg_no: string;
  reg_category: string;
  fname: string;
  lname: string;
  fullname: string;
  email: string;
  mobile: string;
  designation: string;
  company: string;
  gender: string;
  dob: Date;
  age: number;
  city: string;
  state: string;
  country: string;
  pin: string;
  address: string;
  member_no: string;
  mci_no: string;
  banquet: string;
  cme: string;
  workshop: string;
  pre_workshop: string;
  post_workshop: string;
  accomodation_type: string;
  room_type: string;
  no_of_accompany: number;
  accompany_persons: Accompany_Person[];
  payment_status: string;
  payment_date: Date;
  receipt_no: string;

  order_no: string;
  total_amount: number;
  conf_amount: number;
  banquet_amount: number;
  cme_amount: number;
  workshop_amount: number;
  accompany_amount: number;
  accomodation_amount: number;
  discount_amount: number;
  currency: string;
  coupon_code: string;
  reg_status: string;
  password: string;
  pg_certificate: string;
  senior_citizen_certificate: string;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: Date;
}

function toTitleCase(str: string) {
  return str
    .split(" ") // Split the string into words
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize first letter and lowercase the rest
    )
    .join(" "); // Join the words back together
}

const UserSchema: Schema<User> = new Schema(
  {
    title: { type: String },
    reg_no: {
      type: String,
      trim: true,
      required: [true, "Registration number is required "],
    },
    reg_category: { type: String, trim: true },
    fname: { type: String, set: toTitleCase, trim: true },
    lname: { type: String, set: toTitleCase, trim: true },
    fullname: { type: String, set: toTitleCase, trim: true },
    email: {
      type: String,
      trim: true,
      required: [true, "Email id is required"],
    },
    mobile: { type: String, trim: true },
    designation: { type: String, trim: true },
    company: { type: String, trim: true },
    gender: { type: String, trim: true },
    dob: { type: Date, trim: true },
    age: { type: Number, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pin: { type: String, trim: true },
    address: { type: String, trim: true },
    member_no: { type: String, trim: true },
    mci_no: { type: String, trim: true },
    banquet: { type: String, trim: true },
    cme: { type: String, trim: true },
    workshop: { type: String, trim: true },
    pre_workshop: { type: String, trim: true },
    post_workshop: { type: String, trim: true },
    accomodation_type: { type: String, trim: true },
    room_type: { type: String, trim: true },
    no_of_accompany: { type: Number, trim: true },
    accompany_persons: [AccompanySchema],
    payment_status: { type: String, trim: true, default: "Pending" },
    payment_date: { type: Date, trim: true },
    receipt_no: { type: String, trim: true },
    order_no: { type: String, trim: true },
    total_amount: { type: Number, trim: true },
    conf_amount: { type: Number, trim: true },
    banquet_amount: { type: Number, trim: true },
    accompany_amount: { type: Number, trim: true },
    cme_amount: { type: Number, trim: true },
    workshop_amount: { type: Number, trim: true },
    accomodation_amount: { type: Number, trim: true },
    discount_amount: { type: Number, trim: true },
    currency: { type: String, trim: true },
    coupon_code: { type: String, trim: true },
    reg_status: { type: String, trim: true },
    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
    },
    pg_certificate: { type: String, trim: true },
    senior_citizen_certificate: { type: String, trim: true },
    forgotPasswordToken: { type: String, trim: true },
    forgotPasswordTokenExpiry: { type: Date, trim: true },
  },
  { timestamps: true }
);

const UserModel =
  (mongooose.models.User as mongooose.Model<User>) ||
  mongooose.model<User>("User", UserSchema);

export default UserModel;
