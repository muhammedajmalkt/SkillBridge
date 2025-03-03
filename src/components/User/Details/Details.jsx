import React, { useState } from 'react'
import { CiClock2 } from "react-icons/ci";
import { HiLanguage } from "react-icons/hi2";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Layout/Loader';
import SwapWith from '../SwapTransaction/SwapWith';
import toast  from 'react-hot-toast'






const Details = () => {
const {skillid} =useParams()
const [request,setRequest]=useState(false)
const [receiverSkill,setReceiverSkill]=useState(null)
const {isAuthenticated} = useSelector((state)=>state.auth)
const navigate = useNavigate("/")


const {data:details,isLoading}=useQuery({
    queryKey:["details"],
    queryFn:async ()=>{
        const {data} =await axiosInstance.get(`/user/getswap/${skillid}`)
        return data.data
    },
    enabled: !!skillid
})
// console.log(details);


const handleRequest = (details) =>{   
  if(!isAuthenticated){
    toast.error( "An error occurred,Please Login", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
    return  navigate("/")
  }
  setRequest(true)
  setReceiverSkill(details)
}
if(isLoading) return <div className='mt-[72px] h-screen flex justify-center items-center '><Loader /></div>

  return (
    <div className='h-auto mt-[2px]'>
            
            <div className='bg-slate-100 h-64 '>
            <h1 className='w-full p-32 text-2xl font-bold text-[#181818]'>{details.offeredTitle}</h1>
        </div>

       {/* {left} */}
     <div className='m-8 flex gap-10 justify-center text-gray-600'>
        <div className='w-[760px]   p-10 '>
            <span className='text-xl border-l-4 border-[#6d28d2] font-bold pl-4 text-black'>Overview</span>
           
            <h6 className='pt-8 font-semibold'>Objective:</h6>
            <p  className='pt-2'>{details.offeredDetails} </p>
            <h6 className='font-semibold pt-5'>Category: </h6>
             <p>{details.offeredCategory.toUpperCase()}</p>

            <h6 className='font-semibold pt-5'>Duration: </h6>
             <p>{details.hours} Hours</p>
             <h6 className='font-semibold pt-5'>Expireince Level: </h6>
             <p>{details.offeredExpireince}</p>

             <hr className='my-20'/>
             

              {/* {neede details} */}
             <h1 className='text-xl  font-bold  border-l-4 border-[#6d28d2] pl-4 text-black'>Swap with</h1>
             <h3 className='pt-8 text-xl  font-bold  text-black ' 
           //   style={{ backgroundImage: `url(${details.neededImage})`, backgroundSize: "cover"}}
             >{details.neededTitle}</h3>
             {details?.neededImage &&
             <img src={details.neededImage} className='object-cover h-[150px] w-full mt-2' />}
             <h6 className='pt-8 font-semibold'>Objective:</h6>
            <p  className='pt-2'>{details.neededDetails} </p>
            <h6 className='font-semibold pt-5'>Category: </h6>
             <p>{details.neededCategory.toUpperCase()}</p>

            <h6 className='font-semibold pt-5'>Duration: </h6>
             <p>{details.hours} Hours</p>
             <h6 className='font-semibold pt-5'>Priority Level: </h6>
             <p>{details.neededPriority}</p>

        </div>


        {/* {right} */}
     <div className=''>
         <div className='border p-4 rounded-md  h-fit'>
            <img className='w-80 object-fill rounded-md mb-4  '
            src={details.offeredImage ||'sample.png'} alt='skillpic' />
            <div className='flex flex-col gap-5 text-[15px]'> 
                <h1 className='flex  items-center border-b py-3 gap-1'>
                  <span> <CiClock2/> </span>Duration:<span className='w-full text-end'>{details.hours }hr</span>
                </h1>
               <h1 className='flex items-center border-b py-3 gap-1'> < HiLanguage/> Language:   <span className='w-full text-end'>English</span></h1>
               <h1 className='flex items-center border-b py-3 gap-1'> < BiCategory/> Category:   <span className=' w-full text-end text-[13px]'>{details.offeredCategory.toUpperCase()}</span></h1>
               <h1 className='flex items-center  py-3 gap-1'> < HiOutlineCheckBadge/> Certificate: <span className='w-full text-end'>No</span></h1>

            <button className='bg-[#6d28d2] rounded-3xl py-2 text-white hover:bg-[#892de1] hover:ease-in my-4' onClick={()=>handleRequest(details)}> REQUEST A SWAP</button>
            </div>
          </div>
         {/* {profile} */}
            <div className='border rounded flex h-35 p-5 mt-5 cursor-pointer hover:bg-slate-100'>
                <img src={details.userId.image} alt="🐶" className=' bg-slate-400 w-20 h-20 rounded-full mr-5 object-cover' />
                <div>
                  <h1 className='font-semibold mb-1'>{details.userId.name || ""} </h1>
                  <h1 className='text-sm mb-1'>{details.userId.bio || ""} </h1>
                  <h1 className='text-xs font-semibold mb-1 text-[#8b4309]'>{"4.7 Rating"}</h1>
                  <h1 className='text-xs'>{"7 "}Skill Swaped</h1>
                </div>
             </div>
       </div>

     </div>

          
        {request && <SwapWith receiverSkill={receiverSkill} setRequest={setRequest}/>}


            
    </div>
  )
}

export default Details