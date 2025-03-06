// import { useQuery } from "@tanstack/react-query";
// import React, { useState } from "react";
// import axiosInstance from "../../../api/axiosInstance";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// const Assess = () => {
//   const { skillId, transactionId } = useParams();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswers,setSelectedAnswers]=useState({})

//   const { data: questionnair = [] } = useQuery({
//     queryKey: ["getquestionnair", skillId, transactionId],
//     queryFn: async () => {
//       const { data } = await axiosInstance.get(`/user/get/questionnair?skillid=${skillId}&transactionId=${transactionId}`)
//       return data.data;
//     },
//     enabled: !!transactionId ,skillId
//   });

//   const handleNext = () => {
//     if (!selectedAnswers[currentIndex]) {
//         toast.error('Please select an answer before proceeding.', {
//             position: 'top-right',
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: false,
//             draggable: true,
//           });
//         return;
//       }
//       if (currentIndex < questionnair.length - 1) {
//         setCurrentIndex(currentIndex + 1);
//       }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1)
//     }
//   };

//   const handleSelectAnswer = (questionIndex, answer) => {
//     setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
//   };

//   const handleSubmit = () =>{
//     console.log(selectedAnswers);
//     console.log(questionnair);
    


//   }
  
//   return (
//     <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-6">
//       {questionnair.length > 0 && (
//         <div className="p-10 bg-white shadow-lg rounded-md we-96 text-center w-1/2 h-1/2">
//           <h1 className="text-xl font-bold text-gray-800">
//             {questionnair[currentIndex].currentQuestion}
//           </h1>

//           <div className="flex flex-col mt-16  w-fit mx-auto ">
//             <label className="font-semibold">Answers:</label>
//             {questionnair[currentIndex].answers.map((ans, i) => (
//               <span key={i} className="flex text-lg">
//                 <input
//                   className="mr-2"
//                   type="radio"
//                   name={`question_${currentIndex}`}
//                   value={ans}
//                   checked={selectedAnswers[currentIndex] === ans}
//                   onChange={() => handleSelectAnswer(currentIndex, ans)}
//                 />
//                 <label>{ans}</label>
//               </span>
//             ))}
//           </div>

//           <div className="mt-28 flex justify-between ">
//             <button
//               onClick={handlePrev}
//               disabled={currentIndex === 0}
//               className={`px-4 py-2 rounded-md ${
//                 currentIndex === 0 ? "bg-gray-300 cursor-not-allowed": "bg-blue-500 text-white hover:bg-blue-600"}`}
//               > Previous </button>
//            {currentIndex === questionnair.length - 1 ?
//             <button className="px-4 py-2 rounded-md  bg-blue-500 text-white hover:bg-blue-600"
//             onClick={handleSubmit} >Submit</button> :  
//             <button
//               onClick={handleNext}
//               disabled={currentIndex === questionnair.length - 1}
//               className={`px-4 py-2 rounded-md  bg-blue-500 text-white hover:bg-blue-600 `}
//             > Next</button> }
//           </div>
//         </div>
//       )}

//       {questionnair.length === 0 && (
//         <p className="text-gray-500">No questions available.</p>
//       )}
//     </div>
//   );
// };

// export default Assess;

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Assess = () => {
  const { skillId, transactionId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0); // Store the user's score

  const { data: questionnair = [] } = useQuery({
    queryKey: ["getquestionnair", skillId, transactionId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/user/get/questionnair?skillid=${skillId}&transactionId=${transactionId}`
      );
      return data.data;
    },
    enabled: !!transactionId,
  });

  const handleNext = () => {
    if (!selectedAnswers[currentIndex]) {
      toast.error("Please select an answer before proceeding.");
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

  const handleSubmit = () => {
    let totalScore = 0;
    questionnair.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        totalScore += question.points; // Add points for correct answers
      }
    });
    setScore(totalScore);
    setSubmitted(true);
    toast.success(`Assessment submitted! You scored ${totalScore} points.`,{
        position:"top-right"
    });
  };
  const totalScore = questionnair.reduce((acc,item)=>acc+item.points,0)
  console.log(totalScore);
  
console.log(questionnair);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100 p-6">
      {questionnair.length > 0 && (
        <div className="p-10 bg-white shadow-lg rounded-md text-center w-1/2">
          <h1 className="text-xl font-bold text-gray-800">
            {questionnair[currentIndex].currentQuestion}
          </h1>

          <div className="flex flex-col mt-8 w-fit mx-auto">
            <label className="font-semibold mb-2">Select an Answer:</label>
            {questionnair[currentIndex].answers.map((ans, i) => {
              const isCorrect =
                submitted &&
                ans === questionnair[currentIndex].correct_answer;
              const isSelected = selectedAnswers[currentIndex] === ans;
              const isIncorrect = submitted && isSelected && !isCorrect;

              return (
                <label
                  key={i}
                  className={`flex items-center text-lg p-3 rounded-md cursor-pointer border 
                  ${isCorrect ? "border-green-500 bg-green-100" : ""}
                  ${isIncorrect ? "border-red-500 bg-red-100" : ""}
                  ${isSelected && !submitted ? "border-blue-500 bg-blue-100" : ""}
                  `}
                >
                  <input
                    type="radio"
                    name={`question_${currentIndex}`}
                    value={ans}
                    checked={isSelected}
                    onChange={() => handleSelectAnswer(currentIndex, ans)}
                    disabled={submitted} // Disable selection after submission
                    className="mr-3"
                  />
                  {ans}
                </label>
              );
            })}
          </div>

          {submitted && (
            <p className="mt-4 text-green-700 font-semibold">
              ✅ Correct Answer: {questionnair[currentIndex].correct_answer}
            </p>
          )}

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            {currentIndex === questionnair.length - 1 ? (
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentIndex === questionnair.length - 1}
                className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {questionnair.length === 0 && (
        <p className="text-gray-500">No questions available.</p>
      )}

      {/* Display score after submission */}
      {submitted && (
        <div className="mt-6 p-4 bg-green-200 text-green-900 rounded-md shadow-md">
          <h2 className="text-xl font-bold">Your Score: {Math.round((score/totalScore)*100)} %</h2>
        </div>
      )}
    </div>
  );
};

export default Assess;
