import mongoose, { Schema, Document } from "mongoose";

export interface Adminuser extends Document {
  name: string;
  login_id: string;
  login_password: string;
  user_type: string;
}

const AdminSchema: Schema<Adminuser> = new Schema({
  name: {
    type: String,
    required: [true, "Admin Name is required"],
    trim: true,
  },
  login_id: {
    type: String,
    required: [true, "Login Id is required"],
    trim: true,
  },
  login_password: {
    type: String,
    required: [true, "Login password is required"],
    trim: true,
  },
  user_type: {
    type: String,
    required: [true, "User Type is required"],
    trim: true,
  },
});

const AdminModel =
  (mongoose.models.Adminuser as mongoose.Model<Adminuser>) ||
  mongoose.model<Adminuser>("Adminuser", AdminSchema);

export default AdminModel;
