import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { socket } from "../../../Lib/Socket";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import VideoCall from "../VideoCall/VideoCall";
import { ImAttachment } from "react-icons/im";
import { IoVideocam } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";





const Chat = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const { userId: receiverId } = useParams();
  const scrollRef = useRef(null);
  const [onlineUser,setOnlineUser]=useState([])
  const [startCall,setStartCall]=useState(false)

  useEffect(() => {
    if (!user?._id) return;
    if (!socket.connected) socket.connect();
    socket.emit("user_connected", user?._id);
    socket.on("onlineUser",(data)=>{
      setOnlineUser(data)
    })
    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data);
      setChats((prev) => [...prev, data]);
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [user?._id, receiverId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msg = {
      senderId: user?._id,
      receiverId: receiverId,
      chat: message,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", msg);
    setChats((prev) => [...prev, msg]);
    setMessage("");
  };

  useQuery({
    queryKey: ["getChats", receiverId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/getchat/${receiverId}`);
      setChats(data.data);
      return data.data;
    },
    enabled: !!receiverId,
  });

  // Fetch receiver 
  const { data: receiver } = useQuery({
    queryKey: ["findUser", receiverId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/finduser/${receiverId}`);
      return data.data;
    },
    enabled: !!receiverId,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chats]);

  // console.log(onlineUser.includes(receiverId));
  // console.log(onlineUser);
  
const handleVidecall = ()=>{
  setStartCall(true)
}
  return (
    <div className="h-screen w-full flex bg-gray-200">
      {/* Left Sidebar */}
      <div className="w-72 bg-white border-r border-gray-300 flex gap-5 p-6">
      {onlineUser.includes(receiver?._id) && <p className="bg-green-600 h-[10px] w-[10px] mt-9 ml-10 rounded-full absolute "></p>}
      <div className="bg-gray-200 h-fit w-full p-2 flex gap-3 rounded">

        <img
          src={receiver?.image || "default-avatar.png"}
          alt="Receiver Avatar"
          className={`w-10 h-10 rounded-full object-cover bg-gray-500 ${onlineUser.includes(receiver?._id) && "border-2 border-green-600 rounded-full"} `}
          />
        <div>
             <h2 className="text-xl font-semibold text-gray-800">{receiver?.name}</h2>
             <h2 className="text-xs text-gray-800">{receiver?.bio}</h2>
        </div>
          </div>
      </div>

      <div className="flex-1 flex flex-col items-center py-4 mt-2">
        <div className="flex flex-col h-[91%] w-[95%] max-w-full rounded-lg shadow-lg bg-white">
          <div className="p-4 bg-[#6d28d2] text-white text-center font-semibold rounded-t-lg flex justify-between items-center">
            Chat with {receiver?.name}
            <div className=" flex gap-5 ">
                         <IoVideocam className="scale-150 texti-[#6d28d2] " onClick={handleVidecall}/>
                         <BsThreeDotsVertical/>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white ">
            {chats?.map((item, index) => {
              const isSender = item.senderId === user?._id;
              return (
                <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"} w-full`}>
                  <div className={isSender ? "flex flex-row-reverse gap-2 items-end" : "flex gap-2 items-end"}>
                    <img
                      src={isSender ? user?.image : receiver?.image}
                      className="w-10 h-10 rounded-full object-cover bg-gray-500"
                      alt="User Avatar"
                    />
                    <div
                      className={`px-4 py-2 text-white max-w-xs md:max-w-md lg:max-w-lg shadow-md rounded-lg
                      ${isSender ? "bg-[#6c28d293] rounded-br-none" : "bg-gray-400  rounded-bl-none"}`}
                    >
                      <p className="text-sm">{item.chat}</p>
                      <p className="text-[10px] text-gray-200 mt-1 text-right">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef}></div>
          </div>

          {/* Input Section */}
          <div className="p-4 border-t flex items-center bg-white rounded-b-xl">
            <ImAttachment className="text-xl w-10 text-gray-500 cursor-pointer" />
            
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 p-3 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-[#6d28d2]"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-[#6d28d2] text-white p-3 rounded-r-lg flex items-center justify-center hover:bg-purple-700 transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
     { startCall && <VideoCall receiverId={receiverId}/>}

    </div>
  );
};

export default Chat;
