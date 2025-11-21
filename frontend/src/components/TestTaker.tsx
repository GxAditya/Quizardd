import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Test, Question } from '@/services/pollinationsService';
import { ChevronRight, ChevronLeft, Flag, Clock, Zap } from 'lucide-react';

interface TestTakerProps {
  test: Test;
}

const TestTaker = ({ test }: TestTakerProps) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.questions.length * 60); // 1 min per question
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answered = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    if (submitted) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (option: string) => {
    if (!submitted) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: option
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitTest = () => {
    setSubmitted(true);
    navigate('/results', { 
      state: { 
        test, 
        answers,
        timeSpent: test.questions.length * 60 - timeLeft
      } 
    });
  };

  const isAnswered = currentQuestionIndex in answers;
  const selectedAnswer = answers[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer || selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer and Progress */}
        <Card className="border-0 bg-white/95 backdrop-blur shadow-lg mb-6">
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Test Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{test.subject}</h1>
                {test.examName && (
                  <p className="text-sm text-gray-600 mt-1 font-medium">{test.examName}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 items-center">
                {/* Time */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-rose-100 px-4 py-2 rounded-lg border border-orange-200">
                  <Clock className="w-5 h-5 text-orange-700" />
                  <div>
                    <p className="text-xs text-gray-700 font-medium">Time Left</p>
                    <p className={`font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>

                {/* Questions */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-lg border border-amber-200">
                  <Zap className="w-5 h-5 text-amber-700" />
                  <div>
                    <p className="text-xs text-gray-700 font-medium">Progress</p>
                    <p className="font-bold text-gray-800">{answered}/{test.questions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestionIndex + 1} of {test.questions.length}
                </span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-0 bg-white/95 backdrop-blur shadow-lg mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {currentQuestionIndex + 1}
                  </div>
                  {isAnswered && (
                    <Flag className={`w-5 h-5 ${isCorrect && submitted ? 'text-green-600' : !submitted ? 'text-amber-600' : 'text-red-600'}`} />
                  )}
                </div>
                <CardTitle className="text-xl text-gray-800 font-semibold">
                  {currentQuestion.question}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options && currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption = option === currentQuestion.answer || option === currentQuestion.correctAnswer;
                let bgColor = 'bg-gray-50 hover:bg-gray-100';
                let borderColor = 'border-gray-200';
                let textColor = 'text-gray-800';

                if (submitted) {
                  if (isCorrectOption) {
                    bgColor = 'bg-green-50';
                    borderColor = 'border-green-400';
                    textColor = 'text-green-900';
                  } else if (isSelected && !isCorrectOption) {
                    bgColor = 'bg-red-50';
                    borderColor = 'border-red-400';
                    textColor = 'text-red-900';
                  }
                } else if (isSelected) {
                  bgColor = 'bg-amber-100';
                  borderColor = 'border-amber-400';
                  textColor = 'text-amber-900';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={submitted}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all cursor-pointer flex items-start gap-3 ${bgColor} ${borderColor} ${textColor} ${submitted ? 'cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? (submitted ? (isCorrectOption ? 'border-green-400 bg-green-400' : 'border-red-400 bg-red-400') : 'border-amber-400 bg-amber-400') : 'border-gray-400'
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="flex-1 font-medium">{String.fromCharCode(65 + index)}. {option}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation - Show after submission or on request */}
            {submitted && currentQuestion.explanation && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-300 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-2">Explanation</p>
                <p className="text-sm text-amber-800">{currentQuestion.explanation}</p>
              </div>
            )}

            {!submitted && isAnswered && currentQuestion.explanation && (
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-sm text-amber-700 hover:text-amber-800 font-medium"
              >
                {showExplanation ? 'Hide' : 'Show'} Explanation
              </button>
            )}

            {!submitted && showExplanation && currentQuestion.explanation && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3 justify-between items-center">
          <Button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            className="gap-2 px-6 py-2 h-auto border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {test.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-lg font-semibold text-sm transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                    : index in answers
                    ? 'bg-green-200 text-green-800 hover:bg-green-300'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === test.questions.length - 1 ? (
            <Button
              onClick={handleSubmitTest}
              className="gap-2 px-6 py-2 h-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Submit Test
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gap-2 px-6 py-2 h-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestTaker;
