import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../api/axiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { skillSwapSuccess } from '../../../Redux/Feature/skillSwap'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Loader from '../Layout/Loader'
import { IoSearchOutline } from "react-icons/io5";
import { MdChevronRight } from 'react-icons/md'
import { BsChevronRight } from 'react-icons/bs'





const SwapSkil = () => {
    const navigate = useNavigate()
    const dispatch= useDispatch()
    const [searchInput,setSearchInput] = useState("")
    const [searchValue,setSearchValue] = useState("")
    const [category,setCategory]=useState("")

const handleSearch = () =>{
    setSearchValue(searchInput)
  } 
const handleCategory = (item) =>{
   setCategory(item)
}  
const productClick= (id) =>{
     navigate(`/details/${id}`)
}    
    
const {data:skills,isLoading,error,} = useQuery({
    queryKey:["skills",searchValue,category],
    queryFn:async ()=>{
        const params = {offeredTitle:searchInput,offeredCategory:category,limit:30 }
      const {data} = await axiosInstance.get(`/user/getswap`,{params:params})
      return data 
    },
  })
  console.log(skills?.data);
  console.log(error);
  
 
  
  // if(isLoading)return  <div className='mt-[72px] h-screen flex justify-center items-center '><Loader /></div>
  if(error) return <p className="text-center w-full h-screen mt-[72px]">No skills found!</p>
   
  return (
    <div className='flex'>
    {/* <SideBar/> */}
    <div className='w-1/6 h-screen bg-slate-50 mtw-[72px] p-4 shadow-md'>
                      <div className=' w-full mt-3'>
                            <input type='text' placeholder='Search' value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}
                            className='border border-[#6d28d2] h-8 px-4   rounded-tl-2xl rounded-bl-2xl focus:outline-none focus:ring-1 focus:ring-[#6d28d2] bg-slate-50'
                            />
                            <button  onClick={handleSearch} type='submit' className='bg-[#6d28d2] text-white border-2 border-[#6d28d2] text-md py-[6px]  rounded-tr-2xl rounded-br-2xl px-2 hover:bg-[#892de1]  absolute r-0'><IoSearchOutline/> </button>    
                          
                         </div>
                
                <h1 className='font-semibold border-b border-gray-400 mt-8 pb-3' >Filters</h1>
                <h3 className='text-xs font-medium py-3' >CATEGORIES</h3>
                {[
                    "art/creativity",
                    "cooking",
                    "computer/it",
                    "outdoor/sports",
                    "languages",
                    "consulting",
                    "beauty/health",
                    "care/sitting",
                    "do it yourself",
                    "education",
                    "music",
                    "others",
                  ].map((item)=>(
                    <h3 className={`text-[13px] py-[6px] flex cursor-pointer items-center justify-between ${category === item ? "text-[#6d28d2] font-semibold" : "text-gray-500"}`} 
                     onClick={()=>handleCategory(item)}> {item.toUpperCase()} <span className={`${category === item ? "":"rotate-90 duration-300 ease-in " }`} ><BsChevronRight /></span></h3>
                  ))}
                  <h3 className='text-xs mt-8   border-y border-gray-400  py-3 font-medium ' >CUSTOMER RATING </h3>
            </div>
        {/* <SideBar/> */}


         {/* Card Section */}
        <div className="flex justify-center mt-[8px] mb-28 px-24 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                
               {isLoading ? <div className='mt-[72px] w-screen h-screen flex justify-center items-center '><Loader /></div> :
                skills?.data.length > 0 ? skills?.data.map((item,index)=>( 
                    <div
                        onClick={()=>productClick(item._id)}
                        key={index}
                        className="group flex flex-col h-[400px] w-[280px] shadow-xl rounded-md overflow-hidden bg-white transition-transform duration-300 hover:scale-105 cursor-pointer "
                      >
                        <img
                            className="h-[160px] object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                            src={item.offeredImage ||'sample.png'}
                            alt="Skill Image"
                        />
                        <div className="p-4">
                            <h1 className="text-md hover:text-[#6d28d2] h-[78px] overflow-hidden">{item.offeredTitle}</h1>
                            <h1 className="bg-[#F8F8F9] text-sm text-gray-500 mt-4 py-1 text-center">{item.offeredCategory?.toUpperCase()}</h1>
                            <button className="border border-[#6d28d2] w-full text-[#6d28d2] hover:text-white hover:bg-[#6d28d2] mt-8 text-xs px-10 py-2 rounded-3xl">
                                REQUEST A SWAP
                            </button>
                        </div>
                    </div>
                )): <div className='flex justify-center  '><h1>No skills found</h1></div>}
            </div>
          
        </div>

    </div>   
  )
}

export default SwapSkil