"use client"
import React, { useEffect, useState, useCallback } from 'react'
import Script from 'next/script'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { fetchpayments, intiate, fetchuser } from '@/actions/useraction'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'

const PaymentPage = ({ username }) => {
    const { data: session } = useSession()

    const [paymentform, setpaymentform] = useState({ name: "", message: "", amount: "" })
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setpayments] = useState([])
    const searchParams = useSearchParams()
    const router = useRouter()

    const getData = useCallback(async () => {
        try {
            let u = await fetchuser(username)
            setcurrentUser(u)
            let dbpayments = await fetchpayments(username)
            setpayments(dbpayments)
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data.", {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            });
        }
    }, [username]);

    useEffect(() => {
        if (!session) {
            router.push("/login")
        }
        else {
            getData()
        }
    }, [session, getData, router])

    useEffect(() => {
        if (searchParams.get("paymentdone") == "true") {
            toast("Thanks for your donation!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
        router.push(`/${username}`)

    }, [searchParams, router, username])

    const handleChange = (e) => {
        setpaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }



    const pay = async (amount) => {
        //get the order id 
        let a = await intiate(amount, username, paymentform)
        let orderId = a.id
        var options = {
            "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
            "amount": amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "Get me A chai", //your business name
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,  //"http://localhost:3000/api/razorpay",
            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                "name": "Gaurav Kumar", //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        var rzp1 = new Razorpay(options);
        rzp1.open();
    }
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
            {/* Same as */}
            <ToastContainer />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <div className='cover w-full relative'>
                <Image className="object-cover w-full h-[350]" width={100} height={250} src={currentUser.coverpic} alt=""  unoptimized={true}/>
                <div className='absolute -bottom-12 md:right-[46%] border-white border-2 overflow-hidden  rounded-full size-24'>
                    <Image className='rounded-full object-cover size-24' width={128} height={128} src={currentUser.profilepic} alt=""  unoptimized={true}/>
                </div>
            </div>
            <div className="info flex flex-col justify-center items-center my-14 gap-2">
                <div className='font-bold text-lg '>
                    @{username}
                </div>
                <div className='text-slate-300'>
                    Lets help {username} get a chai
                </div>
                <div className='text-slate-300'>
                    {payments.length} Payments . ₹{payments.reduce((a, b) => a + b.amount, 0)} raised . Posts$17,200/release
                </div>
                <div className="payment flex gap-4 w-[80%] mt-10">
                    <div className="supporters w-1/2 bg-slate-900 rounded-lg p-10">
                        {/* show list of supporters who have donated */}
                        <h2 className='text-2xl font-bold my-5'>Supporters</h2>
                        <ul className='mx-4 text-sm'>
                            {payments.length == 0 && <li>No payments yet</li>}
                            {payments.map((p, i) => {
                                return <li key={i} className='my-4 flex gap-2 items-center'>
                                    <Image width={20} height={10} src="/avatar.gif" alt="user avatar"  unoptimized={true}/>
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount}</span> with a message &quot;{p.message}&quot;
                                    </span>
                                </li>
                            })}

                        </ul>
                    </div>
                    <div className="makePayment w-1/2 bg-slate-900 rounded-lg p-10 text-white">
                        <h2 className='text-2xl font-bold my-5'>Make A Payment</h2>
                        <div className='flex gap-2 flex-col'>
                            <input onChange={handleChange} name="name" value={paymentform.name} type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Name' />

                            <input onChange={handleChange} name="message" value={paymentform.message} type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Message' />

                            <input onChange={handleChange} name="amount" value={paymentform.amount} type="text" className='w-full p-3 rounded-lg bg-slate-800' placeholder='Enter Amount' />

                            <button onClick={() => pay(Number.parseInt(paymentform.amount * 100))} type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:bg-slate-600 disabled:from-purple-800" disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4}>Pay</button>
                        </div>
                        {/* or choose from the below */}
                        <div className='flex gap-2 mt-5'>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(1000)}>Pay ₹10</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(2000)}>Pay ₹20</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(3000)}>Pay ₹30</button>
                            <button className='bg-slate-800 p-3 rounded-lg' onClick={() => pay(4000)}>Pay ₹40</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage
