import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { useCreateSwap } from '../../../hooks/useSwap';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { swapValidation } from './SwapValidation';
import { useNavigate } from 'react-router-dom';

const AddSwap = () => {
  const { mutate: createSwap, isPending } = useCreateSwap();
  const [next, setNext] = useState('offered');
  const naviagte = useNavigate()


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
          formik.resetForm();
          // naviagte("/swapskill")
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
    <div className="rounded-lg shadow-md bg-white mb-10">
  {/* Header Section */}
  <div className="border-b border-gray-300  py-2 text-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg h-14">
    <h1 className=" font-medium text-white">Exchange Skills with Others</h1>
    <h3 className="text-xs text-gray-200">Add Information About Your Skill</h3>
  </div>

  <form onSubmit={formik.handleSubmit} className="p-8 mx-auto max-w-3xl">
    {/* Skill Offered  */}
    {next === 'offered' && (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-gray-700">Skill Offered</h1>

        <div>
          <input
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="text"
            name="offeredTitle"
            placeholder="Title"
            value={formik.values.offeredTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.offeredTitle && formik.errors.offeredTitle && (<div className="text-red-500 text-sm mt-1">{formik.errors.offeredTitle}</div>)}
        </div>

        <div>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          {formik.touched.offeredCategory && formik.errors.offeredCategory && (<div className="text-red-500 text-sm mt-1">{formik.errors.offeredCategory}</div>)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose your experience level:</label>
          <div className="flex space-x-4">
            {['Beginner', 'Intermediate', 'Expert'].map((level, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"  name="offeredExpireince" value={level}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
          {formik.touched.offeredExpireince && formik.errors.offeredExpireince && (<div className="text-red-500 text-sm mt-1">{formik.errors.offeredExpireince}</div>)}
        </div>

        {/* Details Textarea */}
        <div>
          <textarea
            name="offeredDetails"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Detailed information" value={formik.values.offeredDetails}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
       <label className="text-xs text-gray-500  block">Give detail information about skill.</label>
          {formik.touched.offeredDetails && formik.errors.offeredDetails && ( <div className="text-red-500 text-sm mt-1">{formik.errors.offeredDetails}</div> )}
        </div>

        {/* Image Upload */}
        <div>
          <input type="file" name="offeredImage"
             onChange={(event) => {
              formik.setFieldValue('offeredImage', event.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <label className="text-xs text-gray-500 mt-1 block">Choose an image for your Offered Skill.</label>
          {formik.touched.offeredImage && formik.errors.offeredImage && ( <div className="text-red-500 text-sm mt-1">{formik.errors.offeredImage}</div>)}
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!isOfferedValid()}
            onClick={() => setNext('needed')}
            className={`px-6 py-2 text-lg rounded-lg transition-colors ${
              isOfferedValid() ? 'bg-purple-600 text-white hover:bg-purple-700': 'bg-gray-400 text-gray-700 cursor-not-allowed'}`} 
              >Next</button>
        </div>
      </div>
    )}

    {/* Skill Needed Section */}
    {next === 'needed' && (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-gray-700">Skill Needed</h1>
        <div>
          <input
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="text" name="neededTitle" placeholder="Title"
            value={formik.values.neededTitle}
            onChange={formik.handleChange}  onBlur={formik.handleBlur}
          />
          {formik.touched.neededTitle && formik.errors.neededTitle && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.neededTitle}</div>
          )}
        </div>

        <div>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          {formik.touched.neededCategory && formik.errors.neededCategory && (  <div className="text-red-500 text-sm mt-1">{formik.errors.neededCategory}</div>)}
        </div>

        <div>
          <textarea
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="neededDetails"  placeholder="Detailed information"
            value={formik.values.neededDetails}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
          <label className="text-xs text-gray-500  block">Give detail information about skill.</label>
          {formik.touched.neededDetails && formik.errors.neededDetails && (<div className="text-red-500 text-sm mt-1">{formik.errors.neededDetails}</div>)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority:</label>
          <div className="flex space-x-4">
            {['Low', 'Medium', 'High'].map((level, index) => (
              <label key={index} className="flex items-center">
                <input
                  className="mr-2" type="radio" name="neededPriority" value={level}
                  checked={formik.values.neededPriority === level}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                />
                <span className="text-sm text-gray-700">{level}</span>
              </label>
            ))}
          </div>
          {formik.touched.neededPriority && formik.errors.neededPriority && (<div className="text-red-500 text-sm mt-1">{formik.errors.neededPriority}</div>)}
        </div>

        <div>
          <input
            type="file"  name="neededImage"
            onChange={(event) => {
              formik.setFieldValue('neededImage', event.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {formik.touched.neededImage && formik.errors.neededImage && (<div className="text-red-500 text-sm mt-1">{formik.errors.neededImage}</div>)}
        </div>

        <div>
          <input
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="number"  name="hours" placeholder="Hours"value={formik.values.hours}
            onChange={formik.handleChange} onBlur={formik.handleBlur}
          />
           <label className="text-xs text-gray-500 mt-1 block">Set duration of swap skill.</label>
          {formik.touched.hours && formik.errors.hours && (<div className="text-red-500 text-sm mt-1">{formik.errors.hours}</div>)}
        </div>

        {/* Navigation  */}
        <div className="flex justify-between">
          <button
            className="px-6 py-2 text-lg rounded-lg bg-purple-600 text-white hover:bg-purple-500"
            type="button"onClick={() => setNext('offered')}
          >Back</button>
          <button
            type="button"
            disabled={!isNeededValid()} onClick={() => setNext('qstn')}
            className={`px-6 py-2 text-lg rounded-lg transition-colors ${isNeededValid()? 'bg-purple-600 text-white hover:bg-purple-700':
             'bg-gray-400 text-gray-700 cursor-not-allowed'}`} > Next
          </button>
        </div>
      </div>
    )}

    {/* Questions  */}
    {next === 'qstn' && (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-gray-700">Create Questions & Answers</h1>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Instructions:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li>Ensure that the quiz contains exactly 3 questions.</li>
            <li>Each question must have three answer options, with one marked as the correct answer.</li>
            <li>Ensure a mix of difficulty levels, from easy to expert, to challenge learners progressively.</li>
            <li>Assign points to each question based on difficulty (Easy: 1 point, Intermediate: 2 points, Expert: 3 points).</li>
          </ul>
        </div>

        <div>
          <input
            type="text" name="currentQuestion" placeholder="Type your question here"
            value={formik.values.currentQuestion} onChange={formik.handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {formik.touched.currentQuestion && formik.errors.currentQuestion && ( <div className="text-red-500 text-sm mt-1">{formik.errors.currentQuestion}</div>)}
        </div>

        {/* Answers  */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Enter 3 Answers:</h3>
          {formik.values.answers.map((answer, index) => (
            <input
              key={index}  type="text"name={`answers[${index}]`}
              placeholder={`Answer ${index + 1}`} value={answer} onChange={formik.handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
          {formik.touched.answers && formik.errors.answers && (<div className="text-red-500 text-sm mt-1">{formik.errors.answers}</div>)}
        </div>

        {/* Correct Answer  */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</h3>
          <select
            name="correctAnswer"  value={formik.values.correctAnswer} onChange={formik.handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select correct answer</option>
            {formik.values.answers.map((ans, index) => (
              <option key={index} value={ans}>{ans} </option>
            ))}
          </select>
          {formik.touched.correctAnswer && formik.errors.correctAnswer && ( <div className="text-red-500 text-sm mt-1">{formik.errors.correctAnswer}</div> )}
        </div>

        {/* Difficulty Level */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty Level:</h3>
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            name="difficulty"  value={formik.values.difficulty}onChange={formik.handleChange}
          >
            <option value="Easy">Easy (1 Point)</option>
            <option value="Inter">Intermediate (2 Points)</option>
            <option value="Expert">Expert (3 Points)</option>
          </select>
        </div>

        {/* Add Question Button */}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        > Add Question
        </button>

        {/* Submit */}
        {formik.values.questions.length >= 2 && (
          <button
          className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-4"
            type="submit" onClick={handleSave}
          >
            {isPending ? (
              <span className="flex items-center justify-center">  Loading <FaSpinner className="animate-spin ml-2" /></span>
            ) : (
              "Submit & Save Questions"
            )}
          </button>
        )}
      </div>
    )}
  </form>
</div>
  );
};

export default AddSwap;