import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { usePostScore } from "../../../hooks/useSwap";
import Loader from "../Layout/Loader";
import ScoreModal from "./ScoreModal";

const Assess = () => {
  const { skillId, transactionId,requesterId:assessdUser } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const {mutate,isSuccess} = usePostScore()
  const navigate = useNavigate()


  const { data: questionnair = [],isLoading } = useQuery({
    queryKey: ["getquestionnair", skillId, transactionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/get/questionnair?skillid=${skillId}&transactionId=${transactionId}` );
      return data.data;
    },
    enabled: !!transactionId,
  });


  const handleNext = () => {
    if (!selectedAnswers[currentIndex]) {
      toast.error("Please select an answer before proceeding.",{
        position:"top-right"
      });
      return;
    }
    if (currentIndex < questionnair.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleSelectAnswer = (questionIndex, answer) => {
    if (!submitted) {
      setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
    }
  };
  const totalMark = questionnair.reduce((acc,item)=>acc+item.points,0)
  const handleSubmit = () => {
    let totalScore = 0;
    questionnair.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        totalScore += question.points; 
      }
    });        
    setSubmitted(true);    
    setScore(totalScore);
    mutate({skillId,assessedUser:assessdUser,transactionId,score:Math.round((totalScore/totalMark)*100)},{
        onSuccess:(data)=>{
                // navigate("/")
        },
        onError:(err)=>{
            console.log(err);
            
        }})
  };
  
// console.log(questionnair);
if(isLoading)return <div className='h-screen flex justify-center items-center '><Loader /></div>

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-6">
  {questionnair.length > 0 ? (
    <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto">
      {/* Question*/}
      <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">
        {questionnair[currentIndex].currentQuestion}
      </h1>

      {/* Answer */}
      <div className="flex flex-col gap-4">
        <label className="font-semibold text-gray-700 mb-2">Select an Answer:</label>
        {questionnair[currentIndex].answers.map((ans, i) => {
          const isCorrect = submitted && ans === questionnair[currentIndex].correct_answer;
          const isSelected = selectedAnswers[currentIndex] === ans;
          const isIncorrect = submitted && isSelected && !isCorrect;

          return (
            <label key={i} className={`flex items-center text-lg p-4 rounded-lg cursor-pointer border-2 transition-all
                ${isCorrect ? "border-green-500 bg-green-50" : ""}${isIncorrect ? "border-red-500 bg-red-50" : ""}
                ${isSelected && !submitted ? "border-blue-500 bg-blue-50" : ""}${!submitted ? "hover:border-blue-300 hover:bg-blue-50" : ""}`}
            >
              <input
                type="radio" name={`question_${currentIndex}`}
                value={ans} checked={isSelected}
                onChange={() => handleSelectAnswer(currentIndex, ans)}
                disabled={submitted}
                className="mr-3"
              /> {ans}
            </label>
          );
        })}
      </div>

      {/* Correct Ans */}
      {submitted && (
        <p className="mt-6 text-green-700 font-semibold text-center">
          Correct Answer: {questionnair[currentIndex].correct_answer}
        </p>
      )}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-6 py-2 rounded-lg text-white transition-all ${currentIndex === 0 ? "bg-gray-300 cursor-not-allowed": "bg-blue-500 hover:bg-blue-600" }`}>
          Previous
        </button>

        {!isSuccess && currentIndex === questionnair.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all"
          > Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentIndex === questionnair.length - 1}
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all"
          > Next
          </button>
        )}
      </div>
    </div>
  ) : (
    <p className="text-gray-500 text-lg">No questions available.</p>
  )}
   
  {/* Score Display */}
  {/* {submitted && (
    <div className="mt-8 p-6 bg-green-100 border border-green-300 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-green-800">
        Your Score: {Math.round((score / totalMark) * 100)}%
      </h2>
      <p className="text-gray-600 mt-2">You scored {score} out of {totalMark}.</p>
    </div>
  )} */}
                 {submitted && <ScoreModal score={Math.round((score/totalMark)*100)}/>}

</div>
  );
};

export default Assess;
