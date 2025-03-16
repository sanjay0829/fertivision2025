import crypto from "crypto";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_SECRET_ID as string;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");

  return sig;
};

export async function POST(request: Request) {
  const { orderId, razorpayPaymentId, razorpaySignature } =
    await request.json();

  const signature = generatedSignature(orderId, razorpayPaymentId);
  if (signature !== razorpaySignature) {
    return Response.json(
      { message: "payment verification failed", success: false },
      { status: 400 }
    );
  }

  // Probably some database calls here to update order or add premium status to user
  return Response.json(
    { message: "payment verified successfully", success: true },
    { status: 200 }
  );
}
