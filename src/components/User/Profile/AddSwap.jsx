import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { swapValidation } from './SwapValidation'
import { useMutation } from '@tanstack/react-query'
import { useCreateSwap } from '../../../hooks/useSwap'
import { useSelector } from 'react-redux'
import toast  from 'react-hot-toast'
import { FaSpinner } from 'react-icons/fa'



const initialValue ={
    offeredTitle:"",
    offeredCategory:"",
    offeredExpireince:"",
    offeredDetails:"",
    offeredImage:"",
    neededTitle:"",
    neededCategory:"",
    neededPriority:"",
    neededDetails:"",
     neededImage:"",
     hours:"1"
    }


const AddSwap = () => {
    const [question,setQuestion]=useState(false)
    const [store,setStore] =useState(null)
    const { mutate:createSwap ,isPending} = useCreateSwap()

    
    const handleSubmit = (values,{resetForm}) => {
        // console.log(values);
        const formData = new FormData()
         formData.append("offeredTitle",values.offeredTitle)
         formData.append("offeredCategory",values.offeredCategory)
         formData.append("offeredExpireince",values.offeredExpireince)
         formData.append("offeredDetails",values.offeredDetails)
         formData.append("offeredImage",values.offeredImage)
         formData.append("neededTitle",values.neededTitle)
         formData.append("neededCategory",values.neededCategory)
         formData.append("neededPriority",values.neededPriority)
         formData.append("neededDetails",values.neededDetails)
         formData.append("neededImage",values.neededImage)
         formData.append("hours",values.hours)
    
       createSwap(formData, {
          onSuccess: (data) => {  
            console.log(data);
            
               toast.success(data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                  });          
            resetForm(); 
        },
          onError: (err) => {
            console.log("API Error:", err);
              toast.error(err.response?.data?.message || "An error occurred", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
              });
            
          },
        });
      
    };
  return (
      <>
      {!question ?(
      <div className='border border-gray-600'>
            <div className='border-b  border-gray-600  h-[92px] py-4 text-center'>
             <h1 className='text-20px font-semibold' >Exchange skills with others  </h1>
             <h3 className='text-sm'>Add information about your Skill</h3>
            </div>
             
            <Formik
    initialValues={initialValue}
    validationSchema={swapValidation}
    onSubmit={handleSubmit}
   >
  {({ setFieldValue}) => (
    <Form>
      <div className="flex flex-col justify-center p-10 mx-32 gap-1 text-sm text-gray-600">
        {/* Skill Offered */}
        <h1 className="font-semibold mt-6 text-gray-700">Skill Offered</h1>

        <Field
          className="border border-gray-600 px-4 h-9 rounded-md"
          type="text"
          name="offeredTitle"
          placeholder="Title"
        />
        <label className={`text-xs  "mb-5"`}>
          Add a Title like, "Photoshop Skills For: Illustrator, After Effects, or Learn UI/UX Design."
        </label>
        {/* {errors.offeredTitle && touched.offeredTitle && (
          <small className="text-red-600 min-h-[5px] mb-5 text-xs block">
            {errors.offeredTitle}
          </small>
        )} */}
           <ErrorMessage
          name="offeredTitle"
          component="small"
          className="text-red-600 mb-5 min-h-[5px] text-xs block"
        />
        <Field
          as="select"
          className="border border-gray-600 px-4 h-9 text-center rounded-md"
          name="offeredCategory"
        >
          <option value="">SELECT CATEGORY</option>
          {[
            "art/creativity",
            "cooking",
            "computer/it",
            "outdoor/sports",
            "languages",
            "consulting",
            "beauty/health",
            "care/sitting",
            "do it yourself",
            "education",
            "music",
            "others",
          ].map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </Field>
        <ErrorMessage
          name="offeredCategory"
          component="small"
          className="text-red-600 mb-5 min-h-[5px] text-xs block"
        />

        <div>
          <label>Experience:</label>
          {["Beginner", "Intermediate", "Expert"].map((level, index) => (
            <span key={index} className="ml-2">
              <Field className="text-center mr-1" type="radio" name="offeredExpireince" value={level} />
              <label>{level}</label>
            </span>
          ))}
        </div>
        <ErrorMessage
          name="offeredExpireince"
          component="small"
          className="text-red-600 mb-6 min-h-[5px] text-xs block"
        />

        <Field
          as="textarea"
          name="offeredDetails"
          className="border border-gray-600 px-4 h-14 pt-2 rounded-md"
          placeholder="Detailed information"
        />
        <ErrorMessage
          name="offeredDetails"
          component="small"
          className="text-red-600 mb-5 min-h-[5px] text-xs block"
        />

        <input
          onChange={(e) =>setFieldValue("offeredImage",e.target.files[0])}
        name="offeredImage" className="border border-gray-600 px-4 py-2 rounded-md" type="file" />
        <ErrorMessage
          name="offeredImage"
          component="small"
          className="text-red-600 min-h-[5px] text-xs block"
        />

        <label className="text-xs mb-3">Choose an image for your skill</label>

        <hr />

        {/* Skill Needed */}
        <h1 className="font-semibold mt-6 text-gray-700">Skill Needed</h1>

        <Field
          name="neededTitle"
          className="border border-gray-600 px-4 h-9 rounded-md"
          type="text"
          placeholder="Title"
        />
        <ErrorMessage
          name="neededTitle"
          component="small"
          className="text-red-600 mb-5 min-h-[5px] text-xs block"
        />

        <label className="text-xs mb-5">
          Add a Title like, "Photoshop Skills For: Illustrator, After Effects, or Learn UI/UX Design."
        </label>

        <Field
          as="select"
          name="neededCategory"
          className="border border-gray-600 px-4 h-9 text-center rounded-md"
        >
          <option value="">SELECT CATEGORY</option>
          {[
            "art/creativity",
            "cooking",
            "computer/it",
            "outdoor/sports",
            "languages",
            "consulting",
            "beauty/health",
            "care/sitting",
            "do it yourself",
            "education",
            "music",
            "others",
          ].map((category) => (
            <option key={category} value={category}>
              {category.toUpperCase()}
            </option>
          ))}
        </Field>
        <ErrorMessage name="neededCategory"component="small"className="text-red-600 mb-5 min-h-[5px] text-xs block"/>

        <div>
          <label>Priority:</label>
          {["Low", "Medium", "High"].map((level, index) => (
            <span key={index} className="ml-2">
              <Field className="text-center mr-1" type="radio" name="neededPriority" value={level} />
              <label>{level}</label>
            </span>
          ))}
        </div>
        <ErrorMessage
          name="neededPriority"
          component="small"
          className="text-red-600 mb-6 min-h-[5px] text-xs block"
        />

        <Field
          as="textarea"
          name="neededDetails"
          className="border border-gray-600 px-4 h-14 pt-2 rounded-md"
          placeholder="Detailed information"
        />
        <ErrorMessage
          name="neededDetails"
          component="small"
          className="text-red-600 mb-5 min-h-[5px] text-xs block"
        />

        <input
          onChange={(e) => setFieldValue("neededImage" ,e.target.files[0])}
         name="neededImage" className="border border-gray-600 px-4 py-2 rounded-md" type="file" />
        <ErrorMessage
          name="neededImage"
          component="small"
          className="text-red-600 min-h-[5px] text-xs block"
        />
        <label className="text-xs mb-3">Choose an image for your skill</label>
        <hr />

        <Field
          name="hours"
          className="border border-gray-600 px-4 py-2 mt-8 rounded-md"
          type="number"
          placeholder="Hours"
        />
        <ErrorMessage
          name="hours"
          component="small"
          className="text-red-600 min-h-[5px] text-xs block"
        />
        <label className="text-xs mb-3">Set duration of swap in hours</label>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#6d28d2] text-white font-md px-5 py-1 text-lg rounded-md"
          >
            {isPending ? <span className='flex items-center'> Loading<FaSpinner className="animate-spin mr-2" /></span>: "Submit"}
          </button>
        </div>
      </div>
    </Form>
  )}
</Formik>

    </div>):(

        // {question}
                  <div className='border border-gray-600 h-screen  '>
                      <div className='border-b  border-gray-600  h-[92px] py-4 text-center'>
                          <h1 className='text-20px font-semibold' > Create Questions & Answers for Your Offered Skill</h1>
                          <h3 className='text-sm'>Customize  Skill Assessment</h3>
                      </div>
                
                        <div className='flex flex-col justify-center p-10 mx-32 gap-1 text-sm text-gray-600 '>
                        <ul className='text-xs text-gray-500 list-disc'>
                            <h6 className='font-semibold text-md mb-4'>Instructions for Creating Questions & Answers:</h6>
                            <li>Ensure that the quiz contains exactly 10 questions.</li>
                            <li>Each question must have three answer options, with one marked as the correct answer.</li>
                            <li>Ensure a mix of difficulty levels, from easy to expert, to challenge learners progressively</li>
                            <li>Assign points to each question based on difficulty ( eg:  Easy: 1 point,Inter: 2 points ,Expert: 3 points)</li>
                        </ul>
                      </div>
                  </div>


    )}
    </>
  )
}

export default AddSwap