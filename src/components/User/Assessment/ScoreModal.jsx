import { useState } from 'react';

const ScoreModal = ({score}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-[1000]"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] p-8 rounded-xl w-[90%] max-w-[500px] relative shadow-2xl border border-white/10"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-transparent border-none text-white text-xl hover:scale-125 transition-transform duration-200"
            >
              &times;
            </button>
            
            <div className="flex flex-col items-center gap-4 text-slate-50">
              <h2 className="text-2xl font-bold text-center ">🎉 Congratulations! 🎉</h2>
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="text-lg">Your Score</div>
                <div className="text-6xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {score}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {score && score < 40 ? 
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-sm border border-gray-600">
                  😊 Good Score
                </span> : score < 70?
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-sm border border-gray-600">
                    💯 Good Score
                  </span>:
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-sm border border-gray-600">
                    🥇 Gold Medal
                  </span>
              }
         
                </div>
              </div>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
              onClick={()=>setIsOpen(false)}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default  ScoreModal