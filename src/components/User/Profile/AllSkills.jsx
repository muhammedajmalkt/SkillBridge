import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Loader from "../Layout/Loader";
import { useDeleteSwap } from "../../../hooks/useSwap";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AllSkills = () => {
  const [threeDot, setThreeDot] = useState(null);
  const navigate = useNavigate();
  const { mutate: deleteSwap } = useDeleteSwap();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { data, isloading, error, isLoading } = useQuery({
    queryKey: ["getAll"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/user/get/getSwapByUserId");
      return data;
    },
    enabled: !!isAuthenticated,
  });
  const skill = data?.data;
  console.log(data);
  console.log(error);

  const handleClick = (id) => {
    navigate(`/details/${id}`);
  };

  const handleThreeDot = (id) => {
    setThreeDot((prevId) => (prevId === id ? null : id));
  };

  const handleDelete = (id) => {
    console.log(id);
    deleteSwap(id, {
      onSuccess: (data) => {
        toast.success(data?.message, {
          position: "top-right",
        });
        queryClient.invalidateQueries(["getAll"]);
      },
      onError: (err) => {
        console.log("API Error:", err?.response.data);
        toast.error(err.response?.data?.message || "An error occurred", {
          position: "top-right",
        });
      },
    });
  };

  if (isLoading)
    return (
      <div className="mt-[72px] h-screen flex justify-center items-center ">
        <Loader />
      </div>
    );

  return (
    <div className=" shadow-lg rounded-lg w-full  mx-auto bg-white max-w-5xl pb-1 mb-10">
    <div className="border-b border-gray-300 py-2 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg h-14">
      <h1 className=" font-medium text-white">Your Swap Skills</h1>
      {/* <h3 className="text-xs text-gray-200">Swap Added to Your Profile!</h3> */}
    </div>
  
    {skill.length ? (
      skill.map((skill) => (
        <div key={skill._id}
          className="flex items-center shadow-sm p-4 mx-4 my-3 gap-6 rounded-lg bg-white hover:shadow-md transition-shadow duration-300"
        >
          <img className="min-w-36 h-24 rounded-md bg-gray-300 cursor-pointer object-cover shadow-md transition-transform hover:scale-105"
            src={skill?.offeredImage || "sample.png"} alt="Skill"
            onClick={() => handleClick(skill._id)}
          />
  
          <div className="flex justify-between w-full items-center">
           <div>
              <h1  className="font-semibold text-gray-800 text-lg cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => handleClick(skill._id)}
              >{skill?.offeredTitle}
              </h1>
              <h1 className="text-gray-500 text-sm mt-1">{skill?.offeredCategory}</h1>
            </div>
  
            <div className="relative">
              <span className="cursor-pointer text-gray-600 hover:text-gray-800" onClick={() => handleThreeDot(skill._id)}><BsThreeDotsVertical size={20} /></span>
  
              {threeDot === skill._id && (
                <div className="absolute right-0 mt-2 bg-white w-32 py-2 border border-gray-200 text-sm rounded-lg shadow-lg text-gray-700 z-10">
                  <h1 className="cursor-pointer hover:bg-gray-100 px-4 py-2 transition-colors"> Edit </h1>
                  <h1 className="cursor-pointer hover:bg-gray-100 px-4 py-2 transition-colors" onClick={() => handleDelete(skill._id)} >Delete </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="flex justify-center py-6">
        <h1 className="text-gray-500 text-sm">No items found</h1>
      </div>
    )}
  </div>
  
  );
};

export default AllSkills;
