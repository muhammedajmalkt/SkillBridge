import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../api/axiosInstance'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Loader from '../Layout/Loader'
import { IoSearchOutline } from "react-icons/io5";
import { BsChevronRight } from 'react-icons/bs'

const SwapSkill = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchInput, setSearchInput] = useState("")
    const [searchValue, setSearchValue] = useState("")
    const [category, setCategory] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const handleSearch = () => {
        setSearchValue(searchInput)
        setPage(1) 
    }

    const handleCategory = (item) => {
        setCategory(item)
        setPage(1) 
    }
    const productClick = (id) => {
        navigate(`/details/${id}`)
    }
    const { data: skills, isLoading,  } = useQuery({
      queryKey: ["skills", searchValue, category, page],
      queryFn: async () => {
          const params = { offeredTitle: searchValue, offeredCategory: category, limit: 8, page };
          const { data } = await axiosInstance.get(`/user/getswap`, { params });
          setTotalPages(data.pagination.totalPages || 1);
          return data;
      },
  });
    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1)
        }
    }
    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1)
        }
    }
    return (
        <div className='flex flex-col min-h-screen'>
            {/* Sidebar */}
            <div className='w-1/6 min-h-screen bg-slate-50 p-4 shadow-md absolute  '>
                <div className='w-full mt-3'>
                    <input type='text' placeholder='Search' value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                        className='border border-[#6d28d2] h-8 px-4 rounded-tl-2xl rounded-bl-2xl focus:outline-none focus:ring-1 focus:ring-[#6d28d2] bg-slate-50'
                    />
                    <button onClick={handleSearch} className='bg-[#6d28d2] text-white border-2 border-[#6d28d2] text-md py-[6px] rounded-tr-2xl rounded-br-2xl px-2 hover:bg-[#892de1] absolute r-0'><IoSearchOutline /></button>
                </div>
                <h1 className='font-semibold border-b border-gray-400 mt-8 pb-3'>Filters</h1>
                <h3 className='text-xs font-medium py-3'>CATEGORIES</h3>
                {["art/creativity", "cooking", "computer/it", "outdoor/sports", "languages", "consulting", "beauty/health", "education", "music", "others"].map((item) => (
                    <h3 key={item} className={`text-[13px] py-[6px] flex cursor-pointer items-center justify-between ${category === item ? "text-[#6d28d2] font-semibold" : "text-gray-500"}`} onClick={() => handleCategory(item)}>
                        {item.toUpperCase()} <span className={`${category === item ? "" : "rotate-90 duration-300 ease-in"}`}><BsChevronRight /></span>
                    </h3>
                ))}
                     <h3 className='text-xs mt-8   border-y border-gray-400  py-3 font-medium ' >CUSTOMER RATING </h3>
            </div>

            <div className='flex justify-center mt-[8px] mb-28 px-24 pt-5 ml-72'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {isLoading ? (
                        <div className='relative h-screen left-[100px] top-[400px] w-full items-center'><Loader /></div>
                    ) : skills?.data.length > 0 ? (
                        skills.data.map((item, index) => (
                            <div key={index} onClick={() => productClick(item._id)} className='group flex flex-col h-[380px] w-[280px] shadow-xl rounded-md overflow-hidden bg-white transition-transform duration-300 hover:scale-105 cursor-pointer'>
                                <img loading='lazy' className='h-[160px] object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-110' src={item.offeredImage || 'sample.png'} alt='Skill Image' />
                                <div className='p-4'>
                                    <h1 className='text-md hover:text-[#6d28d2] h-[60px] overflow-hidden'>{item.offeredTitle}</h1>
                                    <h1 className='bg-[#F8F8F9] text-sm text-gray-500 mt-4 py-1 text-center'>{item.offeredCategory?.toUpperCase()}</h1>
                                    <button className='border border-[#6d28d2] w-full text-[#6d28d2] hover:text-white hover:bg-[#6d28d2] mt-8 text-xs px-10 py-2 rounded-3xl'>VIEW DETAILS</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flex justify-center'><h1>No skills found</h1></div>
                    )}
                </div>
            </div>
         { skills?.data.length > 0 &&  <div className='flex justify-center gap-20 w-[95%] text-white mb-5 px-5'>
                <button className='bg-gray-500 px-5 py-1 rounded w-fit' onClick={handlePrevPage} disabled={page === 1}>Previous</button>
                <span className='text-black font-semibold'>Page {page} of {totalPages}</span>
                <button className='bg-[#6d28d2] px-5 py-1 rounded w-fit' onClick={handleNextPage} >Next</button>
            </div>}

        </div>
    )
}

export default SwapSkill
