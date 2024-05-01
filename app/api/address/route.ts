
import { NextRequest, NextResponse } from 'next/server'
import Collection from '@/lib/models/Collection'
import { connectToDB } from '@/lib/mongoDB'
import { auth } from '@clerk/nextjs'
import ShippingAddress from '@/lib/models/address'
export const POST = async (req: NextRequest) => {
    try {
 
      await connectToDB()
  
        const { street, city, state, postalCode, country ,userid} = await req.json()

        const newAddress = await ShippingAddress.create({
            street,
            city,
            state,
            postalCode,
            country,
            userid,
        })
        await newAddress.save()
  
        return NextResponse.json(newAddress, { status: 200 })
      
    } catch (err) {
      console.log("[collections_POST]", err)
      return new NextResponse("Internal Server Error", { status: 500 })
    }
  }

