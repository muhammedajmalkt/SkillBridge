import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";

const Chat = () => {
  

  return (
    <div className="h-screen">
    <div className="flex flex-col h-[800px] mt-[72px] w-full max-w-md mx-auto border rounded-xl shadow-lg bg-white">
      {/* Chat Header */}
      <div className="p-4 bg-purple-600 text-white text-center font-semibold rounded-t-xl">
        Chat with Us 💬
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-100">
          <div className={`flex justify-end`}>
          </div>
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg max-w-xs text-white bg-gray-500 italic">
              Typing...
            </div>
          </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-t flex items-center bg-white rounded-b-xl">
        <input
          type="text"
          className="flex-1 p-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type a message..."
        />
        <button
          className="bg-purple-600 text-white p-2 rounded-r-lg flex items-center justify-center"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
    </div>
  );
};

export default Chat;
