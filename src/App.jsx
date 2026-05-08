import React, { useState, useEffect, useRef } from 'react';

const RAW_QUESTIONS = [
  {
    question: "Which aspect of technology sounds the coolest?",
    options: [
      { text: "Building apps and making software from scratch.", category: "Developer" },
      { text: "Making apps look beautiful and easy to use.", category: "Designer" },
      { text: "Hunting for hidden glitches and breaking things to fix them.", category: "QA Tester" },
      { text: "Finding hidden patterns in numbers to predict the future.", category: "Data Scientist" },
      { text: "Leading a team and deciding which \"level\" to tackle next.", category: "Product Manager" },
      { text: "Playing digital defense and stopping hackers.", category: "Cybersecurity Analyst" }
    ]
  },
  {
    question: "Which skill do you enjoy using the most?",
    options: [
      { text: "Pure logic and puzzle-solving.", category: "Developer" },
      { text: "Visual art and understanding how people think.", category: "Designer" },
      { text: "Being a skeptic and finding errors others missed.", category: "QA Tester" },
      { text: "Math, statistics, and organizing information.", category: "Data Scientist" },
      { text: "Communication, leadership, and \"Big Picture\" planning.", category: "Product Manager" },
      { text: "Alertness, ethics, and protecting others.", category: "Cybersecurity Analyst" }
    ]
  },
  {
    question: "How do you prefer to work on a project?",
    options: [
      { text: "Head-down, focusing on the technical code.", category: "Developer" },
      { text: "Sketching ideas and prototyping visual solutions.", category: "Designer" },
      { text: "Exploring every corner of a project to find its weaknesses.", category: "QA Tester" },
      { text: "Analyzing data and writing reports on what the numbers say.", category: "Data Scientist" },
      { text: "Coordinating everyone’s efforts to reach a high score.", category: "Product Manager" },
      { text: "Monitoring systems and keeping the \"maze\" secure.", category: "Cybersecurity Analyst" }
    ]
  },
  {
    question: "Which type of problems do you enjoy solving?",
    options: [
      { text: "Complex coding challenges and logic bugs.", category: "Developer" },
      { text: "Frustrating menus or ugly app layouts.", category: "Designer" },
      { text: "Weird glitches that only happen sometimes.", category: "QA Tester" },
      { text: "Predicting what people will want to buy or do next.", category: "Data Scientist" },
      { text: "Figuring out which features will make an app successful.", category: "Product Manager" },
      { text: "Closing security holes and stopping digital threats.", category: "Cybersecurity Analyst" }
    ]
  },
  {
    question: "How important is \"Art and Creativity\" to you?",
    options: [
      { text: "Moderately—I like thinking outside the box.", category: "Developer" },
      { text: "Extremely — it's the core of everything I do.", category: "Designer" },
      { text: "Not really — I prefer facts and finding flaws.", category: "QA Tester" },
      { text: "Slightly — I care more about accuracy.", category: "Data Scientist" },
      { text: "Moderately — I like to be creative with strategy.", category: "Product Manager" },
      { text: "Slightly — I focus on rules and safety.", category: "Cybersecurity Analyst" }
    ]
  },
  {
    question: "Pick your ideal \"Power-Up\" environment:",
    options: [
      { text: "A flexible remote setup where I can focus.", category: "Developer" },
      { text: "A creative agency or design studio full of color.", category: "Designer" },
      { text: "A \"Testing Lab\" where I can experiment and break things.", category: "QA Tester" },
      { text: "A research-oriented space with lots of data screens.", category: "Data Scientist" },
      { text: "A fast-paced startup where I’m always talking to people.", category: "Product Manager" },
      { text: "A high-security tech hub or government center.", category: "Cybersecurity Analyst" }
    ]
  }
];

const CATEGORIES = ["Developer", "Designer", "QA Tester", "Data Scientist", "Product Manager", "Cybersecurity Analyst"];

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const PacManIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 text-yellow-400 fill-current animate-pulse inline-block">
    <path d="M 50 50 L 93.3 25 A 50 50 0 1 0 93.3 75 Z" />
  </svg>
);

const DotIcon = () => (
  <svg viewBox="0 0 10 10" className="w-3 h-3 text-yellow-400 fill-current inline-block mx-1">
    <circle cx="5" cy="5" r="4" />
  </svg>
);

export default function App() {
  const [view, setView] = useState('start');
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(RAW_QUESTIONS.length).fill(null));
  
  // Reference for scrolling to the top of the container
  const topRef = useRef(null);

  // Apply Google Font for 8-bit retro look
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
      body, html, #root {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #141826 !important;
        width: 100%;
        height: 100%;
      }
      .retro-font {
        font-family: 'Press Start 2P', cursive;
      }
      .readable-retro {
        font-family: 'VT323', monospace;
      }
      .app-container {
        line-height: 1.5;
      }
      /* Custom scrollbar for retro feel */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #141826; }
      ::-webkit-scrollbar-thumb { background: #1e3a8a; border-radius: 4px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Bulletproof auto-scroll to top when navigating between views or questions
  useEffect(() => {
    // 1. Try to scroll the window directly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // 2. Fallbacks for Safari/Embedded browsers
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // 3. Scroll the actual div container into view if it exists
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentIndex, view]);

  const startQuiz = () => {
    const preppedQuestions = RAW_QUESTIONS.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    
    setShuffledQuestions(preppedQuestions);
    setAnswers(Array(RAW_QUESTIONS.length).fill(null));
    setCurrentIndex(0);
    setView('quiz');
  };

  const handleSelectOption = (category) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = category;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setView('results');
    }
  };

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-12 text-center p-6">
        <h1 className="retro-font text-yellow-400 text-2xl md:text-3xl leading-snug tracking-wider drop-shadow-[0_0_10px_rgba(255,255,0,0.8)]">
          READY PLAYER 1?<br/><br/>
          <span className="text-white text-lg">Which tech career are you most like?</span>
        </h1>
        <p className="readable-retro text-cyan-400 text-lg md:text-xl leading-loose max-w-md border-4 border-blue-800 p-6 rounded bg-[#141826]">
          Instructions: Choose the answer that best describes you. Don’t worry, if you don’t like the results, you can always level up your skills! Have fun!
        </p>
        <button onClick={startQuiz} className="retro-font bg-yellow-400 text-black px-8 py-4 text-xl border-b-8 border-yellow-600 hover:bg-yellow-300 hover:translate-y-1 hover:border-b-4 transition-all uppercase">
          Start
        </button>
    </div>
  );

  const renderQuizScreen = () => {
    const question = shuffledQuestions[currentIndex];
    const hasAnswered = answers[currentIndex] !== null;

    return (
      <div className="flex flex-col h-full w-full p-4 md:p-6 max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8 h-12 w-full px-2 border-b-2 border-blue-900 pb-4">
          {[...Array(shuffledQuestions.length)].map((_, i) => (
            <div key={i} className="flex-1 flex justify-center">
              {i === currentIndex ? <PacManIcon /> : (i > currentIndex ? <DotIcon /> : <div className="w-3 h-3"></div>)}
            </div>
          ))}
        </div>

        {/* Question Area */}
        <div className="flex-grow flex flex-col justify-start">
          <h2 className="readable-retro text-white text-2xl md:text-3xl leading-relaxed mb-8 h-24 flex items-center">
            {question.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col space-y-4 mb-8">
            {question.options.map((opt, idx) => {
              const isSelected = answers[currentIndex] === opt.category;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.category)}
                  className={`readable-retro text-left text-xl md:text-2xl leading-snug p-4 border-4 transition-all duration-200
                    ${isSelected 
                      ? 'border-yellow-400 bg-blue-900 text-yellow-300 scale-105' 
                      : 'border-blue-700 bg-[#141826] text-cyan-200 hover:border-cyan-400 hover:text-cyan-50'
                    }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between mt-auto pt-4 border-t-2 border-blue-900">
          <button 
            onClick={() => {
              if (currentIndex === 0) {
                setView('start');
              } else {
                setCurrentIndex(currentIndex - 1);
              }
            }} 
            className="retro-font text-[10px] px-4 py-3 border-2 border-pink-500 text-pink-500 hover:bg-pink-900/50"
          >
            Previous
          </button>
          
          {hasAnswered && (
            <button 
              onClick={handleNext} 
              className="retro-font text-[10px] px-6 py-3 border-2 border-green-500 text-green-400 hover:bg-green-900/50 animate-pulse"
            >
              {currentIndex === shuffledQuestions.length - 1 ? 'View Results' : 'Next'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResultsScreen = () => {
    const counts = {};
    CATEGORIES.forEach(c => counts[c] = 0);
    
    answers.forEach(a => {
      if (a) counts[a]++;
    });
    
    const sortedResults = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    return (
      <div className="flex flex-col items-center justify-start h-full p-6 w-full max-w-md mx-auto overflow-y-auto">
        <h2 className="retro-font text-yellow-400 text-xl text-center mb-8">HIGH SCORES</h2>
        
        <div className="w-full bg-[#141826] border-4 border-blue-700 p-4 mb-8">
          {sortedResults.map(([category, count], idx) => (
            <div key={category} className="flex items-center justify-between retro-font text-[10px] text-white my-3">
              <span className={idx === 0 ? 'text-green-400' : 'text-gray-300'}>
                {idx + 1}. {category}
              </span>
              <span className={idx === 0 ? 'text-yellow-400' : 'text-gray-500'}>
                {count}
              </span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => {
            setView('start');
          }} 
          className="retro-font border-4 border-cyan-400 text-cyan-400 px-6 py-4 text-xs hover:bg-cyan-400 hover:text-black mt-auto transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    );
  };

  return (
    <div className="app-container min-h-screen bg-[#141826] text-white flex justify-center overflow-x-hidden font-sans">
      <div className="w-full max-w-md min-h-screen relative bg-[#141826]">
        {/* Invisible anchor element at the very top for robust scrolling */}
        <div ref={topRef} className="absolute top-0 left-0 w-full h-1" />
        {view === 'start' && renderStartScreen()}
        {view === 'quiz' && shuffledQuestions.length > 0 && renderQuizScreen()}
        {view === 'results' && renderResultsScreen()}
      </div>
    </div>
  );
}