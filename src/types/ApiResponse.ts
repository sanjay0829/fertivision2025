import { Category } from "@/models/category";
import { User } from "@/models/user";

export interface ApiResponse {
  success: boolean;
  message: string;
  user?: User;
  userList?: User[];
  category?: Category;
  categoryList?: Category[];
}
