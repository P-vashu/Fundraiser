"use server"

import Razorpay from "razorpay"
import connectDb from "@/dB/connectDb"
import Payment from "@/models/Payment"
import User from "@/models/User"


export const intiate = async (amount, to_username, paymentfrom) => {
    await connectDb()
    //fetch the secret of the user who is getting payment
    let user=await User.findOne({username:to_username})
    const secret= user.razorpaysecret

    var instance = new Razorpay({ key_id: user.razorpayid, key_secret: user.razorpaysecret })

    let options ={
        amount: Number.parseInt(amount),
        currency:"INR",
    }

    let x= await instance.orders.create(options)

    //create a payment object which shows pending payment in database
    await Payment.create({oid:x.id, amount:amount/100, to_user: to_username, name:paymentfrom.name, message:paymentfrom.message})

    return x
}

export const fetchuser =async (username)=>{
    await connectDb()
    let u= await User.findOne({username:username})
    let user= u.toObject({flattenObjectIds:true})
    return user
}

export const fetchpayments =async (username)=>{
    await connectDb()
    let p=await Payment.find({to_user:username, done:true}).sort({amount: -1}).limit(10).lean()
    return p
}

export const updateProfile= async (data,oldusername)=>{
    await connectDb()
    let ndata=data
    console.log(ndata);
    const filter = { email: ndata.email }; 
    // if username is updated check if username is available
    if(oldusername !== ndata.username){
        let u=await User.findOne({username: ndata.username})
        if(u){
            console.log("Username already exists");  
            return { error: "Username already exists" };
        }

        let result=await User.updateOne(filter, ndata)
        console.log("User update result:",result); 
    
        //Now update all the usernames in the payments table
        await Payment.updateMany({to_user:oldusername}, {to_user: ndata.username})
    }
    else{
       const result= await User.updateOne(filter,ndata)
       console.log("User update result:",result);      
    }

    return {success: true};
}

