import { useState } from "react";
// import { useCreateQst } from "../../../hooks/useSwap";
import { useFormik } from "formik";

const QuestionCollector = ({formik}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [showResults, setShowResults] = useState(false);
  const [err,setErr] = useState(false)

  //  difficulty levels and their required count
  const difficultyLevels = {
    Expert: { points: 3, required: 3 },
    Inter: { points: 2, required: 4 },
    Easy: { points: 1, required: 3 }
  };

  // Count questions by difficulty level
  const countQuestionsByLevel = (level) =>
    questions.filter(q => q.difficulty === level).length;

  // Add a new question to the list
  const handleAddQuestion = () => {
    if (
      currentQuestion.trim() &&
      answers.every(ans => ans.trim()) &&
      answers.includes(correctAnswer)
    ) {
      // Ensure each difficulty level has the required number of questions
      if (countQuestionsByLevel(difficulty) < difficultyLevels[difficulty].required) {
        setQuestions([
          ...questions,
          { 
            question: currentQuestion, 
            answers, 
            correct_answer: correctAnswer, 
            difficulty,
            points: difficultyLevels[difficulty].points
          }
        ]);
        // setCurrentQuestion("");
        // setAnswers(["", "", ""]);
        // setCorrectAnswer("");
      } else {
        setErr(true)
        // alert(`You already have ${difficultyLevels[difficulty].required} ${difficulty} questions.`);
      }
    } else {
      alert("Ensure all fields are filled and the correct answer is in the options.");
    }
  };
  // const {mutate:createQst} =useCreateQst()
  // const handleSave = () =>{
  //   console.log(questions);
  //   createQst(questions,{
      
  //    onSuccess:(data)=>{
  //     console.log(data,"suceess");
      
  //    },
  //    onError:(err)=>{
  //     console.log(err);
      
  //    }
  //   })
    
  // }
  
  console.log(formik);
  
  onsubmit :(values) =>{

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      {/* <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <form 
        onSubmit={formik.handleSubmit}
        >
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

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600">
            Add Question
          </button>

          {formik.values.questions.length > 0 && (
            <button type="button" onClick={handleSave} className="w-full p-2 bg-green-500 text-white rounded mt-4 hover:bg-green-600">
              Finish & Save Questions
            </button>
          )}
        </form>

        {formik.values.questions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Collected Questions</h2>
            <ul className="list-disc pl-5">
              {formik.values.questions.map((q, index) => (
                <li key={index} className="mb-2">
                  <strong>Q{index + 1} ({q.difficulty.toUpperCase()} - {q.points} pts):</strong> {q.question}
                  <ul className="list-disc pl-5">
                    {q.answers.map((ans, i) => (
                      <li key={i} className={ans === q.correct_answer ? "font-bold text-green-600" : ""}>
                        {ans}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div> */}
    </div>
  );
}
export default QuestionCollector
