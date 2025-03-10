import React, { useState } from 'react'
import Nav from '../Navbar/Nav'
import EditProfile from './EditProfile'
import AddSwap from './AddSwap'
import { useSelector } from 'react-redux'
import AllSkills from './AllSkills'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../../api/axiosInstance'
import Group from './Group'

const Profile = () => {
 const  [visible,setVisible]=useState("")
 const {  user } = useSelector((state) => state.auth)

 const {data:swaped}=useQuery({
  queryKey:['getscore'],
  queryFn: async()=>{
    const {data} = await axiosInstance.get("user/getscore")
    return data.data
  },
  enabled : !! user?._id
 })
console.log(swaped,"===============");

// console.log(user);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
    <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6 flex flex-col items-center  ">
        <div className="flex flex-col items-center text-center w-full bg-slate-100 py-2">
      <img
        className="w-28 h-28 object-cover rounded-full border-4 border-[#6d28d2] shadow-md"
        src={user?.image || "dp.jpg"}
        alt="User Profile"
      />
      <h3 className="font-semibold text-lg text-gray-800 mt-2">{user?.name}</h3>
      <h6 className="text-sm text-gray-600">{user?.bio}</h6>
      
      <a  href={user?.link || ""} target="_blank" rel="noopener noreferrer"
        className="text-xs text-blue-600 mt-1 w-52 truncate"
      >{user?.link || "Add Social Link"}
      </a>

      <button onClick={() => setVisible("editProfile")}
        className={`text-xs px-4 py-1 mt-3 rounded-full bg-[#6d28d2] text-white hover:bg-[#892de1] transition ${visible === "editProfile" ? "bg-[#892de1]" : "" }`}
      >  Edit Profile
      </button>
    </div>

    {/* Navbar */}
    <div className="flex justify-center space-x-6 mt-6 text-sm">
      <h6 className={`cursor-pointer px-4 py-2 rounded-lg ${ visible === "" ? "text-[#6d28d2] bg-gray-100" : "text-gray-600" }`}
        onClick={() => setVisible("")} >Profile
      </h6>
      <h6 className={`cursor-pointer px-4 py-2 rounded-lg ${ visible === "allSkills" ? "text-[#6d28d2] bg-gray-100" : "text-gray-600"}`}
        onClick={() => setVisible("allSkills")} > All Skills
      </h6>
      <h6
        className={`cursor-pointer px-4 py-2 rounded-lg ${ visible === "addSwap" ? "text-[#6d28d2] bg-gray-100" : "text-gray-600" }`}
        onClick={() => setVisible("addSwap")}
      > Add Swap
      </h6>
      <h6
        className={`cursor-pointer px-4 py-2 rounded-lg ${ visible === "peergroup" ? "text-[#6d28d2] bg-gray-100" : "text-gray-600" }`}
        onClick={() => setVisible("peergroup")}
      >Peer Group
      </h6>
    </div>
  </div>

  <div className="w-full max-w-4xl mt-6">
    {visible === "editProfile" && <EditProfile />}
    {visible === "addSwap" && <AddSwap />}
    {visible === "allSkills" && <AllSkills />}
    {visible === "peergroup" && <Group />}

    {!visible && ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {swaped?.map((item, index) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      <img
        src={item.offeredImage}
        alt="image"
        className="w-32 h-28 object-cover rounded-md bg-gray-200"
      />
      <div className="relative w-32 h-16 mt-6 overflow-hidden">
        <div
          className={`absolute top-0 left-0 w-full h-full ${item.score < 40
              ? "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/50"
              : item.score > 70
              ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/50"
              : "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/50"
          } rounded-tl-full rounded-tr-full`}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold">
          {item.score}%
        </div>
      </div>
      <h1 className="text-lg font-semibold text-gray-700 mt-4">{item.offeredTitle}</h1>
    </div>
  ))}
</div>
  )}
  </div>
</div>

  )
}

export default Profile