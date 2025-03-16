import dbConnect from "@/lib/dbConnect";
import CategoryModel, { Category } from "@/models/category";
import { NextRequest } from "next/server";

// Create new category
export async function POST(request: Request) {
  await dbConnect();
  try {
    const data = (await request.json()) as Category;

    const categoryExists = await CategoryModel.findOne({
      category_name: data.category_name,
    }).collation({ locale: "en", strength: 2 });

    if (categoryExists) {
      return Response.json(
        { success: false, message: "Category Name already exists" },
        { status: 403 }
      );
    }

    const newCategory = await CategoryModel.create(data);

    return Response.json(
      {
        success: true,
        message: `${newCategory.category_name} category created successfully`,
        category: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in creating New Category", error);
    return Response.json(
      {
        success: false,
        message: "Error in creating New Category",
      },
      { status: 500 }
    );
  }
}

// Get Single or Multiple categories
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");

    if (categoryId && categoryId.length > 0) {
      const category = await CategoryModel.findById(categoryId);

      if (!category) {
        return Response.json(
          {
            success: false,
            message: "Category Not found! Given id is not valid",
          },
          { status: 404 }
        );
      }
      return Response.json(
        {
          success: true,
          message: "Category Found successfully",
          category: category,
        },
        { status: 200 }
      );
    }

    const categories = await CategoryModel.find();

    if (!categories || categories.length == 0) {
      return Response.json(
        { success: false, message: "No category to display" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "categories found", categoryList: categories },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting Category", error);
    return Response.json(
      {
        success: false,
        message: "Error in getting Category",
      },
      { status: 500 }
    );
  }
}

//#region  Update Category
export async function PUT(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");
    const postData = (await request.json()) as Category;

    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      return Response.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const categoryNameExists = await CategoryModel.findOne({
      $and: [
        {
          category_name: {
            $regex: new RegExp(`^${postData.category_name}$`, "i"),
          },
        },
        { _id: { $ne: categoryId } },
      ],
    });

    if (categoryNameExists) {
      return Response.json(
        { success: false, message: "Category Name already exists" },
        { status: 400 }
      );
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      postData,
      { new: true }
    );

    return Response.json(
      { success: true, message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in Updating Category", error);
    return Response.json(
      {
        success: false,
        message: "Error in Updating Category",
      },
      { status: 500 }
    );
  }
}
//#endregion
