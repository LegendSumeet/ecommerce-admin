import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { randomInt } from "crypto";
import Order from "@/lib/models/Order";
import ShippingAddress from "@/lib/models/address";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }

    try {
      await connectToDB();

      const address = await ShippingAddress.findOne({ userid: customer.clerkId });

      let totalPrice = 0;

      cartItems.forEach(
        (cartItem: { item: { price: number }; quantity: number }) => {
          totalPrice += cartItem.item.price * cartItem.quantity;
        }
      );

      const newOrder = new Order({
        customerClerkId: customer.clerkId,
        products: cartItems.map(
            (cartItem: { item: { id: any; price: any }; quantity: any }) => ({
                productId: cartItem.item.id,
                price: cartItem.item.price,
                quantity: cartItem.quantity,
            })
        ),
        address,
        shippingRate: "0",
        totalAmount: totalPrice,
      });

      await newOrder.save();

      let newCustomer = await Customer.findOne({ clerkId: customer.clerkId });
      if (newCustomer) {
        newCustomer.orders.push(newOrder._id);
      } else {
        newCustomer = new Customer({
          ...customer,
          orders: [newOrder._id],
        });
      }

      await newCustomer.save();

      return new NextResponse(
        JSON.stringify({
          id: newOrder._id,
          totalAmount: newOrder.totalAmount,
        }),

        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    } catch (err) {
      console.error("Error creating Razorpay order:", err);
      return new NextResponse("Error creating Razorpay order", { status: 500 });
    }
  } catch (err) {
    console.error("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
