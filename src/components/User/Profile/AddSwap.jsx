import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useCreateSwap } from '../../../hooks/useSwap';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { swapValidation } from './SwapValidation';

const AddSwap = () => {
  const { mutate: createSwap, isPending } = useCreateSwap();
  const [next, setNext] = useState('offered');


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
      currentQuestion: '',
      answers: ['', '', ''],
      correctAnswer: '',
      difficulty: 'Easy',
      points: null,
      questions: [],
    },
    validationSchema: swapValidation,
    onSubmit: (values,) => {
      console.log(values,"values");
      
    
      const submissionData = new FormData();
       Object.keys(values).forEach((key) => {
        if (key === "questions") {
            submissionData.append(key, JSON.stringify(values[key])); // Convert questions array to JSON string
        } else {
            submissionData.append(key, values[key]);
        }
    });

      createSwap(submissionData, {
        onSuccess: (data) => {
          console.log(data,"succes");
          
          toast.success(data?.message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
          });
          // formik.resetForm();
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


  const isOfferedValid = () => {
    return (
      formik.values.offeredTitle &&
      formik.values.offeredCategory &&
      formik.values.offeredExpireince &&
      formik.values.offeredDetails.length >= 20
    );
  };

  const isNeededValid = () => {
    return (
      formik.values.neededTitle &&
      formik.values.neededCategory &&
      formik.values.neededDetails.length >= 20 &&
      formik.values.hours
    );
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      currentQuestion: formik.values.currentQuestion,
      answers: formik.values.answers,
      correct_answer: formik.values.correctAnswer,
      difficulty: formik.values.difficulty,
      points: formik.values.difficulty === 'Easy' ? 1 : formik.values.difficulty === 'Inter' ? 2 : 3,
    };

    formik.setFieldValue('questions', [...formik.values.questions, newQuestion]);
    formik.setFieldValue('currentQuestion', '');
    formik.setFieldValue('answers', ['', '', '']);
    formik.setFieldValue('correctAnswer', '');
  };

  const handleSave = () => {
    const newQuestion = {
      currentQuestion: formik.values.currentQuestion,
      answers: formik.values.answers,
      correct_answer: formik.values.correctAnswer,
      difficulty: formik.values.difficulty,
      points: formik.values.difficulty === 'Easy' ? 1 : formik.values.difficulty === 'Inter' ? 2 : 3,
    };
    formik.setFieldValue('questions', [...formik.values.questions, newQuestion]);
    formik.setFieldValue('currentQuestion', '');
    formik.setFieldValue('answers', ['', '', '']);
    formik.setFieldValue('correctAnswer', '');
    formik.handleSubmit();
  };

  return (
    <div className="border border-gray-600">
      <div className="border-b border-gray-600 h-[92px] py-4 text-center">
        <h1 className="text-20px font-semibold">Exchange skills with others</h1>
        <h3 className="text-sm">Add information about your Skill</h3>
      </div>
      <form onSubmit={formik.handleSubmit} className="p-10 mx-32 text-sm text-gray-600">
        {next === 'offered' && (
          <div className="flex flex-col">
            <h1 className="font-semibold mt-6 text-gray-700">Skill Offered</h1>
            <input
              className="border border-gray-600 px-4 h-9 rounded-md"
              type="text"
              name="offeredTitle"
              placeholder="Title"
              value={formik.values.offeredTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.offeredTitle && formik.errors.offeredTitle && (
              <div className="text-red-500 text-xs">{formik.errors.offeredTitle}</div>
            )}

            <select
              className="border border-gray-600 px-4 h-9 text-center rounded-md"
              name="offeredCategory"
              value={formik.values.offeredCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">SELECT CATEGORY</option>
              {[
                'art/creativity',
                'cooking',
                'computer/it',
                'outdoor/sports',
                'languages',
                'consulting',
                'beauty/health',
                'education',
                'music',
                'others',
              ].map((category) => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
            </select>
            {formik.touched.offeredCategory && formik.errors.offeredCategory && (
              <div className="text-red-500 text-xs">{formik.errors.offeredCategory}</div>
            )}

            <label className="text-xs">Choose your experience level:</label>
            {['Beginner', 'Intermediate', 'Expert'].map((level, index) => (
              <label key={index} className="ml-2">
                <input
                  className="mr-1"
                  type="radio"
                  name="offeredExpireince"
                  value={level}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />{' '}
                {level}
              </label>
            ))}
            {formik.touched.offeredExpireince && formik.errors.offeredExpireince && (
              <div className="text-red-500 text-xs">{formik.errors.offeredExpireince}</div>
            )}

            <textarea
              name="offeredDetails"
              className="border border-gray-600 px-4 h-14 pt-2 rounded-md"
              placeholder="Detailed information"
              value={formik.values.offeredDetails}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.offeredDetails && formik.errors.offeredDetails && (
              <div className="text-red-500 text-xs">{formik.errors.offeredDetails}</div>
            )}

            <input
              type="file"
              name="offeredImage"
              onChange={(event) => {
                formik.setFieldValue('offeredImage', event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
              className="border border-gray-600 px-4 py-2 rounded-md"
            />
            {formik.touched.offeredImage && formik.errors.offeredImage && (
              <div className="text-red-500 text-xs">{formik.errors.offeredImage}</div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!isOfferedValid()}
                onClick={() => setNext('needed')}
                className={`text-white px-5 py-1 text-lg rounded-md mt-4 ${
                  isOfferedValid() ? 'bg-[#6d28d2] cursor-pointer' : 'bg-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {next === 'needed' && (
          <div className="flex flex-col">
            <h1 className="font-semibold mt-6 text-gray-700">Skill Needed</h1>
            <input
              className="border border-gray-600 px-4 h-9 rounded-md"
              type="text"
              name="neededTitle"
              placeholder="Title"
              value={formik.values.neededTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.neededTitle && formik.errors.neededTitle && (
              <div className="text-red-500 text-xs">{formik.errors.neededTitle}</div>
            )}

            <select
              className="border border-gray-600 px-4 h-9 text-center rounded-md"
              name="neededCategory"
              value={formik.values.neededCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">SELECT CATEGORY</option>
              {[
                'art/creativity',
                'cooking',
                'computer/it',
                'outdoor/sports',
                'languages',
                'consulting',
                'beauty/health',
                'education',
                'music',
                'others',
              ].map((category) => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
            </select>
            {formik.touched.neededCategory && formik.errors.neededCategory && (
              <div className="text-red-500 text-xs">{formik.errors.neededCategory}</div>
            )}

            <textarea
              name="neededDetails"
              className="border border-gray-600 px-4 h-14 pt-2 rounded-md"
              placeholder="Detailed information"
              value={formik.values.neededDetails}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.neededDetails && formik.errors.neededDetails && (
              <div className="text-red-500 text-xs">{formik.errors.neededDetails}</div>
            )}

            <div>
              <label>Priority:</label>
              {['Low', 'Medium', 'High'].map((level, index) => (
                <span key={index} className="ml-2">
                  <input
                    className="text-center mr-1"
                    type="radio"
                    name="neededPriority"
                    value={level}
                    checked={formik.values.neededPriority === level}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label>{level}</label>
                </span>
              ))}
            </div>
            {formik.touched.neededPriority && formik.errors.neededPriority && (
              <div className="text-red-500 text-xs">{formik.errors.neededPriority}</div>
            )}

            <input
              type="file"
              name="neededImage"
              onChange={(event) => {
                formik.setFieldValue('neededImage', event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
              className="border border-gray-600 px-4 py-2 rounded-md"
            />
            {formik.touched.neededImage && formik.errors.neededImage && (
              <div className="text-red-500 text-xs">{formik.errors.neededImage}</div>
            )}

            <input
              className="border border-gray-600 px-4 py-2 rounded-md"
              type="number"
              name="hours"
              placeholder="Hours"
              value={formik.values.hours}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.hours && formik.errors.hours && (
              <div className="text-red-500 text-xs">{formik.errors.hours}</div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setNext('offered')}
                className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!isNeededValid()}
                onClick={() => setNext('qstn')}
                className={`text-white px-5 py-1 text-lg rounded-md mt-4 ${
                  isNeededValid() ? 'bg-[#6d28d2] cursor-pointer' : 'bg-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {next === 'qstn' && (
          
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">

                <div className='h-screen  '>
                      <div className='  text-center'>
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

            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Enter a Question</h2>
              <input
                type="text"
                name="currentQuestion"
                placeholder="Type your question here"
                value={formik.values.currentQuestion}
                onChange={formik.handleChange}
                className="w-full p-2 border rounded mb-4"
              />
              {formik.touched.currentQuestion && formik.errors.currentQuestion && (
                <small className="text-red-600">{formik.errors.currentQuestion}</small>
              )}

              <h3 className="text-sm font-semibold mb-2">Enter 3 Answers</h3>
              {formik.values.answers.map((answer, index) => (
                <input
                  key={index}
                  type="text"
                  name={`answers[${index}]`}
                  placeholder={`Answer ${index + 1}`}
                  value={answer}
                  onChange={formik.handleChange}
                  className="w-full p-2 border rounded mb-2"
                />
              ))}
              {formik.touched.answers && formik.errors.answers && (
                <small className="text-red-600">{formik.errors.answers}</small>
              )}

              <h3 className="text-sm font-semibold mb-2">Correct Answer</h3>
              <select
                name="correctAnswer"
                value={formik.values.correctAnswer}
                onChange={formik.handleChange}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select correct answer</option>
                {formik.values.answers.map((ans, index) => (
                  <option key={index} value={ans}>
                    {ans}
                  </option>
                ))}
              </select>
              {formik.touched.correctAnswer && formik.errors.correctAnswer && (
                <small className="text-red-600">{formik.errors.correctAnswer}</small>
              )}

              <h3 className="text-sm font-semibold mb-2">Difficulty Level</h3>
              <select
                name="difficulty"
                value={formik.values.difficulty}
                onChange={formik.handleChange}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="Easy">Easy (1 Point)</option>
                <option value="Inter">Inter (2 Points)</option>
                <option value="Expert">Expert (3 Points)</option>
              </select>
              <button
                type="button"
                onClick={() => setNext('needed')}
                className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4" >Back </button>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600"
              >
                Add Question
              </button>

              {formik.values.questions.length >= 2 && (
              <button type="submit" className="bg-[#6d28d2] text-white px-5 py-1 text-lg rounded-md mt-4" onClick={handleSave}>
             {isPending ? <span className='flex items-center'> Loading <FaSpinner className="animate-spin ml-2" /></span> : "Submit & Save Questions"}
               </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddSwap;