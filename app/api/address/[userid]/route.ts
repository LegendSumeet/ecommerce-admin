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
      const addresses = await ShippingAddress.find({userid:params.userid});
      if (!addresses) {
        return new NextResponse(
          JSON.stringify({ message: "address not found" }),
          { status: 404 }
        );
      }
  
      return NextResponse.json(addresses, { status: 200 });
    } catch (err) {
      console.log("[collectionId_GET]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  