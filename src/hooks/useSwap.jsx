import { useMutation } from "@tanstack/react-query"
import axiosInstance from "../api/axiosInstance"



const createSwap = async (swapData) =>{    
    const {data } = await axiosInstance.post("/user/createswap",swapData,
                    {headers: { "Content-Type": "multipart/form-data" }})
    return data
}

const deleteSwap = async (skillId) =>{
    const {data} = await axiosInstance.patch("/user/get/deleteswap",{skillId:skillId})
    return data  
}

/////swapTransaction
const createTransaction = async(swapData) =>{
    const {data} = await axiosInstance.post("/user/createtransaction",swapData) 
    return data
}
//unswap
const unswap = async (transactionId) =>{
    const {data} = await axiosInstance.delete(`/user/unswap/${transactionId}`,)
    return data
}
//accept
const acceptRequest = async (transactionId) =>{
    const {data} = await axiosInstance.put("/user/acceptrequest",{transactionId})
    return data
}
const rejectRequest = async (transactionId) =>{
    const {data} = await axiosInstance.delete(`/user/rejectrequest/${transactionId}`,)
    return data
}
const createQst = async (Questionnaire)=>{
    const {data} =await axiosInstance.post ("/user/createquest",Questionnaire)
    return data
}

export const useCreateSwap = ()=>{
    return useMutation({
        mutationFn:createSwap,
    })
}
export const useDeleteSwap = ()=>{
    return useMutation ({
        mutationFn:deleteSwap
    })
}
export const useCreateTransaction = ()=>{
    return useMutation({
        mutationFn:createTransaction
    })
}
export const useUnswap = () =>{
    return useMutation({
        mutationFn:unswap
    })
}
export const useAccept = ()=>{
    return useMutation ({
        mutationFn:acceptRequest
    })
} 
export const useReject = ()=>{
    return useMutation ({
        mutationFn:rejectRequest
    })
} 
export const useCreateQst = () =>{
    return useMutation ({
        mutationFn:createQst
    })
}