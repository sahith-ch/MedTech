import { newVerification } from "@/actions/new-verification";
import { NextResponse } from "next/server";

export const POST = async(req:any)=>{
     try{
      const body = await req.json();
      const data = await newVerification(body)
      return NextResponse.json(data);
     }catch(err){
        console.log(err);     
     }
}