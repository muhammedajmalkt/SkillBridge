import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import axiosInstance from '../../../api/axiosInstance'
import Loader from '../Layout/Loader'
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Group = () => {
    const {user} = useSelector((state)=>state.auth)
    const {isAuthenticated} = useSelector((state)=>state.auth)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const {mutate} =  useMutation({
        mutationFn: async (groupId)=>{
          const {data} = await axiosInstance.put("/user/groupjoin",{groupId:groupId})
          console.log(data);
          return data
        },
      })
    const {data:group,isLoading}= useQuery({
        queryKey:["getgroup"],
        queryFn:async()=>{
            const {data} = await axiosInstance.get("/user/showgroup")
            return data.data
        }
    })
    // console.log(group);
    const groupJoin =(id)=>{
        if(isAuthenticated){        
        mutate(id,{
            onSuccess:(data)=>{
                toast.success(data?.message, {
                    position: "top-right"})
              queryClient.invalidateQueries(["getgroup"])
            },
            onError :(err)=>{
            console.log(err);  
            toast.error(err.response?.data?.message || "An error occurred", {
                position: "top-right"})         
        }})
    }else{
        toast.error( "An error occurred ,Please Log in", {
            position: "top-right"})   
            navigate("/")  
    }
    }
const groupChat =(groupId)=>{
    navigate(`/groupchat/${groupId}`)
}    
 const joined = group?.filter((item)=>item.members.includes(user?._id)) 

  return (
    <div>
         <h1 className='text-2xl border-b-2 pt-5 pb-4 pl-10 font-medium mt-9'> Groups</h1>
               {isAuthenticated && joined && 
                <div className='px-48 pt-5 border-b '>
               <h1 className='text-gray-400'>You are in following groups!</h1>
               <div className=" mt-[8px] mb-5 ">
               <div className="">
                {joined?.map((item,index)=>( 
                    <div key={index}
                        className=" flex  h-fit  shadow-xl  mb-2 rounded-md overflow-hidden p-5 bg-white cursor-pointer  " >
                        <img
                            className="h-32 w-32 object-cover "
                            src={item.image ||'sample.png'}
                            alt="Skill Image"
                        />
                        <div className='flex justify-between w-full'>

                        <div className="px-4 flex flex-col">
                            <h1 className="text-md hover:text-[#6d28d2] h-[50px] overflow-hidden">{item.title}</h1>
                            <h1 className="text-sm hover:text-[#6d28d2] h-[60px] overflow-hidden max-w-3xl ">{item.details}</h1>
                            {/* <h1 className="bg-[#F8F8F9] text-sm text-gray-500 mt-4 py-1 text-center">{item.category?.toUpperCase()}</h1> */}
                        </div>
                           <button className="border border-[#6d28d2] w-fit  h-fit text-white bg-[#6d28d2]  hover:bg-[#6c28d2dd] mt-8 text-xs px-10 py-2 rounded-3xl"
                           onClick={()=>groupCxhat(item._id)}> GO TO CHAT
                           </button>
                    </div>
                    </div>
                ))}
            </div>
            </div>

               </div>}
                

         <div className="flex justify-center mt-[8px] mb-28 px-24 pt-5 h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {isLoading  ? <div className='flex justify-center  h-screen  w-full items-center  '><Loader /></div>
                 : group?.length > 0 ? group?.map((item,index)=>( 
                    <div key={index}
                        className="group flex flex-col h-fit w-[280px] shadow-xl rounded-md overflow-hidden bg-white transition-transform duration-300 hover:scale-105 cursor-pointer "
                      >
                        <img
                            className="h-[160px] object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                            src={item.image ||'sample.png'}
                            alt="Skill Image"
                        />
                        <div className="p-4">
                            <h1 className="text-md hover:text-[#6d28d2] h-[60px] overflow-hidden">{item.title}</h1>
                            <h1 className="text-sm hover:text-[#6d28d2] h-[78px] overflow-hidden">{item.details}</h1>
                            <h1 className="bg-[#F8F8F9] text-sm text-gray-500 mt-4 py-1 text-center">{item.category?.toUpperCase()}</h1>
                           { item?.members.includes(user?._id)?
                           <button className="border border-[#6d28d2] w-full text-white bg-[#6d28d2]  hover:bg-[#6c28d2dd] mt-8 text-xs px-10 py-2 rounded-3xl"
                           onClick={()=>groupChat(item._id)}> GO TO CHAT
                           </button>:
                            <button className="border border-[#6d28d2] w-full text-white bg-[#6d28d2]  hover:bg-[#6c28d2dd] mt-8 text-xs px-10 py-2 rounded-3xl"
                            onClick={()=>groupJoin(item._id)}> JOIN NOW
                            </button>}
                        </div>
                    </div>
                )): <div className='flex justify-center  '>{ !isLoading   && <h1>No group found</h1>}</div>}
            </div>
          
        </div>
    </div>
  )
}

export default Group
