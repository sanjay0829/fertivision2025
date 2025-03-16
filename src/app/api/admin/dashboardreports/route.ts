import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const callType = url.searchParams.get("calltype");
    console.log(callType);

    //check calltype
    if (!callType) {
      return Response.json(
        {
          success: false,
          message: "Call Type is required",
        },
        { status: 400 }
      );
    }

    //Registration Counts
    if (callType == "counts") {
      const countData = await UserModel.aggregate([
        {
          $facet: {
            TOTAL_REG: [{ $count: "total" }],
            PAID: [{ $match: { payment_status: "Paid" } }, { $count: "paid" }],
            PENDING: [
              { $match: { payment_status: "Pending" } },
              { $count: "pending" },
            ],
            FREE: [
              { $match: { payment_status: "Complementary" } },
              { $count: "complementary" },
            ],
          },
        },
        {
          $project: {
            TOTAL_REG: {
              $ifNull: [{ $arrayElemAt: ["$TOTAL_REG.total", 0] }, 0],
            },
            PAID: { $ifNull: [{ $arrayElemAt: ["$PAID.paid", 0] }, 0] },
            PENDING: {
              $ifNull: [{ $arrayElemAt: ["$PENDING.pending", 0] }, 0],
            },
            FREE: {
              $ifNull: [{ $arrayElemAt: ["$FREE.complementary", 0] }, 0],
            },
          },
        },
      ]);

      return Response.json(
        {
          success: true,
          message: "Data found",
          countdata: countData,
        },
        { status: 200 }
      );
    }

    // Payment Status wise || Category Wise
    if (callType == "paymentStatus") {
      const userPaymentData = await UserModel.find();

      const categoryStats: Record<
        string,
        { paid: number; pending: number; free: number }
      > = {};

      userPaymentData.forEach((reg) => {
        const category = reg.reg_category;

        if (!categoryStats[category]) {
          categoryStats[category] = { paid: 0, pending: 0, free: 0 };
        }

        if (reg.payment_status === "Paid") {
          categoryStats[category].paid += 1;
        } else if (reg.payment_status === "Pending") {
          categoryStats[category].pending += 1;
        } else {
          categoryStats[category].free += 1;
        }
      });

      // Convert object into an array of objects
      const formattedData = Object.keys(categoryStats).map((category) => ({
        category,
        paid: categoryStats[category].paid,
        pending: categoryStats[category].pending,
        free: categoryStats[category].free,
      }));

      return Response.json(
        {
          success: true,
          message: "Data found",
          paymentStatus: formattedData,
        },
        { status: 200 }
      );
    }

    // Paid registrations category wise
    if (callType == "categorypaid") {
      const userData = await UserModel.aggregate([
        {
          $match: { payment_status: "Paid" },
        },
        {
          $group: {
            _id: "$reg_category", // Group by CATEGORY
            COUNT: { $sum: 1 }, // Count occurrences
          },
        },
        {
          $sort: { _id: 1 }, // Sort by CATEGORY (ascending order)
        },
      ]);

      return Response.json(
        {
          success: true,
          message: "Data found",
          categorypaid: userData,
        },
        { status: 200 }
      );
    }

    //For Last 7 days Registration Counts
    if (callType == "last7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

      console.log(sevenDaysAgo.getDate() + 1);

      const dateArray = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + i);
        dateArray.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      }

      const result = await UserModel.aggregate([
        {
          $match: {
            payment_date: { $gte: sevenDaysAgo }, // Filter registrations from the last 7 days
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$payment_date" },
            }, // Group by date
            regcount: { $sum: 1 }, // Count registrations per day
          },
        },
        {
          $project: {
            _id: 0, // Remove _id
            reg_date: "$_id", // Rename _id to reg_date
            regcount: 1, // Keep count field
          },
        },
        {
          $sort: { reg_date: 1 }, // Sort by date ascending
        },
      ]);

      const finalResult = dateArray.map((date) => {
        const found = result.find((r) => r.reg_date === date);
        return found || { reg_date: date, count: 0 }; // If date not found, set count to 0
      });

      return Response.json(
        {
          success: true,
          message: "Data found",
          last7days: finalResult,
        },
        { status: 200 }
      );
    }

    //if nothing matches
    return Response.json(
      {
        success: false,
        message: "Call Type is not matching",
      },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error in fetching report", error);

    return Response.json(
      {
        status: false,
        message: "Error in fetching report",
      },
      { status: 500 }
    );
  }
}
