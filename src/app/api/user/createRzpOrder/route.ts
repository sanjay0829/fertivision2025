import UserModel from "@/models/user";
import Razorpay from "razorpay";

var razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET_ID,
});

export async function POST(request: Request) {
  try {
    const { amount, currency, receipt_id, userId } = await request.json();

    const userExists = await UserModel.findById(userId);

    if (!userExists) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt_id,
    });

    console.log(order);
    if (!order) {
      return Response.json(
        { success: false, message: "Order creation failed" },
        { status: 400 }
      );
    }

    userExists.order_no = order.id;

    await userExists.save();

    return Response.json(
      { success: true, message: "Order created successfully", data: order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order creation Error", error);
    return Response.json(
      { success: false, message: "Order creation Error" },
      { status: 500 }
    );
  }
}
