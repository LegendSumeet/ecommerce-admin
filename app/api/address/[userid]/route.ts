import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { connectToDB } from "@/lib/mongoDB";
import ShippingAddress from "@/lib/models/address";

export const GET = async (
  req: NextRequest,
  { params }: { params: { userid: string } }
) => {
  try {
    await connectToDB();
    const addresses = await ShippingAddress.find({ userid: params.userid });
    if (!addresses || addresses.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "Addresses not found for the user" }),{
          headers: {
            "Access-Control-Allow-Origin": "https://eshoppe-store.vercel.app",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          status: 404
        }
      );
    }

    return new NextResponse(JSON.stringify(addresses), {
        headers:{
          "Access-Control-Allow-Origin": "https://eshoppe-store.vercel.app",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
        
    });
  } catch (err) {
    console.error("[collectionId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};
