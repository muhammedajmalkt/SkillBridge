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
<div className=" rounded-lg shadow-md bg-white mb-10">
  {/* Header Section */}
  <div className="border-b border-gray-300 py-2 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg h-14">
    <h1 className="font-medium text-white">Public Profile</h1>
    <h3 className="text-xs text-gray-200">Edit Information </h3>
  </div>

  {/* Form Section */}
  <Formik
    initialValues={{
      name: user?.name || "",
      bio: user?.bio || "",
      link: user?.link || "",
      image: user?.image || "",
    }}
    validationSchema={profileEditValidation}
    onSubmit={handleSave}
  >
    {({ setFieldValue }) => (
      <Form>
        <div className="flex flex-col p-8 mx-auto max-w-2xl gap-4 text-sm text-gray-600">
          {/* Name Field */}
          <div>
            <h1 className="font-semibold text-gray-700 mb-2">Basics</h1>
            <Field
              name="name"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              placeholder="Name"
            />
            <ErrorMessage
              name="name"
              component="small"
              className="text-red-500 text-xs mt-1 block"
            />
          </div>

          {/* Bio Field */}
          <div>
            <Field
              name="bio"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              placeholder="Headline"
            />
            <label className="text-xs text-gray-500 mt-1 block">
              Add a professional headline like, "Instructor at ABC" or "Web Developer."
            </label>
            <ErrorMessage
              name="bio"
              component="small"
              className="text-red-500 text-xs mt-1 block"
            />
          </div>

          {/* Link Field */}
          <div>
            <Field
              name="link"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="url"
              placeholder="Link"
            />
            <label className="text-xs text-gray-500 mt-1 block">
              Add your social links like GitHub, LinkedIn, etc.
            </label>
            <ErrorMessage
              name="link"
              component="small"
              className="text-red-500 text-xs mt-1 block"
            />
          </div>

          {/* Image Upload */}
          <div>
            <input
              name="image"
              type="file"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFieldValue("image", e.target.files[0])}
            />
            <label className="text-xs text-gray-500 mt-1 block">
              Choose an image for your profile.
            </label>
            <ErrorMessage
              name="image"
              component="small"
              className="text-red-500 text-xs mt-1 block"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isPending ? (
                <span className="flex items-center">
                  Loading <FaSpinner className="animate-spin ml-2" />
                </span>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </Form>
    )}
  </Formik>
</div>
)
}

export default EditProfile