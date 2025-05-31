// import React, { useState } from 'react'
// import Loader from '../Layout/Loader'
// import {  useQuery, useQueryClient } from '@tanstack/react-query'
// import axiosInstance from '../../../api/axiosInstance'
// import { MdStarRate } from "react-icons/md";
// import { useAccept, useReject, useUnswap } from '../../../hooks/useSwap';
// import toast  from 'react-hot-toast'
// import ConfirmModal from './confirmModal';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { requstReceiver } from '../../../Redux/Feature/swapRequest';
// import { TfiWrite } from "react-icons/tfi";




// const SwapTransaction = () => {
//   const [btn,setBtn]=useState(false)
//   const {mutate:unswap} = useUnswap()
//   const {user} = useSelector((state)=>state.auth)
//   const queryClient = useQueryClient();
//   const {mutate:acceptRequest} = useAccept()
//   const [modal,setModal] = useState(false)
//   const [rejectId,setRejectId] = useState(null)
//   const naviagte = useNavigate()
//   const [complete,setComplete] = useState({
//     transactionId:"",
//     role:""
//   })
  


//   const {data:swaped,isLoading} = useQuery({
//     queryKey:["getTransaction"],
//     queryFn: async ()=>{
//       const {data} = await axiosInstance.get("/user/getrequested")
//       return data.data
//     },
//       enabled :!!user?._id

//   })
  
//   const {data:received} = useQuery({
//     queryKey:["getReceived"],
//     queryFn : async () =>{
//       const {data} = await axiosInstance.get("/user/getreceived")
//       return data.data
//     },
//     enabled: !!user?._id
//   })

//  const handleUnswap = (id) =>{
//    unswap(id,{
//     onSuccess:()=>{
//       queryClient.invalidateQueries(["getTransaction"]); // Refresh data after mutation
//     },
//     onError : (err)=>{
//         toast.error(err.response?.data?.message || "An error occured", {
//                 position: "top-right",
//                 autoClose: 3000,
//               });
//     }
//    })
//  }

//  const handleAccept = (id)=>{
//    acceptRequest(id, {
//      onSuccess: () => {
//        queryClient.invalidateQueries(["getReceived"]); 
//      },
//      onError: (err) => {
//        toast.error(err.response?.data?.message || "An error occured", {
//          position: "top-right",
//          autoClose: 3000,
//        });
//      }
//    })
//   }
  
//  const handleDecline = (id) =>{
//  setRejectId(id)
//  setModal(true)
//  }
//  const handleDatails = (id )=>{
//     naviagte(`/details/${id}`)
//  }
//  const handleDetailss = (id) => {
//   naviagte(`/details/${id}`)
//  }
//  const handleChat = (requesterId) =>{
//   console.log(requesterId);
//   naviagte(`/chat/${requesterId}`)
//  }
//  const handleSend = (id) =>{
// naviagte(`/details/${id}`)
//  }
//  const handleWithChat = (receiverId) =>{
//   naviagte(`/chat/${receiverId}`)
//  }
//  const isCompletedRequested = (id )=>{
//   setModal(true)
//   setComplete({
//     transactionId:id,
//     role:"requester"
//   })  
//  }
//  const isCompletedReceived = (id) =>{
//   setModal(true)
//   setComplete({
//     transactionId:id,
//     role:"receiver"
//   })
//  }
// //  console.log(received);
//  const handleReceivedAssessment = (skillId,transactionId,receiverId)=>{
//   const tra = received.find((item)=>item._id === transactionId)
//   if(!tra.isCompletedByRequester){
//      return toast.error("Swap cannot completed",{
//       position:"top-right"
//   });
//   }
//   naviagte(`/assess/${skillId}/${transactionId}/${receiverId}`)
// }
//     // console.log("hh",swaped);
// const handleRequestedAssessment = (skillId,transactionId,requesterId)=>{
//   const tra = swaped.find((item)=>item._id === transactionId)
//   if(!tra.isCompletedByReceiver){
//     return toast.error("Swap connot completed",{
//         position:"top-right"
//     });
//   }
//   naviagte(`/assess/${skillId}/${transactionId}/${requesterId}`)
// }

//  if(isLoading) return <div className='mtg-[72px] h-screen flex justify-center items-center '><Loader /></div>
  
//   return (
//     <div className='h-screen mtd-[72px]'>
//       <div className='flex gap-8  border-b pb-2 mt-16  text-gray-600  text-lg '>
//         <button className={`ml-10 ${btn === false? "border-b-2 border-[#6c28d2f1] transition-all duration-300 ease-in":"border-b-2 border-white"}`} onClick={()=>setBtn(false)}>SEND ↗</button>
//         <button className={` ${btn === true? "border-b-2 border-[#6c28d2f1] ransition-all duration-300 ease-in":"border-b-2 border-white"}`} onClick={()=>setBtn(true)}>RECEIVED ↙</button>
//       </div>

//       {/* { send} */}
//       {btn === false && 
//       <div className='px-4 mt-5 max-h-[800px] overflow-scroll w-fit mx-auto'>
//       {swaped?.length > 0 ? swaped?.map((swap) => (
//       swap?.receiverSkill?.map((prd) => (
//     <div className='flex  shadow hover:shadow-lg transition-shadow duration-300  p-3 rounded gap-8 mb-5' key={prd?.skillId?._id}>
//       <img src={prd?.skillId?.offeredImage || "/sample.png"} alt='image' className='h-28 w-48 object-cover bg-slate-500'/>
//       <div className='flex flex-col gap-2 w-[800px] cursor-pointer' onClick={() => handleSend(prd?.skillId?._id)}>
//         <h1>{prd?.skillId?.offeredTitle}</h1>
//         <h1 className='text-sm '>Experience - {prd?.skillId?.offeredExpireince}</h1>
//         <h1 className='text-sm text-gray-500'>{prd?.skillId?.offeredCategory?.toUpperCase()}</h1>
//         <h1 className='text-xs font-semibold mb-1 text-[#8b4309] flex items-center gap-1'> 
//           <MdStarRate/> {"4.7 Rating"}
//         </h1>
//       </div>
      
//       <div className='flex justify-end items-end text-sm'>
//         {swap.isPending ?
//           <button className=' px-5 py-1 rounded bg-red-600 text-white' onClick={() => handleUnswap(swap._id)}>UNSWAP</button>:
//            <>
//           {!swap.isCompletedByRequester ?
//           <>
//           <button className=' py-1 rounded px-5 bg-green-700 text-white' onClick={() => prd?.userId && handleWithChat(prd?.userId)}>Continue with Chat</button>
//           <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3' onClick={() =>isCompletedRequested(swap._id)}> Swap Completed!</button>
//           </>
//           :
//           <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3 flex items-center gap-2' onClick={()=>handleRequestedAssessment(prd?.skillId?._id,swap._id,swap.requesterSkill[0].userId)} >Assess <TfiWrite/></button>}
//           {modal && <ConfirmModal complete={complete} setComplete={setComplete}  setModal={setModal}   />}
//            </>


//         }
//       </div>
//     </div>
//   ))
// )) :<div className='flex justify-center '><h1>No swap found!</h1><NavLink to={"/swapskill"} className="ml-1 underline text-blue-600">add.</NavLink> </div>}
//       </div>}



//       {/* {receive} */}
//       {btn === true && 
//    <div className='px-40 mt-5 max-h-[800px] overflow-y-auto  '>
//     {received?.length > 0 ?  received?.map((swap) =>(
//         swap?.requesterSkill?.flatMap((i) => i?.skillId)?.map((item) => (
//           <div className=' mb-5 '>
//             <div className='flex gap-2 items-center justify-center'>  
//             <div key={item._id} className='flex    shadow-md p-3 rounded gap-8 w-[500px] h-[180px] mt-5 cursor-pointer border-green-600 border 'onClick={()=>handleDatails(item._id)} >
//               <img src={item.offeredImage || "/sample.png"} className='h-28 w-48 object-cover' alt='Skill' />
//               <div className='flex flex-col gap-1 w-[400px]'>
//                 <h1 className='line-clamp-4'>{item.offeredTitle}</h1>
//                 <h1 className='text-sm mt-3'>Experience - {item.offeredExpireince}</h1>
//                 <h1 className='text-sm text-gray-500'>{item.offeredCategory?.toUpperCase()}</h1>
//                 <h1 className='text-xs font-semibold mb-1 text-[#8b4309] flex items-center gap-1'>
//                   <MdStarRate /> {"4.7 Rating"}
//                 </h1>
//                 </div>
//               </div>

//               {swap.receiverSkill?.flatMap((jk) => jk?.skillId)?.map((item) => (
//               <div className=' w-[500px] h-[180px]  shadow-md p-3 rounded gap-8 mt-5 cursor-pointer border border-red-500' onClick={()=>handleDetailss(item._id)}>
//               <div className='flex gap-8'>
//               <img src={item.offeredImage || "/sample.png"} className='h-28 w-48 object-cover bg-slate-400' alt='Skill' />
//               <div className='flex flex-col gap-1 w-[400px]'>
//                 <h1 className='line-clamp-3'>{item.offeredTitle}</h1>
//                 <h1 className='text-sm mt-3'>Experience - {item.offeredExpireince}</h1>
//                 <h1 className='text-sm text-gray-500 '>{item.offeredCategory?.toUpperCase()}</h1>
//                 <h1 className='text-xs font-semibold mb-1 text-[#8b4309] flex items-center gap-1'>
//                   <MdStarRate /> {"4.7 Rating"}
//                 </h1>
//                 </div>
//                 </div>
//                </div>))}
//              </div>

//               <div className='flex justify-end items-end gap-4 text-sm text-white mt-2 mr-[180px] '>
//                 {modal && <ConfirmModal rejectId={rejectId} setModal={setModal}   complete={complete} />}
//                 {swap.isPending ?<>
//                 <button className='borderw px-5 py-1 rounded bg-red-600' onClick={()=>handleDecline(swap._id)}>DECLINE</button> 
//                 <button className='borderw px-5 py-1 rounded  bg-green-700' onClick={() => handleAccept(swap._id)}>ACCEPT </button>
//                 </>:
//                 <>
//                 {!swap.isCompletedByReceiver ?
//                 <>
//                 <button className='borderw px-5 py-1 rounded  bg-green-700' onClick={()=>handleChat(swap.requesterSkill[0]?.userId)}>Continue with Chat</button>
//                 <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3' onClick={() =>isCompletedReceived(swap._id)}> Swap Completed!</button>
//                 </>
//                 :
//                 <button className=' py-1 rounded px-5 bg-yellow-500 text-white ml-3 flex items-center gap-2' onClick={()=>handleReceivedAssessment(item._id,swap._id,swap.receiverSkill[0]?.userId)}> Assess <TfiWrite/></button>}

//                 </>
// }
//               </div>
//             </div>
           
//           ))
//         )) : <div className='flex justify-center'><h1>No swap found</h1></div>}
//     </div>}
//     </div>
    

// )
// }

// export default SwapTransaction

import React, { useState } from 'react';
import Loader from '../Layout/Loader';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { useAccept, useUnswap, useReject, useComplete } from '../../../hooks/useSwap';
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageCircle,
  CheckCircle,
  X,
  ArrowUpRight,
  ArrowDownLeft,
  Edit3,
  AlertTriangle,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const SwapTransaction = () => {
  const [activeTab, setActiveTab] = useState('sent');
  const { mutate: unswap } = useUnswap();
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const { mutate: acceptRequest } = useAccept();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [complete, setComplete] = useState({
    transactionId: '',
    role: '',
  });

  const { data: swaped, isLoading: lodg } = useQuery({
    queryKey: ['getTransaction'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/user/getrequested');
      return data.data;
    },
    enabled: !!user?._id,
  });

  const { data: received } = useQuery({
    queryKey: ['getReceived'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/user/getreceived');
      return data.data;
    },
    enabled: !!user?._id,
  });

  const handleUnswap = (id) => {
    setIsLoading(true);
    unswap(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getTransaction']);
        setIsLoading(false);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'An error occurred', {
          position: 'top-right',
          autoClose: 3000,
        });
        setIsLoading(false);
      },
    });
  };

  const handleAccept = (id) => {
    setIsLoading(true);
    acceptRequest(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getReceived']);
        setIsLoading(false);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'An error occurred', {
          position: 'top-right',
          autoClose: 3000,
        });
        setIsLoading(false);
      },
    });
  };

  const handleDecline = (id) => {
    setRejectId(id);
    setShowConfirmModal(true);
  };

  const handleDetails = (id) => {
    navigate(`/details/${id}`);
  };

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  const handleCompletedRequested = (id) => {
    setComplete({
      transactionId: id,
      role: 'requester',
    });
    setShowConfirmModal(true);
  };

  const handleCompletedReceived = (id) => {
    setComplete({
      transactionId: id,
      role: 'receiver',
    });
    setShowConfirmModal(true);
  };

  const handleRequestedAssessment = (skillId, transactionId, requesterId) => {
    const tra = swaped.find((item) => item._id === transactionId);
    if (!tra.isCompletedByReceiver) {
      return toast.error('Swap cannot be completed', {
        position: 'top-right',
      });
    }
    navigate(`/assess/${skillId}/${transactionId}/${requesterId}`);
  };

  const handleReceivedAssessment = (skillId, transactionId, receiverId) => {
    const tra = received.find((item) => item._id === transactionId);
    if (!tra.isCompletedByRequester) {
      return toast.error('Swap cannot be completed', {
        position: 'top-right',
      });
    }
    navigate(`/assess/${skillId}/${transactionId}/${receiverId}`);
  };

  if (isLoading || lodg) {
    return (
      <div className="mt-[72px] h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl my-5 font-medium">Swap Transactions</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'sent' ? 'bg-[#6d28d2] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('sent')}
          >
            <ArrowUpRight size={18} />
            <span>Sent Requests</span>
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'received' ? 'bg-[#6d28d2] text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('received')}
          >
            <ArrowDownLeft size={18} />
            <span>Received Requests</span>
          </button>
        </div>
      </div>

      {/* Sent Requests */}
      <AnimatePresence mode="wait">
        {activeTab === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {swaped?.length > 0 ? (
              swaped.map((swap) =>
                swap?.receiverSkill?.map((prd) => (
                  <div
                    key={prd?.skillId?._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-48 md:h-auto">
                        <img
                          src={prd?.skillId?.offeredImage || '/sample.png'}
                          alt="Skill"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between w-full">
                        <div
                          className="flex flex-col gap-2 cursor-pointer flex-grow"
                          onClick={() => handleDetails(prd?.skillId?._id)}
                        >
                          <h2 className="text-lg font-medium text-gray-900 line-clamp-2">
                            {prd?.skillId?.offeredTitle}
                          </h2>
                          <p className="text-sm text-gray-700">Experience: {prd?.skillId?.offeredExpireince}</p>
                          <div className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full w-fit">
                            {prd?.skillId?.offeredCategory?.toUpperCase()}
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col justify-end">
                          {swap.isPending ? (
                            <div className="flex flex-col items-end">
                              <span className="text-sm text-amber-600 font-medium mb-2 flex items-center">
                                <AlertTriangle size={14} className="mr-1" />
                                Pending Approval
                              </span>
                              <button
                                className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                                onClick={() => handleUnswap(swap._id)}
                              >
                                <X size={16} />
                                <span>CANCEL REQUEST</span>
                              </button>
                            </div>
                          ) : (
                            <>
                              {!swap.isCompletedByRequester ? (
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <button onClick={() => prd?.userId && handleChat(prd?.userId)}
                                    className="px-4 py-2 rounded-lg  text-sm bg-[#6d28d2] text-white hover:bg-[#5a1fb8] transition-colors flex items-center gap-1"
                                  >
                                    <MessageCircle size={16} />
                                    <span>CONTINUE CHAT</span>
                                  </button>
                                  <button onClick={() => handleCompletedRequested(swap._id)}
                                    className="px-4 py-2 rounded-lg bg-amber-500  text-sm text-white hover:bg-amber-600 transition-colors flex items-center gap-1"
                                  >
                                    <CheckCircle size={16} />
                                    <span>COMPLETED</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="px-4 py-2 rounded-lg bg-green-700  text-sm text-white hover:bg-green-800 transition-colors flex items-center gap-1"
                                  onClick={() => handleRequestedAssessment(prd?.skillId?._id, swap._id, swap.requesterSkill[0].userId) } >
                                  <Edit3 size={16} />
                                  <span>ASSESS</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <h3 className="text-xl font-medium mb-2">No sent requests</h3>
                <p className="text-gray-500 mb-6">Start by exploring skills and sending swap requests</p>
                <NavLink
                  to="/swapskill"
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-[#5a1fb8] transition-all duration-300"
                >
                  Explore Skills
                </NavLink>
              </div>
            )}
          </motion.div>
        )}

        {/* Received Requests */}
        {activeTab === 'received' && (
          <motion.div
            key="received"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {received?.length > 0 ? (
              received.map((swap) =>
                swap?.requesterSkill?.flatMap((i) => i?.skillId)?.map((item) => (
                  <div
                    key={swap._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-1 border-b border-gray-100 flex justify-between items-center">

                      {swap.isPending && (
                        <div className="flex gap-2">
                          <button onClick={() => handleDecline(swap._id)}
                            className="px-4 py-1 rounded bg-red-600 text-white   hover:bg-red-700 transition-colors"
                          >
                            DECLINE
                          </button>
                          <button onClick={() => handleAccept(swap._id)}
                            className="px-4 py-1 rounded bg-green-700 text-white  hover:bg-green-800 transition-colors"
                          >
                            ACCEPT
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* They offer */}
                        <div
                          className="border border-green-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
                          onClick={() => handleDetails(item._id)}
                        >
                          <div className="bg-green-50 px-4 py-2 border-b border-green-200 flex justify-between items-center">
                            <h4 className="text-sm font-medium text-green-800">They Offer</h4>
                            <ChevronRight size={16} className="text-green-600" />
                          </div>
                          <div className="flex p-4">
                            <img
                              src={item.offeredImage || '/sample.png'}
                              className="h-24 w-24 object-cover rounded-md"
                              alt="Skill"
                            />
                            <div className="ml-4 flex-grow">
                              <h3 className="font-medium text-gray-900 line-clamp-2">{item.offeredTitle}</h3>
                              <p className="text-sm text-gray-700 mt-1">Experience: {item.offeredExpireince}</p>
                              <div className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mt-2">
                                {item.offeredCategory?.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* You offer */}
                        {swap.receiverSkill?.flatMap((jk) => jk?.skillId)?.map((item) => (
                          <div
                            key={item._id}
                            className="border border-blue-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300"
                            onClick={() => handleDetails(item._id)}
                          >
                            <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 flex justify-between items-center">
                              <h4 className="text-sm font-medium text-blue-800">You Offer</h4>
                              <ChevronRight size={16} className="text-blue-600" />
                            </div>
                            <div className="flex p-4">
                              <img
                                src={item.offeredImage || '/sample.png'}
                                className="h-24 w-24 object-cover rounded-md"
                                alt="Skill"
                              />
                              <div className="ml-4 flex-grow">
                                <h3 className="font-medium text-gray-900 line-clamp-2">{item.offeredTitle}</h3>
                                <p className="text-sm text-gray-700 mt-1">Experience: {item.offeredExpireince}</p>
                                <div className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mt-2">
                                  {item.offeredCategory?.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {!swap.isPending && (
                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                          {!swap.isCompletedByReceiver ? (
                            <>
                              <button onClick={() => handleChat(swap.requesterSkill[0]?.userId)}
                                className="px-4 py-1 rounded bg-green-700 text-white hover:bg-green-800 transition-colors"
                              > Continue with Chat
                              </button>
                              <button onClick={() => handleCompletedReceived(swap._id)}
                                className="px-4 py-1 rounded bg-yellow-500 text-white  hover:bg-yellow-600 transition-colors"
                              > Swap Completed!
                              </button>
                            </>
                          ) : (
                            <button
                              className="px-4 py-1 rounded bg-yellow-500 text-white  hover:bg-yellow-600 transition-colors flex items-center gap-2"
                              onClick={() => handleReceivedAssessment(item._id, swap._id, swap.receiverSkill[0]?.userId) } > Assess
                              <Edit3 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <h3 className="text-xl font-medium mb-2">No received requests</h3> </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmModal
          rejectId={rejectId}
          setModal={setShowConfirmModal}
          complete={complete}
        />
      )}
    </div>
  );
};

export default SwapTransaction;