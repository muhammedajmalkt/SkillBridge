import React from 'react'
import { useEditProfile } from '../../../hooks/useAuth'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup  from "yup"
import { useDispatch, useSelector } from 'react-redux'
import { data } from 'react-router-dom'
import toast  from 'react-hot-toast'
import { loginSuccess } from '../../../Redux/Feature/authSlice'
import { FaSpinner } from 'react-icons/fa'



const profileEditValidation =Yup.object({
  name:Yup.string().min(3).required(),
  bio:Yup.string(),
  link:Yup.string().url(),
  image:Yup.mixed()
})
  
const EditProfile = () => {
  const {user}=useSelector((state)=>state.auth)
  const {mutate:editProfile,isPending}=useEditProfile()
  const dispatch = useDispatch()

  
  const handleSave =(values)=>{
    // console.log(values);
  const formData = new FormData()
   formData.append("name",values.name)
   formData.append("bio",values.bio)
   formData.append("link",values.link)
   formData.append("image",values.image)

  editProfile(formData,{        
    onSuccess:(data)=>{
    dispatch(loginSuccess(data))
      console.log(data);
        toast.success(data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
    },
    onError :(err)=>{
           console.log(err.response);
           
          toast.error(err.response?.data?.message || "An error occurred", {
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
  
  return (
<div className='border border-gray-600  '>
            <div className='border-b  border-gray-600  h-[92px] py-4 text-center'>
            <h1 className='text-20px font-semibold' >Public profile </h1>
            <h3 className='text-sm'>Add information about yourself</h3>
            </div>

            <Formik   initialValues={{ 
              name:user?.name || "",
              bio:user?.bio || "",
              link:user?.link || "",
              image:user?.image || ""
              // image:null
            }} validationSchema={profileEditValidation} onSubmit={handleSave}>
        {({setFieldValue})=>(
            <Form>
            <div className='flex flex-col justify-center p-10 mx-32 gap-1 text-sm text-gray-600 '>
              <h1 className='font-semibold text-gray-700 '>Basics </h1>
              <Field name="name" className='border border-gray-600  px-4 h-9 mb-5  rounded-md'
              type='text'   initialValues={{name:user?.name || "" }} />
               <ErrorMessage name='name' component="small" className="text-red-600 mb-5 min-h-[5px] text-xs block"/>

           
                <Field name="bio"  className='border border-gray-600  px-4 h-9 rounded-md '
                type='text' placeholder='Headline'/>
                <label className='text-xs mb-5'>Add a professional headline like, "Instructor at ABC" or "Web Developer."</label>
                <ErrorMessage name='bio' component="small" className="text-red-600 mb-5 min-h-[5px] text-xs block"/>

                <Field name="link"  className='border border-gray-600  px-4 h-9 rounded-md '
                type='url' placeholder='Link'/>
                <label className='text-xs mb-5'>Add Your Social Links like, gitgub. </label>
                <ErrorMessage name='link' component="small" className="text-red-600 mb-5 min-h-[5px] text-xs block"/>


                <input name="image" className="border border-gray-600 px-4 py-2 rounded-md"
                      type='file'
                      onChange={(e)=>setFieldValue("image", e.target.files[0])}
                       />
                      <label className='text-xs mb-3'>Choose an image for  your Profile  </label>
                      <ErrorMessage name='image' component="small" className="text-red-600 mb-5 min-h-[5px] text-xs block"/>


                      <button type='submit' className='bg-[#6d28d2] text-white font-md px-5 py-1 text-lg w-fit ml-[500px] rounded-md'>
                        {isPending ?
                        <span className='flex items-center'> Loading<FaSpinner className="animate-spin mr-2" /></span> :"Save"} 
                        </button>
                 <hr/>        
            </div>
             </Form>
             )}
             </Formik>
        </div>
)
}

export default EditProfile