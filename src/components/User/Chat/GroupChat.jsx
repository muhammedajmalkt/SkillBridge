import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { socket } from "../../../Lib/Socket";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import { ImAttachment } from "react-icons/im";
import { IoVideocam } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import toast from "react-hot-toast";

const GroupChat = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { groupId } = useParams();
  const navigate = useNavigate()
  const scrollRef = useRef(null);
  const {mutate} = useMutation({
    mutationFn: async ({groupId,userId})=>{        
        const {data}= await axiosInstance.put("/user/existgroup",{groupId,userId})
        return data
    },
    onSuccess:()=>{
        navigate("/group")
    },
    onError:(err)=>{
        toast.error(err.response?.data?.message || 'An error occurred', {
            position: 'top-right',
          });   
    }
  })

  // ✅ Join Group when Component Mounts
  useEffect(() => {
    if (!user?._id || !groupId) return;
    if (!socket.connected) socket.connect();
    socket.emit("joinGroup", groupId);
    return () => {
      socket.disconnect();
    };
  }, [user?._id, groupId]);

  // ✅ Listen for previous messages
  useEffect(() => {
    socket.on("previousMessages", (messages) => {
      setChats(messages);
    });
    socket.on("receiveMessage", (message) => {
      setChats((prevChats) => [...prevChats, message]);
    });
    return () => {
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, []);

  // ✅ Send Message Function
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      groupId,
      senderId: user?._id,
      chat: message, // ✅ Fixed: Send 'chat' instead of 'text'
    });
    setMessage(""); // Clear input after sending
  };

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chats]);

  // ✅ Fetch group members
  const { data: grpMembers } = useQuery({
    queryKey: ["grpmembers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/showmembers/${groupId}`);
      return data;
    },
  });  
  const handleGroupExit = ()=>{
    mutate({groupId,userId:user?._id})

  }

  return (
    <div className="h-[95vh] w-full flex bg-gray-100 ">
      {/* Left Sidebar */}
      <div className="w-72 bg-white border border-gray-200 p-6">
          <h1 className="text-gray-500 pb-5"> members</h1>
        {grpMembers?.data?.map((item) => (
          <div key={item._id} className="flex items-center gap-4 mb-3 border-b pb-2">
            <img src={item?.image || "default-avatar.png"} alt="Receiver Avatar" className="w-9 h-9 rounded-full object-cover bg-gray-300" />
            <h2 className="text-gray-600">
              {item?.name} {item._id === grpMembers.admin && <span className="text-green-600 text-xs bg-green-100 px-1 rounded">admin</span>}
            </h2>
          </div>
        ))}
        <div className="flex  flex-col h-[70%] justify-end"><h1 className=" text-red-600 cursor-pointer " onClick={handleGroupExit}>Exit group</h1>
        </div>

      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 bg-[#6d28d2] border-b border-gray-200 flex justify-between items-center">
         <div className="flex items-center gap-2">
         <img src={chats[0]?.group?.image} className="h-10 w-10 rounded-full"/>
          <h2 className="font-medium  text-white">{chats[0]?.group?.title}</h2>
        </div>
          <div className="flex gap-4">
            <IoVideocam className="text-2xl text-white cursor-pointer" />
            <BsThreeDotsVertical className="text-2xl text-white cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex  flex-col p-6 space-y-4 bg-gray-50 h-[80%] overflow-y-auto">
          {chats.map((item, index) => {
            const isSender = item.sender?._id === user?._id;                        
            return (
              <div key={index} className={`flex  ${isSender ? "justify-end" : "justify-start"}`}>
               <div className={isSender ? "flex flex-row-reverse gap-2  items-end" : "flex gap-2 items-end"}>
                <img src={isSender ? user?.image :  item?.sender?.image ||  "default-avatar.png"} alt="Receiver Avatar" className="w-9 h-9 rounded-full object-cover bg-gray-300" />
                <div className={`max-w-[70%]  p-2 rounded-lg ${isSender ? "bg-purple-600 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"}`}>
                  <p className="text-sm">{item.chat}</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </p>
                </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef}></div>
        </div>

        {/* Input Section */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl flex items-center">
          <ImAttachment className="text-xl w-10 text-gray-500 cursor-pointer" />
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 p-3 rounded-l-lg border" placeholder="Type a message..." />
          <button onClick={sendMessage} className="p-3 bg-[#6d28d2] text-white rounded-r-lg">
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
