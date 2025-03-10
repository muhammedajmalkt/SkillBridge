import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react'
import { loginValidation } from './Validation';
import { IoClose } from "react-icons/io5";
import { useLogin } from '../../../hooks/useAuth';
import { loginSuccess } from '../../../Redux/Feature/authSlice';
import toast  from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';



const initialValue={
    email:"",
    password:""
}

const Login = ({setShowSignup,setShowLogin}) => {
  const [show,setShow]=useState(true)
  const { mutate :login  } = useLogin()
  const dispatch= useDispatch()
  const navigate = useNavigate()

  //  const  handleSubmit = (value) =>{
  //    login(value)
  //  }
  const handleSubmit = (value) => {
    login(value, {
      onSuccess: (data) => {
     dispatch(loginSuccess(data))
      console.log(data);
          toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
        setShowLogin(false)
        setShowSignup(false)
        navigate("/")
      },
      onError: (err) => {
        console.log(err.response?.data);
        toast.error(err.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      }
    })
  }

    const  handleSignLink = ()=>{
      setShowLogin(false)
      setShowSignup(true)
    }
    const  handleClose = ()=>{
      setShowSignup(false)
      setShowLogin(false)
      setShow(false)
     }
  
  return (
    <>
      {show && <div className="h-screen w-screen fixed bg-gray-800 bg-opacity-20 backdrop-blur-sm flex justify-center items-center z-50" onClick={handleClose}>
      <div className='absolute top-0 right-0 text-2xl bg-[#6c28d2aa] text-white hover:text-[#6d28d2] hover:bg-white  cursor-pointer ' onClick={handleClose}><IoClose/></div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 sm:w-3/5 md:w-1/2 lg:w-1/2 lg:h-[43%] mb  " onClick={(e)=>e.stopPropagation()}>
        <div className="flex justify-between mb-6">
          <a href="/" className="text-xl font-bold text-[#181818]">
            Ski<span className="text-[#6d28d2] font-bold">⇅</span>Bridge
          </a>
          <p className="font-code text-xs text-gray-800">
          New to Skillbridge? <a className="text-sky-500 cursor-pointer" onClick={handleSignLink}>Sign up now.</a>
          </p>
        </div>

        <div className="flex justify-between items-center mt-[70px]">
          <div className="w-full px-4 lg:px-8">
            <h1 className="text-md font-semibold text-[#181818] mb-4">
            Login Now
            </h1>

            {/* Form */}
            <Formik 
                    initialValues={initialValue}
                    validationSchema={loginValidation}
                    onSubmit={handleSubmit}
            >
           {({errors,touched})=>(
            <Form>
              <div >
                <Field
                  type="email"
                  placeholder="Your email"
                  name ="email"
                  className="w-[70%] p-2 bg-[#6c28d239] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#6d28d2] placeholder-gray-500"
                  />
                  <small className="text-red-600 min-h-[20px] text-xs block">{errors.email && touched.email ? errors.email:""}</small>
              </div>

              <div >
                <Field
                  type="password"
                  placeholder="Password"
                  name = "password"
                  className="w-[70%] p-2 bg-[#6c28d239] text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-[#6d28d2] placeholder-gray-500"
                  />
                 <small className="text-red-600 min-h-[22px] text-xs block">{errors.password && touched.password ? errors.password: ""}</small>
              </div>

              <div >
                <button
                  type="submit"
                  className="w-[70%] py-2 bg-[#6d28d2] text-white text-sm rounded-sm hover:bg-[#892de1] transition"
                  > Log in
                </button>
              </div>

              {/* <div className=" w-[75%] flex items-center justify-center mt-4">
                <img src="google.webp" alt="google" className="w-5 h-5 mr-2" />
                <a className="text-xs text-blue-500">Sign-up with Google</a>
              </div> */}
            </Form>
       )}
          </Formik>
          </div>
          <div className="hidden lg:block w-1/2">
            <img
              src="login.png"
              alt="signup"
              className="object-cover h-full w-full rounded-l-lg"
            />
          </div>
            
        </div>
      </div>
    </div>}
    </>
  )
}

export default Login