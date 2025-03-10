import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { signupValidation } from './Validation';
import { useSignup } from '../../../hooks/useAuth';
import toast  from 'react-hot-toast'




const initialValue = {
  name:"",
  email:"",
  password:"",
  cPassword:""
}

const Signup = ({setShowLogin,setShowSignup}) => {
    const [show,setShow]=useState(true)
    const {mutate :signup, isPending,isError,error} =useSignup()

  const handleSubmit=(value)=>{
    signup(value, {
      onSuccess: (data) => {
        console.log(data);
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowSignup(false)
        setShowLogin(true)
      },
      onError: (err) => {
        console.log(err.response?.data?.message);
        toast.error(err.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    })

  }
  // console.log(isSuccess);
  

  const handleLogLink = () =>{
    setShowLogin(true)
    setShowSignup(false)
  } 
 const  handleClose = ()=>{
  setShowSignup(false)
  setShowLogin(false)
  setShow(false)
 }

  return (
    <>
   {show &&  <div className="h-screen w-screen bg-gray-800 fixed bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50" onClick={handleClose}>
    <div className='absolute top-0 right-0 text-2xl bg-[#6c28d2aa] text-white hover:text-[#6d28d2] hover:bg-white cursor-pointer ' onClick={handleClose}><IoClose/></div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/2 h flex flex-col items-center " onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between w-full mb-6">
          <a href="/" className="text-xl font-bold text-[#181818]">
            Ski<span className="text-[#6d28d2] font-bold">⇅</span>Bridge
          </a>
          <p className="font-code text-xs text-gray-800 hidden lg:block">
            Ready to Skillbridge? <a className="text-sky-500 cursor-pointer" onClick={handleLogLink}>Log in now.</a>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center w-full">
          <div className="hidden lg:flex justify-center items-center w-1/2">
            <img
              src="signup.png"
              alt="signup"
              className="object-cover w-[80%] rounded-lg"
            />
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center ">
            <h1 className="text-md font-semibold text-[#181818] mb-4 text-center">
              Join Skillbridge Today
            </h1>

            {/* Form */}
            <Formik
              initialValues={initialValue}
              validationSchema={signupValidation}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="w-full flex flex-col items-center">
                  <div className=" w-4/5 ">
                    <Field
                      type="text"
                      placeholder="Your full name"
                      name="name"
                      className="w-full p-2 bg-[#6c28d239] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#6d28d2] placeholder-gray-500"
                    />
                      <small className="text-red-600 min-h-[20px] text-xs block"> {errors.name && touched.name ? errors.name : ""}</small>
                  </div>
                    
          

                  <div className=" w-4/5">
                    <Field
                      type="email"
                      placeholder="Your email"
                      name="email"
                      className="w-full p-2 bg-[#6c28d239] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#6d28d2] placeholder-gray-500"
                    />
                    <small className="text-red-600 min-h-[20px] text-xs block"> {errors.email && touched.email ? errors.email : ""}</small>
                  </div>

                  <div className=" w-4/5">
                    <Field
                      type="password"
                      placeholder="Password"
                      name="password"
                      className="w-full p-2 bg-[#6c28d239] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#6d28d2] placeholder-gray-500"
                    />
                      <small className="text-red-600 min-h-[20px] text-xs block">{ errors.password && touched.password ? errors.password: ""}</small>
                  </div>
                    

                  <div className=" w-4/5">
                    <Field
                      type="password"
                      placeholder="Repeat password"
                      name="cPassword"
                      className="w-full p-2 bg-[#6c28d239] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#6d28d2] placeholder-gray-500"
                    />
                      <small className="text-red-600 min-h-[22px] text-xs block">{errors.cPassword && touched.cPassword  ? errors.cPassword:""}</small>
                  </div>
                                 
                  <div className=" w-4/5">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#6d28d2] text-white text-sm rounded-sm hover:bg-[#892de1] " >
                      {" "}  Signup
                    </button>
                  </div>

                  {/* <div className="flex items-center justify-center mt-4 w-4/5">
                    <img src="google.webp" alt="google"
                      className="w-5 h-5 mr-2"
                    />
                    <a className="text-xs text-blue-500">Sign-up with Google</a>
                  </div> */}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>}
    </>
  );
};

export default Signup;
