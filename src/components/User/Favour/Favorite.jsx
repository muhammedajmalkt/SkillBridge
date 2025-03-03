import { useState } from "react";

export default function QuestionCollector() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [showResults, setShowResults] = useState(false);

  const handleAddQuestion = () => {
    if (currentQuestion.trim() && answers.every(ans => ans.trim())) {
      setQuestions([...questions, { question: currentQuestion, answers }]);
      setCurrentQuestion("");
      setAnswers(["", "", ""]);
    }
  };
  console.log(questions);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {!showResults ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter a Question</h2>
            <input
              type="text"
              placeholder="Type your question here"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">Enter 3 Answers</h3>
            {answers.map((answer, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = e.target.value;
                  setAnswers(newAnswers);
                }}
                className="w-full p-2 border rounded mb-2"
              />
            ))}
            <button
              className="w-full p-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
            {questions.length === 2 && (
              <button
                className="w-full p-2 bg-green-500 text-white rounded mt-4 hover:bg-green-600"
                onClick={() => setShowResults(true)}
              >
                Finish & Show Questions 
              </button>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Collected Questions</h2>
            <ul className="list-disc pl-5">
              {questions.map((q, index) => (
                <li key={index} className="mb-2">
                  <strong>Q{index + 1}:</strong> {q.question}
                  <ul className="list-disc pl-5">
                    {q.answers.map((ans, i) => (
                      <li key={i}>{ans}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}