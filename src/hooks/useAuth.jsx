import { useDispatch } from "react-redux"
import axiosInstance from "../api/axiosInstance"
import { useMutation, useQuery } from "@tanstack/react-query"
import { data, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

   const signup = async(userData)=>{
    const {data} = await axiosInstance.post ("/user/signup",userData)
    return data
  }

  const login = async (userData)=>{
    const {data} = await axiosInstance.post("/user/login",userData)
    return data
  }
  
  const logout = async ( )=>{
    const {data} = await axiosInstance.post("/user/logout")
    console.log("logout ", data);
    return data
  }

  const editProfile = async (userData)=>{
    const {data} = await axiosInstance.patch("/user/editprofile",userData,{headers: { "Content-Type": "multipart/form-data" }})
    return data
  }
    
export const useSignup = ()=>{
  return useMutation({
    mutationFn: signup      
    
  })
}
export const useLogin = ()=>{
    return useMutation({
      mutationFn :login,
    })
}

export const useLogout = () =>{
  return useMutation ({
    mutationFn : logout,
  },)
}

export const useEditProfile = () =>{
  return useMutation({
    mutationFn :editProfile
  })
}
