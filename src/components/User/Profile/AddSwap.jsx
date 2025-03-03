// import { ErrorMessage, Field, Form, Formik } from 'formik'
// import React, { useState } from 'react'
// import { swapValidation } from './SwapValidation'
// import { useMutation } from '@tanstack/react-query'
// import { useCreateSwap } from '../../../hooks/useSwap'
// import { useSelector } from 'react-redux'
// import toast  from 'react-hot-toast'
// import { FaSpinner } from 'react-icons/fa'
// import QuestionCollector from '../Favour/Favorite'



// const initialValue ={
//     offeredTitle:"",
//     offeredCategory:"",
//     offeredExpireince:"",
//     offeredDetails:"",
//     offeredImage:"",
//     neededTitle:"",
//     neededCategory:"",
//     neededPriority:"",
//     neededDetails:"",
//      neededImage:"",
//      hours:"1"
//     }


// const AddSwap = () => {
//     const [next,setNext]=useState("offered")
//     const [store,setStore] =useState(null)
//     const { mutate:createSwap ,isPending} = useCreateSwap()

    
//     const handleSubmit = (values,{resetForm}) => {
//         console.log(values);
//         const formData = new FormData()
//          formData.append("offeredTitle",values.offeredTitle)
//          formData.append("offeredCategory",values.offeredCategory)
//          formData.append("offeredExpireince",values.offeredExpireince)
//          formData.append("offeredDetails",values.offeredDetails)
//          formData.append("offeredImage",values.offeredImage)
//          formData.append("neededTitle",values.neededTitle)
//          formData.append("neededCategory",values.neededCategory)
//          formData.append("neededPriority",values.neededPriority)
//          formData.append("neededDetails",values.neededDetails)
//          formData.append("neededImage",values.neededImage)
//          formData.append("hours",values.hours)
    
//        createSwap(formData, {
//           onSuccess: (data) => {  
//             console.log(data);
//                toast.success(data?.message, {
//                     position: "top-right",
//                     autoClose: 3000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: false,
//                     draggable: true,
//                   });          
//             resetForm(); 
//         },
//           onError: (err) => {
//             console.log("API Error:", err);
//               toast.error(err.response?.data?.message || "An error occurred", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: false,
//                 draggable: true,
//               });
            
//           },
//         });
      
//     };
//  return(
//   <div className="border border-gray-600">
//   <div className="border-b border-gray-600 h-[92px] py-4 text-center">
//     <h1 className="text-20px font-semibold">Exchange skills with others</h1>
//     <h3 className="text-sm">Add information about your Skill</h3>
//   </div>
//   <Formik initialValues={initialValue} validationSchema={swapValidation} onSubmit={handleSubmit}>
//     {({ setFieldValue, isValid ,validateForm}) => (
//       <Form className="p-10 mx-32 text-sm text-gray-600">
//         {next === "offered" && 
//           <div className='flex flex-col'>
//             <h1 className="font-semibold mt-6 text-gray-700">Skill Offered</h1>
//             <Field className="border border-gray-600 px-4 h-9 rounded-md" type="text" name="offeredTitle" placeholder="Title" />
//             <ErrorMessage name="offeredTitle" component="small" className="text-red-600 text-xs block" />
//             <Field as="select" className="border border-gray-600 px-4 h-9 text-center rounded-md" name="offeredCategory">
//               <option value="">SELECT CATEGORY</option>
//               {["art/creativity", "cooking", "computer/it", "outdoor/sports", "languages", "consulting", "beauty/health", "education", "music", "others"].map((category) => (
//                 <option key={category} value={category}>
//                   {category.toUpperCase()}
//                 </option>
//               ))}
//             </Field>
//             <ErrorMessage name="offeredCategory" component="small" className="text-red-600 text-xs block" />
//             <label className="text-xs">Choose your experience level:</label>
//             {["Beginner", "Intermediate", "Expert"].map((level, index) => (
//               <label key={index} className="ml-2">
//                 <Field className="mr-1" type="radio" name="offeredExpireince" value={level} /> {level}
//               </label>
//             ))}
//             <ErrorMessage name="offeredExpireince" component="small" className="text-red-600 text-xs block" />
//             <Field as="textarea" name="offeredDetails" className="border border-gray-600 px-4 h-14 pt-2 rounded-md" placeholder="Detailed information" />
//             <ErrorMessage name="offeredDetails" component="small" className="text-red-600 text-xs block" />
//             <input type="file" onChange={(e) => setFieldValue("offeredImage", e.target.files[0])} className="border border-gray-600 px-4 py-2 rounded-md" />
//             <ErrorMessage name="offeredImage" component="small" className="text-red-600 text-xs block" />
//             <div className="flex justify-end">
//             <button 
//   type="button" 
//   onClick={async () => {
//     const errors = await validateForm(); // Run Formik validation manually
//     if (Object.keys(errors).length > 0) {
//       toast.error("Please fill in all required fields before proceeding!", {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: true,
//       });
//       return;
//     }
//     setNext("needed"); // Move forward if no errors
//   }}  
//   className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4"
// >
//   Next1
// </button>

//             </div>
//           </div>
//         }
//         {next === "needed" && (
//           <div className='flex flex-col'>
//             <h1 className="font-semibold mt-6 text-gray-700">Skill Needed</h1>
//             <Field className="border border-gray-600 px-4 h-9 rounded-md" type="text" name="neededTitle" placeholder="Title" />
//             <ErrorMessage name="neededTitle" component="small" className="text-red-600 text-xs block" />
//             <Field as="select" className="border border-gray-600 px-4 h-9 text-center rounded-md" name="neededCategory">
//               <option value="">SELECT CATEGORY</option>
//               {["art/creativity", "cooking", "computer/it", "outdoor/sports", "languages", "consulting", "beauty/health", "education", "music", "others"].map((category) => (
//                 <option key={category} value={category}>
//                   {category.toUpperCase()}
//                 </option>
//               ))}
//             </Field>
//             <ErrorMessage name="neededCategory" component="small" className="text-red-600 text-xs block" />
//             <Field as="textarea" name="neededDetails" className="border border-gray-600 px-4 h-14 pt-2 rounded-md" placeholder="Detailed information" />
//             <ErrorMessage name="neededDetails" component="small" className="text-red-600 text-xs block" />
//             <Field className="border border-gray-600 px-4 py-2 rounded-md" type="number" name="hours" placeholder="Hours" />
//             <ErrorMessage name="hours" component="small" className="text-red-600 text-xs block" />
//             <div className="flex  justify-between">
//             <button type="button" onClick={() => setNext("offered")} className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4">
//               Back
//             </button>
//             <button type="submit" className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4">
//               {isPending ? <span className='flex items-center'> Loading <FaSpinner className="animate-spin ml-2" /></span> : "Submit"}
//             </button>
//             </div>
           
//           </div>
//         )}
//       </Form>
//     )}
//   </Formik>
//   {/* {next === "qstn" && <QuestionCollector />} */}
// </div>

//  )
// }

// export default AddSwap
    {/* <button
                    type="button"className={`px-5 py-1 text-lg rounded-md ${isValid ? "bg-[#6d28d2] text-white"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                    onClick={() => isValid  && setQuestion(true)}
                    disabled={!isValid}
                  >
                    Next
                  </button> */}

                    {/* {question} */}
                  {/* // <div className='border border-gray-600 h-screen  '>
                  //     <div className='border-b  border-gray-600  h-[92px] py-4 text-center'>
                  //         <h1 className='text-20px font-semibold' > Create Questions & Answers for Your Offered Skill</h1>
                  //         <h3 className='text-sm'>Customize  Skill Assessment</h3>
                  //     </div>
                
                  //       <div className='flex flex-col justify-center p-10 mx-32 gap-1 text-sm text-gray-600 '>
                  //       <ul className='text-xs text-gray-500 list-disc'>
                  //           <h6 className='font-semibold text-md mb-4'>Instructions for Creating Questions & Answers:</h6>
                  //           <li>Ensure that the quiz contains exactly 10 questions.</li>
                  //           <li>Each question must have three answer options, with one marked as the correct answer.</li>
                  //           <li>Ensure a mix of difficulty levels, from easy to expert, to challenge learners progressively</li>
                  //           <li>Assign points to each question based on difficulty ( eg:  Easy: 1 point,Inter: 2 points ,Expert: 3 points)</li>
                  //       </ul>
                  //     </div>
                  // </div>
                  {next === "qstn" && <QuestionCollector/>} */}




                  import React from 'react';
                  import { useFormik } from 'formik';
                  import * as Yup from 'yup';
                  import { useMutation } from '@tanstack/react-query';
                  import { useCreateSwap } from '../../../hooks/useSwap';
                  import toast from 'react-hot-toast';
                  import { FaSpinner } from 'react-icons/fa';
                  import { swapValidation } from './SwapValidation'
import QuestionCollector from '../Favour/Favorite';

                  
                  const AddSwap = () => {
                    const { mutate: createSwap, isPending } = useCreateSwap()
                  
                    const formik = useFormik({
                      initialValues: {
                        offeredTitle: '',
                        offeredCategory: '',
                        offeredExpireince: '',
                        offeredDetails: '',
                        offeredImage: '',
                        neededTitle: '',
                        neededCategory: '',
                        neededPriority: '',
                        neededDetails: '',
                        neededImage: '',
                        hours: '1',
                        currentQuestion: "",
                        answers: ["", "", ""],
                        correctAnswer: "",
                        difficulty: "Easy",
                        questions: [],
                  
                      },swapValidation,
                    
                      onSubmit: (values) => {
                        const submissionData = new FormData();
                        Object.keys(values).forEach((key) => {
                          submissionData.append(key, values[key]);
                        });
                  
                        createSwap(submissionData, {
                          onSuccess: (data) => {
                            toast.success(data?.message, {
                              position: 'top-right',
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: false,
                              draggable: true,
                            });
                            formik.resetForm();
                          },
                          onError: (err) => {
                            toast.error(err.response?.data?.message || 'An error occurred', {
                              position: 'top-right',
                              autoClose: 3000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: false,
                              draggable: true,
                            });
                          },
                        });
                      },
                    });
                  
                    const [next, setNext] = React.useState('offered');
                  
                    const isOfferedValid = () => {
                      return (
                        formik.values.offeredTitle &&
                        formik.values.offeredCategory &&
                        formik.values.offeredExpireince &&
                        formik.values.offeredDetails
                      );
                    };
                  
                    const isNeededValid = () => {
                      return (
                        formik.values.neededTitle &&
                        formik.values.neededCategory &&
                        formik.values.neededDetails &&
                        formik.values.hours
                      );
                    };
                  
                    return (
                      <div className="border border-gray-600">
                        <div className="border-b border-gray-600 h-[92px] py-4 text-center">
                          <h1 className="text-20px font-semibold">
                            Exchange skills with others
                          </h1>
                          <h3 className="text-sm">
                            Add information about your Skill
                          </h3>
                        </div>
                        <form
                          onSubmit={formik.handleSubmit}
                          className="p-10 mx-32 text-sm text-gray-600"
                        >
                          {next === "offered" && (
                            <div className="flex flex-col">
                              <h1 className="font-semibold mt-6 text-gray-700">
                                Skill Offered
                              </h1>
                              <input
                                className="border border-gray-600 px-4 h-9 rounded-md"
                                type="text"
                                name="offeredTitle"
                                placeholder="Title"
                                value={formik.values.offeredTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.offeredTitle &&
                              formik.errors.offeredTitle ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.offeredTitle}
                                </div>
                              ) : null}
                              <select
                                className="border border-gray-600 px-4 h-9 text-center rounded-md"
                                name="offeredCategory"
                                value={formik.values.offeredCategory}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                  "education",
                                  "music",
                                  "others",
                                ].map((category) => (
                                  <option key={category} value={category}>
                                    {category.toUpperCase()}
                                  </option>
                                ))}
                              </select>
                              {formik.touched.offeredCategory &&
                              formik.errors.offeredCategory ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.offeredCategory}
                                </div>
                              ) : null}
                              <label className="text-xs">
                                Choose your experience level:
                              </label>
                              {["Beginner", "Intermediate", "Expert"].map(
                                (level, index) => (
                                  <label key={index} className="ml-2">
                                    <input
                                      className="mr-1"
                                      type="radio"
                                      name="offeredExpireince"
                                      value={level}
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                    />{" "}
                                    {level}
                                  </label>
                                )
                              )}
                              {formik.touched.offeredExpireince &&
                              formik.errors.offeredExpireince ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.offeredExpireince}
                                </div>
                              ) : null}
                              <textarea
                                name="offeredDetails"
                                className="border border-gray-600 px-4 h-14 pt-2 rounded-md"
                                placeholder="Detailed information"
                                value={formik.values.offeredDetails}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.offeredDetails &&
                                formik.errors.offeredDetails && (
                                  <div className="text-red-500 text-xs">
                                    {formik.errors.offeredDetails}
                                  </div>
                                )}

                              <input
                                type="file"
                                name="offeredImage"
                                onChange={(event) => {
                                  formik.setFieldValue(
                                    "offeredImage",
                                    event.currentTarget.files[0]
                                  );
                                }}
                                onBlur={formik.handleBlur}
                                className="border border-gray-600 px-4 py-2 rounded-md"
                              />
                              {formik.touched.offeredImage &&
                              formik.errors.offeredImage ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.offeredImage}
                                </div>
                              ) : null}
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  disabled={!isOfferedValid()}
                                  onClick={() => setNext("needed")}
                                  className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}

                          {/* {needed} */}
                          {next === "needed" && (
                            <div className="flex flex-col">
                              <h1 className="font-semibold mt-6 text-gray-700">
                                Skill Needed
                              </h1>
                              <input
                                className="border border-gray-600 px-4 h-9 rounded-md"
                                type="text"
                                name="neededTitle"
                                placeholder="Title"
                                value={formik.values.neededTitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.neededTitle &&
                              formik.errors.neededTitle ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.neededTitle}
                                </div>
                              ) : null}
                              <select
                                className="border border-gray-600 px-4 h-9 text-center rounded-md"
                                name="neededCategory"
                                value={formik.values.neededCategory}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                  "education",
                                  "music",
                                  "others",
                                ].map((category) => (
                                  <option key={category} value={category}>
                                    {category.toUpperCase()}
                                  </option>
                                ))}
                              </select>
                              {formik.touched.neededCategory &&
                              formik.errors.neededCategory ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.neededCategory}
                                </div>
                              ) : null}
                              <textarea
                                name="neededDetails"
                                className="border border-gray-600 px-4 h-14 pt-2 rounded-md"
                                placeholder="Detailed information"
                                value={formik.values.neededDetails}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <div>
                                <label>Priority:</label>
                                {["Low", "Medium", "High"].map(
                                  (level, index) => (
                                    <span key={index} className="ml-2">
                                      <input
                                        className="text-center mr-1"
                                        type="radio"
                                        name="neededPriority"
                                        value={level}
                                        checked={
                                          formik.values.neededPriority === level
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                      />
                                      <label>{level}</label>
                                    </span>
                                  )
                                )}
                              </div>
                              {formik.touched.neededPriority &&
                              formik.errors.neededPriority ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.neededPriority}
                                </div>
                              ) : null}

                              {formik.touched.neededDetails &&
                              formik.errors.neededDetails ? (
                                <div className="text-red-500 text-xs">
                                  {formik.errors.neededDetails}
                                </div>
                              ) : null}
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  // disabled={!isOfferedValid()}
                                  onClick={() => setNext("offered")}
                                  className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4"
                                >
                                  Back
                                </button>
                                {/* <button
                                  type="submit"
                                  className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4"
                                >
                                  {isPending ? (
                                    <span className="flex items-center">
                                      {" "}
                                      Loading{" "}
                                      <FaSpinner className="animate-spin ml-2" />
                                    </span>
                                  ) : (
                                    "Submit"
                                  )}
                                </button> */}
                                <button
                                  type="button"
                                  // disabled={!isOfferedValid()}
                                  onClick={() => setNext("qstn")}
                                  className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4"
                                >
                                next
                                </button>
                              </div>
                            </div>
                          )}
                          {next === "qstn" && <QuestionCollector formik={formik} />}
                        </form>
                      </div>
                    );
                  };
                  
                  export default AddSwap;
                  