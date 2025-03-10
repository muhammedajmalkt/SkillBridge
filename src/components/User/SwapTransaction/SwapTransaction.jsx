import React, { useState } from 'react'
import Loader from '../Layout/Loader'
import {  useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../../api/axiosInstance'
import { MdStarRate } from "react-icons/md";
import { useAccept, useReject, useUnswap } from '../../../hooks/useSwap';
import toast  from 'react-hot-toast'
import ConfirmModal from './confirmModal';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { requstReceiver } from '../../../Redux/Feature/swapRequest';


const SwapTransaction = () => {
  const [btn,setBtn]=useState(false)
  const {mutate:unswap} = useUnswap()
  const {user} = useSelector((state)=>state.auth)
  const queryClient = useQueryClient();
  const {mutate:acceptRequest} = useAccept()
  const [modal,setModal] = useState(false)
  const [rejectId,setRejectId] = useState(null)
  const naviagte = useNavigate()
  const [complete,setComplete] = useState({
    transactionId:"",
    role:""
  })
  


  const {data:swaped,isLoading} = useQuery({
    queryKey:["getTransaction"],
    queryFn: async ()=>{
      const {data} = await axiosInstance.get("/user/getrequested")
      return data.data
    },
      enabled :!!user?._id

  })
  
  const {data:received} = useQuery({
    queryKey:["getReceived"],
    queryFn : async () =>{
      const {data} = await axiosInstance.get("/user/getreceived")
      return data.data
    },
    enabled: !!user?._id
  })

 const handleUnswap = (id) =>{
   unswap(id,{
    onSuccess:()=>{
      queryClient.invalidateQueries(["getTransaction"]); // Refresh data after mutation
    },
    onError : (err)=>{
        toast.error(err.response?.data?.message || "An error occured", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
              });
    }
   })
 }

 const handleAccept = (id)=>{
   acceptRequest(id, {
     onSuccess: () => {
       queryClient.invalidateQueries(["getReceived"]); 
     },
     onError: (err) => {
       toast.error(err.response?.data?.message || "An error occured", {
         position: "top-right",
         autoClose: 3000,
         hideProgressBar: false,

       });
     }
   })
  }
  
 const handleDecline = (id) =>{
 setRejectId(id)
 setModal(true)
 }
 const handleDatails = (id )=>{
    naviagte(`/details/${id}`)
 }
 const handleDetailss = (id) => {
  naviagte(`/details/${id}`)
 }
 const handleChat = (requesterId) =>{
  console.log(requesterId);
  naviagte(`/chat/${requesterId}`)
 }
 const handleSend = (id) =>{
naviagte(`/details/${id}`)
 }
 const handleWithChat = (receiverId) =>{
  naviagte(`/chat/${receiverId}`)
 }
 const isCompletedRequested = (id )=>{
  setModal(true)
  setComplete({
    transactionId:id,
    role:"requester"
  })  
 }
 const isCompletedReceived = (id) =>{
  setModal(true)
  setComplete({
    transactionId:id,
    role:"receiver"
  })
 }
//  console.log(received);
 const handleReceivedAssessment = (skillId,transactionId,receiverId)=>{
  const tra = received.find((item)=>item._id === transactionId)
  if(!tra.isCompletedByRequester){
     return toast.error("Swap cannot completed",{
      position:"top-right"
  });
  }
  naviagte(`/assess/${skillId}/${transactionId}/${receiverId}`)
}
    // console.log("hh",swaped);
const handleRequestedAssessment = (skillId,transactionId,requesterId)=>{
  const tra = swaped.find((item)=>item._id === transactionId)
  if(!tra.isCompletedByReceiver){
    return toast.error("Swap connot completed",{
        position:"top-right"
    });
  }
  naviagte(`/assess/${skillId}/${transactionId}/${requesterId}`)
}

 if(isLoading) return <div className='mtg-[72px] h-screen flex justify-center items-center '><Loader /></div>
  
  return (
    <div className='h-screen mtd-[72px]'>
      <div className='flex gap-8  border-b pb-2 mt-16  text-gray-600  text-lg '>
        <button className={`ml-10 ${btn === false? "border-b-2 border-[#6c28d2f1] transition-all duration-300 ease-in":"border-b-2 border-white"}`} onClick={()=>setBtn(false)}>SEND ↗</button>
        <button className={` ${btn === true? "border-b-2 border-[#6c28d2f1] ransition-all duration-300 ease-in":"border-b-2 border-white"}`} onClick={()=>setBtn(true)}>RECEIVED ↙</button>
      </div>

      {/* { send} */}
      {btn === false && 
      <div className='px-4 mt-5 max-h-[800px] overflow-scroll w-fit mx-auto'>
      {swaped?.length > 0 ? swaped?.map((swap) => (
      swap?.receiverSkill?.map((prd) => (
    <div className='flex  shadow hover:shadow-lg transition-shadow duration-300  p-3 rounded gap-8 mb-5' key={prd?.skillId?._id}>
      <img src={prd?.skillId?.offeredImage} alt='image' className='h-28 w-48 object-cover bg-slate-500'/>
      <div className='flex flex-col gap-2 w-[800px] cursor-pointer' onClick={() => handleSend(prd?.skillId?._id)}>
        <h1>{prd?.skillId?.offeredTitle}</h1>
        <h1 className='text-sm '>Experience - {prd?.skillId?.offeredExpireince}</h1>
        <h1 className='text-sm text-gray-500'>{prd?.skillId?.offeredCategory?.toUpperCase()}</h1>
        <h1 className='text-xs font-semibold mb-1 text-[#8b4309] flex items-center gap-1'> 
          <MdStarRate/> {"4.7 Rating"}
        </h1>
      </div>
      
      <div className='flex justify-end items-end text-sm'>
        {swap.isPending ?
          <button className=' px-5 py-1 rounded bg-red-600 text-white' onClick={() => handleUnswap(swap._id)}>UNSWAP</button>:
           <>
          {!swap.isCompletedByRequester ?
          <>
          <button className=' py-1 rounded px-5 bg-green-700 text-white' onClick={() => prd?.userId && handleWithChat(prd?.userId)}>Continue with Chat</button>
          <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3' onClick={() =>isCompletedRequested(swap._id)}> Swap Completed!</button>
          </>
          :
          <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3' onClick={()=>handleRequestedAssessment(prd?.skillId?._id,swap._id,swap.requesterSkill[0].userId)} >Assess ⌷</button>}
          {modal && <ConfirmModal complete={complete} setComplete={setComplete}  setModal={setModal}   />}
           </>


        }
      </div>
    </div>
  ))
)) :<div className='flex justify-center '><h1>No swap found!</h1><NavLink to={"/swapskill"} className="ml-1 underline text-blue-600">add.</NavLink> </div>}
      </div>}



      {/* {receive} */}
      {btn === true && 
   <div className='px-40 mt-5 max-h-[800px] overflow-y-auto  '>
    {received?.length > 0 ?  received?.map((swap) =>(
        swap?.requesterSkill?.flatMap((i) => i?.skillId)?.map((item) => (
          <div className=' mb-5 '>
            <div className='flex gap-2 items-center justify-center'>  
            <div key={item._id} className='flex    shadow-md p-3 rounded gap-8 w-[500px] h-[180px] mt-5 cursor-pointer border-green-600 border 'onClick={()=>handleDatails(item._id)} >
              <img src={item.offeredImage} className='h-28 w-48 object-cover' alt='Skill' />
              <div className='flex flex-col gap-1 w-[400px]'>
                <h1 className='line-clamp-4'>{item.offeredTitle}</h1>
                <h1 className='text-sm mt-3'>Experience - {item.offeredExpireince}</h1>
                <h1 className='text-sm text-gray-500'>{item.offeredCategory?.toUpperCase()}</h1>
                <h1 className='text-xs font-semibold mb-1 text-[#8b4309] flex items-center gap-1'>
                  <MdStarRate /> {"4.7 Rating"}
                </h1>
                </div>
              </div>

              {swap.receiverSkill?.flatMap((jk) => jk?.skillId)?.map((item) => (
              <div className=' w-[500px] h-[180px]  shadow-md p-3 rounded gap-8 mt-5 cursor-pointer border border-red-500' onClick={()=>handleDetailss(item._id)}>
              <div className='flex gap-8'>
              <img src={item.offeredImage} className='h-28 w-48 object-cover bg-slate-400' alt='Skill' />
              <div className='flex flex-col gap-1 w-[400px]'>
                <h1 className='line-clamp-3'>{item.offeredTitle}</h1>
                <h1 className='text-sm mt-3'>Experience - {item.offeredExpireince}</h1>
                <h1 className='text-sm text-gray-500 '>{item.offeredCategory?.toUpperCase()}</h1>
                <h1 className='text-xs font-semibold mb-1 text-[#8b4309] flex items-center gap-1'>
                  <MdStarRate /> {"4.7 Rating"}
                </h1>
                </div>
                </div>
               </div>))}
             </div>

              <div className='flex justify-end items-end gap-4 text-sm text-white mt-2 mr-[180px] '>
                {modal && <ConfirmModal rejectId={rejectId} setModal={setModal}   complete={complete} />}
                {swap.isPending ?<>
                <button className='borderw px-5 py-1 rounded bg-red-600' onClick={()=>handleDecline(swap._id)}>DECLINE</button> 
                <button className='borderw px-5 py-1 rounded  bg-green-700' onClick={() => handleAccept(swap._id)}>ACCEPT </button>
                </>:
                <>
                {!swap.isCompletedByReceiver ?
                <>
                <button className='borderw px-5 py-1 rounded  bg-green-700' onClick={()=>handleChat(swap.requesterSkill[0]?.userId)}>Continue with Chat</button>
                <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3' onClick={() =>isCompletedReceived(swap._id)}> Swap Completed!</button>
                </>
                :
                <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3' onClick={()=>handleReceivedAssessment(item._id,swap._id,swap.receiverSkill[0]?.userId)}> Assess ⌷</button>}

                </>
}
              </div>
            </div>
           
          ))
        )) : <div className='flex justify-center'><h1>No item found</h1></div>}
    </div>}
    </div>
    

)
}

export default SwapTransaction
