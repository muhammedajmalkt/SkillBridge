import React, { useState } from 'react';
import { CiClock2 } from "react-icons/ci";
import { HiLanguage } from "react-icons/hi2";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { BiCategory } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../Layout/Loader';
import SwapWith from '../SwapTransaction/SwapWith';
import toast from 'react-hot-toast';
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";

const Details = () => {
  const { skillid } = useParams();
  const [request, setRequest] = useState(false);
  const [receiverSkill, setReceiverSkill] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate("/");
  const queryClient = useQueryClient();

  const { data: details, isLoading } = useQuery({
    queryKey: ["details"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/getswap/${skillid}`);
      return data.data;
    },
    enabled: !!skillid
  });

  const { mutate } = useMutation({
    mutationFn: async ({ skillId }) => {
      const { data } = await axiosInstance.post("/user/addtofavourite", { skillId });
      return data;
    }
  });

  const { mutate: remove } = useMutation({
    mutationFn: async ({ skillId }) => {
      const { data } = await axiosInstance.put("/user/removefromfavourite", { skillId });
      return data;
    }
  });

  const handleRequest = (details) => {
    if (!isAuthenticated) {
      toast.error("An error occurred, Please Login", {
        position: "top-right",
        autoClose: 3000,
      });
      return navigate("/");
    }
    setRequest(true);
    setReceiverSkill(details);
  };

  const handleFavourite = (id) => {
    if (isAuthenticated) {
      mutate({ skillId: id }, {
        onSuccess: (data) => {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000,
          });
          queryClient.invalidateQueries(["getfavour"]);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message, "An error occurred", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
    } else {
      toast.error("Session Expired, Please Log in", {
        position: "top-right"
      });
      navigate("/");
    }
  };

  const handelRemoveFav = (id) => {
    remove({ skillId: id }, {
      onSuccess: () => {
        queryClient.invalidateQueries(["getfavour"]);
      }
    });
  };

  const { data: favour } = useQuery({
    queryKey: ["getfavour"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/user/showfavourite");
      return data.data.favouriteSkills;
    },
    enabled: !!isAuthenticated
  });

  const isInFavourite = (productId) => {
    return favour?.length > 0 && favour.find(item => item._id === productId);
  };

  if (isLoading) return <div className='mt-[72px] h-screen flex justify-center items-center'><Loader /></div>;

  return (
    <div className='h-auto mt-[2px]'>
      <div className='bg-slate-100 h-64'>
        <h1 className='w-full p-8 md:p-32 text-2xl font-bold text-[#181818]'>{details.offeredTitle}</h1>
      </div>

      <div className='m-8 flex flex-col md:flex-row gap-10 justify-center text-gray-600'>
        {/* Left Section */}
        <div className='w-full md:w-[760px] p-4 md:p-10'>
          <span className='text-xl border-l-4 border-[#6d28d2] font-bold pl-4 text-black'>Overview</span>
          <h6 className='pt-8 font-semibold'>Objective:</h6>
          <p className='pt-2'>{details.offeredDetails}</p>
          <h6 className='font-semibold pt-5'>Category:</h6>
          <p>{details.offeredCategory.toUpperCase()}</p>
          <h6 className='font-semibold pt-5'>Duration:</h6>
          <p>{details.hours} Hours</p>
          <h6 className='font-semibold pt-5'>Experience Level:</h6>
          <p>{details.offeredExpireince}</p>

          <hr className='my-20' />

          {/* Needed Details */}
          <h1 className='text-xl font-bold border-l-4 border-[#6d28d2] pl-4 text-black'>Swap with</h1>
          <h3 className='pt-8 text-xl font-bold text-black'>{details.neededTitle}</h3>
          {details?.neededImage &&
            <img src={details.neededImage} className='object-cover h-[150px] w-full mt-2' alt="Needed Skill" />}
          <h6 className='pt-8 font-semibold'>Objective:</h6>
          <p className='pt-2'>{details.neededDetails}</p>
          <h6 className='font-semibold pt-5'>Category:</h6>
          <p>{details.neededCategory.toUpperCase()}</p>
          <h6 className='font-semibold pt-5'>Duration:</h6>
          <p>{details.hours} Hours</p>
          <h6 className='font-semibold pt-5'>Priority Level:</h6>
          <p>{details.neededPriority}</p>
        </div>

        {/* Right Section */}
        <div className='w-full md:w-auto'>
          <div className='border p-4 rounded-md h-fit'>
            <button className={`scale-150 w-fit ml-32 text-[#6d28d2] absolute right-72`} onClick={() => isInFavourite(details._id) ? handelRemoveFav(details._id) : handleFavourite(details._id)}>
              {isInFavourite(details._id) ? <IoBookmark /> : <IoBookmarkOutline />}
            </button>
            <img className='w-full md:w-80 h-48 object-cover rounded-md mb-4 bg-slate-500' src={details.offeredImage || "/sample.png"} alt='skillpic' />
            <div className='flex flex-col gap-5 text-[15px]'>
              <h1 className='flex items-center border-b py-3 gap-1'>
                <span><CiClock2 /></span>Duration:<span className='w-full text-end'>{details.hours}hr</span>
              </h1>
              <h1 className='flex items-center border-b py-3 gap-1'><HiLanguage /> Language:<span className='w-full text-end'>English</span></h1>
              <h1 className='flex items-center border-b py-3 gap-1'><BiCategory /> Category:<span className='w-full text-end text-[13px]'>{details.offeredCategory.toUpperCase()}</span></h1>
              <h1 className='flex items-center py-3 gap-1'><HiOutlineCheckBadge /> Certificate:<span className='w-full text-end'>No</span></h1>
              <button className='bg-[#6d28d2] rounded-3xl py-2 text-white hover:bg-[#892de1] hover:ease-in my-4' onClick={() => handleRequest(details)}>REQUEST A SWAP</button>
            </div>
          </div>

          {/* Profile Section */}
          <div className='border rounded flex h-35 p-5 mt-5 cursor-pointer hover:bg-slate-100'>
            <img src={details.userId.image }  alt="Profile" className='bg-slate-400 w-20 h-20 rounded-full mr-5 object-cover' />
            <div>
              <h1 className='font-semibold mb-1'>{details.userId.name || ""}</h1>
              <h1 className='text-sm mb-1'>{details.userId.bio || ""}</h1>
              <h1 className='text-xs font-semibold mb-1 text-[#8b4309]'>{"4.7 Rating"}</h1>
              <h1 className='text-xs'>{"7 "}Skill Swapped</h1>
            </div>
          </div>
        </div>
      </div>

      {request && <SwapWith receiverSkill={receiverSkill} setRequest={setRequest} />}
    </div>
  );
};

export default Details;