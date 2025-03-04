import { AnimatePresence,motion } from 'framer-motion'
import React, { useState } from 'react'
import { useComplete, useReject } from '../../../hooks/useSwap'
import toast  from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

const ConfirmModal = ({rejectId,setModal,complete,setComplete}) => {
  const {mutate:rejectRequest} = useReject()
  const queryClient = useQueryClient();
  const {mutate:iscompleted} = useComplete()

  const sureLogout= ()=>{
    if(rejectId){
         rejectRequest(rejectId,{
          onSuccess : () =>{
            queryClient.invalidateQueries(["getReceived"]); 
            setModal(false)
          },  
           onError: (err) => {
            toast.error(err.response?.data?.message || "An error occured", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
            });
          }
         },)
        }else{
          if (!complete?.transactionId || !complete?.role) {
            console.error("Missing transactionId or role in complete data");
            console.log(complete);
            
            return;
          }
          iscompleted(complete,{
            onSuccess:(data)=>{
              setModal(false)
              console.log(data);
              setComplete({transactionId:"",role:"" })
            },
            onError: (err) => {
              toast.error(err.response?.data?.message || "An error occured", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
              })
            }
          })

        }
  }
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex z-30 items-center justify-center backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => 
          setModal(false) } >

        <motion.div
          className="dark:bg-[#111111] bg-gray-100  dark:text-white p-6 max-w-sm w-full rounded-xl shadow-lg relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e)=>e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Confirm</h2>
            <button 
            onClick={() => setModal(false)}
            >✕</button>
          </div>

          <p className="dark:text-gray-300 mb-4">{ rejectId ? "Are you sure ?" : "Are you sure you want to mark this as completed ?"}</p>

          <hr className="border-gray-700 mb-4" />

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
              onClick={() =>setModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              onClick={sureLogout}
            >{ rejectId? "Decline":"Completed"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ConfirmModal