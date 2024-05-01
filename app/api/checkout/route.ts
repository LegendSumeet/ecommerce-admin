import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Razorpay from "razorpay";
import { randomInt } from "crypto";
import { headers } from "next/headers";


const Headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: Headers });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }
    
    if (!process.env.RAZORPAY_KEY) {
      return new NextResponse("Razorpay key is not defined", { status: 500 });
    }
    
    const razorpayKey = process.env.RAZORPAY_KEY;
    let totalPrice = 0;

    cartItems.forEach((cartItem: { item: { price: number; }; quantity: number; }) => {
        totalPrice += cartItem.item.price * cartItem.quantity;
    });
    const razorpay = new Razorpay({
      key_id: razorpayKey,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const payment_capture = 1;
    const currency = "INR";
    const options = {
      amount: totalPrice,
      currency,
      receipt: randomInt(100000, 999999).toString(),
      payment_capture,
    };

    try {
      // Create Razorpay order
      const response = await razorpay.orders.create(options);

      // Respond with order details
      return new NextResponse(JSON.stringify({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      }));
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      return new NextResponse("Error creating Razorpay order", { status: 500 });
    }
  } catch (err) {
    console.error("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
