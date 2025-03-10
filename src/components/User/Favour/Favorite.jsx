import React from 'react'
import Loader from '../Layout/Loader'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../../../api/axiosInstance'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Favorite = () => {
  const {user}=useSelector((state)=>state.auth)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {data:favour,isLoading} = useQuery({
    queryKey:["getfavour"],
    queryFn : async()=>{
      const {data} = await axiosInstance.get("/user/showfavourite")
      return data.data
    },enabled :!!user?._id
  })
  // console.log(favour);

  const {mutate} =useMutation({
    mutationFn: async({skillId})=>{
     const {data} = await axiosInstance.put("/user/removefromfavourite",{skillId})
      return data
    }
  })
  
  const productClick= (id) =>{
    navigate(`/details/${id}`)
} 
const handleRemove = (id)=>{
  mutate({skillId:id})
  queryClient.invalidateQueries(["getfavour"])
}    
if(isLoading) return <div className='relative  h-screen left-[500px] top-[400px] w-full items-center '><Loader /></div> 
  return (
    <div className='h-screen'>
            <h1 className='text-2xl border-b-2 pt-5 pb-4 pl-10 font-medium mt-9'>Favourites</h1>
              <div className="flex justify-center mt-[8px] mb-28 px-24 pt-5 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                
               
                {favour?.favouriteSkills?.length > 0 ? favour?.favouriteSkills.map((item,index)=>( 
                    <div key={index} className="group flex flex-col h-[400px] w-[280px] shadow-xl rounded-md overflow-hidden bg-white transition-transform duration-300 hover:scale-105  " >
                        <img  onClick={()=>productClick(item._id)}
                            className="h-[160px] object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-110 cursor-pointer"
                            src={item?.offeredImage ||'sample.png'} alt="Skill Image"
                        />
                        <div className="p-4">
                            <h1 className="text-md hover:text-[#6d28d2] h-[78px] overflow-hidden cursor-pointer" onClick={()=>productClick(item._id)} >{item.offeredTitle}</h1>
                            <h1 className="bg-[#F8F8F9] text-sm text-gray-500 mt-4 py-1 text-center">{item.offeredCategory?.toUpperCase() }</h1>
                            <button className="border border-[#6d28d2] w-full text-[#6d28d2] hover:text-white hover:bg-[#6d28d2] mt-8 text-xs px-10 py-2 rounded-3xl"
                            onClick={()=>handleRemove(item._id)}> Remove 
                            </button>
                        </div>
                    </div>
                 )): <div className='flex justify-center  '>{ !isLoading   && <h1>No skills found</h1>}</div>} 
            </div>
        </div>
          
    </div>
  )
}

export default Favorite