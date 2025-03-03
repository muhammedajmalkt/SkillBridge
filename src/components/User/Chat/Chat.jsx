import React, { useState, useEffect, useRef,  } from "react";
import { FaPaperPlane } from "react-icons/fa";
import {socket} from '../../../Lib/Socket'
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";

const Chat = () => {
  const [message, setMessage] = useState("")
  const [chats,setChats] = useState([])
  
const {user} = useSelector((state)=>state.auth)
const {userId:receiverId} = useParams()
// console.log(user);


  useEffect(() => {
    if (!user?._id) return;
      // Join chat
      socket.connect()
      socket.on("user_connected", user?._id)
      socket.on("receiveMessage", (data)=>{
        console.log(data);
        sendMessage((prv)=>[...prv,data])///     
      })
      return () => socket.disconnect();
  }, [user?._id, receiverId]);

   const sendMessage = () =>{
    const msg={
      senderId:user?._id,
      receiverId:receiverId,
      chat:message,
      createdAt:new Date()
    }
    socket.emit("sendMessage", msg)
    setChats((prev)=> [...prev,msg])
    setMessage("")
  }

  //get chats
  const {data}=useQuery({
    queryKey:["getChats"],
    queryFn: async ()=>{
      const {data} = await axiosInstance.get(`/user/getchat/${receiverId}`)
      setChats(data.data)
      return data.data
    } 
  })

  // Timestamp Formatting Function
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" ,hour12:true});};
  const chatContainerRef = useRef(null);

  //get receiver detailes
 const {data:receiver} = useQuery ({
  queryKey:["find"],
  queryFn:async () =>{
    const {data} = await axiosInstance.get(`/user/finduser/${receiverId}`)
    return data.data
  }, enabled :!!receiverId
})

  return (
   <div className=" flex items-center justify-center bg-gray-200 p-4 ">
      <div className="flex flex-col h-[800px] w-full max-w-md border rounded-xl shadow-lg bg-white">
        {/* Chat Header */}
        <div className="p-4 bg-[#6d28d2] text-white text-center font-semibold rounded-t-xl">
          Chat with {receiver?.name}
        </div>

        {/* Chat Messages */}
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
          {chats?.map((item, index) => {
            const isSender = item.senderId === user?._id;
            return (
              <div key={index} className={`flex   ${isSender ? "justify-end  " : "justify-start "} w-full`}>
            <div className={isSender ? "flex flex-row-reverse gap-2":"flex gap-2"}>
            <img src={isSender ? user?.image : receiver?.image} className="w-10 h-10 rounded-full object-cover"/>
                <div
                  className={`px-4 py-2 text-white max-w-xs md:max-w-md lg:max-w-lg shadow-md h-11
                  ${isSender ? "bg-[#6c28d293] rounded-tl-lg rounded-br-lg rounded-bl-lg" : "bg-gray-500 rounded-tr-lg rounded-br-lg rounded-bl-lg"}`}
                >
                  <p className="text-sm">{item.chat}</p>
                  <p className="text-[10px] text-gray-300 mte-1 text-right">{formatTimestamp(item.createdAt)}</p>
                </div>
            </div>
              </div>
            );
          })}
        </div>

        {/* Input Box */}
        <div className="p-3 border-t flex items-center bg-white rounded-b-xl">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); 
                sendMessage();
              }
            }}
            className="flex-1 p-2 rounded-l-lg border focus:outline-none focus:ring-1 "
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-[#6d28d2] text-white p-3 rounded-r-lg flex items-center justify-center hover:bg-purple-700 transition border-2"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};


export default Chat;
