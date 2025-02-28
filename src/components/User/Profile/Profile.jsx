import React, { useState } from 'react'
import Nav from '../Navbar/Nav'
import EditProfile from './EditProfile'
import AddSwap from './AddSwap'
import { useSelector } from 'react-redux'
import AllSkills from './AllSkills'

const Profile = () => {
 const  [visible,setVisible]=useState("")
 const {  user } = useSelector((state) => state.auth)

console.log(user);

  return (
    <div className='mt-[72px] flex flex-row  justify-center max-w-[1862px]  p-6 '>
        <div className='flex flex-col border-l border-y border-gray-600  w-[215px] items-center text-center'>
            <img className='w-[120px] h-[120px] object-cover mt-8 rounded-full border-2 border-[#6d28d2] '
            src={ user?.image||"dp.jpg"} />
            <h3 className='font-medium pt-2 '>{user?.name}</h3>
            <h6 className='text-xs'>{user?.bio}</h6>
             <a href={user?.link || "#" }target="_blank" rel="noopener noreferrer" className={`text-xs  w-52 overflow-hidden px-2 pt-1 ${user?.link} cursor-pointer text-blue-600 : ""}`}>{user?.link || "Add Social Link"}</a>
            <button onClick={()=>setVisible("editProfile")}
            className={`text-xs border bg-[#6d28d2] text-white px-2 py-[2px] mt-4 rounded-3xl ${visible === "editProfile"?"bg-[#892de1]":"" } `}>Edit profile</button>
          
            <div className='mt-10 text-sm text-start'>
            <h6 className={`cursor-pointer mb-2  ${visible === "" ? "text-[#6d28d2]":""}`} onClick={()=>setVisible("")}>Profile</h6>
            <h6 className={`cursor-pointer mb-2 ${visible ==="allSkills" ? " text-[#6d28d2]": ""}`} onClick={()=>setVisible("allSkills")}>All Skills</h6>
            <h6 className={`mb-2 cursor-pointer  ${visible ==="addSwap" ? "bgg-[#6c28d239] text-[#6d28d2]": ""}`} onClick={()=>setVisible("addSwap")}>Add a Swap</h6>
            </div>
            
        </div>


  <div className='max-w-4xl'>
        {/* {profile edit} */}
        {visible === "editProfile" && <EditProfile/>}
          
         {/* {skill form} */}
         {visible === "addSwap" && <AddSwap/> }

         {visible === "allSkills" && <AllSkills />}



         { visible === "" && 
            <div className='border border-gray-600  min-w-[896px] min-h-screen'>
            <div className='border-b  border-gray-600  h-[92px]  py-4 text-center'> 
            <h1 className='text-20px font-semibold' >Exchange skills with others </h1>
            <h3 className='text-sm '>Add information about yourself</h3>
             </div>  
            
         </div>   }  

  </div>

            

    </div>
  )
}

export default Profile