import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Test, Question } from '@/services/pollinationsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, TrendingUp, Award, RotateCcw, Home } from 'lucide-react';

interface TestResultsProps {
  test: Test;
  answers: Record<number, string>;
  timeSpent: number;
}

const TestResults = ({ test, answers, timeSpent }: TestResultsProps) => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  // Calculate scores
  const correctAnswers = test.questions.filter((q, idx) => {
    const answer = answers[idx];
    return answer === q.answer || answer === q.correctAnswer;
  }).length;

  const skippedAnswers = test.questions.length - Object.keys(answers).length;
  const incorrectAnswers = Object.keys(answers).length - correctAnswers;
  const totalQuestions = test.questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const timePerQuestion = Math.round(timeSpent / totalQuestions);

  // Get performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Outstanding', color: 'text-green-700', emoji: 'Outstanding' };
    if (score >= 75) return { level: 'Excellent', color: 'text-amber-700', emoji: 'Excellent' };
    if (score >= 60) return { level: 'Good', color: 'text-orange-700', emoji: 'Good' };
    if (score >= 40) return { level: 'Average', color: 'text-rose-700', emoji: 'Average' };
    return { level: 'Needs Improvement', color: 'text-red-700', emoji: 'Needs Work' };
  };

  const performance = getPerformanceLevel(percentage);

  // Chart data
  const scoreData = [
    { name: 'Correct', value: correctAnswers, color: '#16a34a' },
    { name: 'Incorrect', value: incorrectAnswers, color: '#dc2626' },
    { name: 'Skipped', value: skippedAnswers, color: '#d1d5db' },
  ];

  const categoryData = [
    { category: 'Correct', count: correctAnswers },
    { category: 'Incorrect', count: incorrectAnswers },
    { category: 'Skipped', count: skippedAnswers },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleRetakeTest = () => {
    navigate('/');
  };

  const handleViewAnswers = () => {
    document.getElementById('answers-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Results Header */}
        <Card className="border-0 bg-gradient-to-br from-white to-amber-50 backdrop-blur shadow-xl mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full -mr-20 -mt-20 opacity-20"></div>
          
          <CardContent className="pt-10 pb-8 px-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="text-6xl font-black">
                {percentage >= 90 ? '🏆' : percentage >= 75 ? '⭐' : percentage >= 60 ? '👍' : '📈'}
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold ${performance.color}`}>
                {percentage}%
              </h1>
              <p className={`text-2xl font-semibold ${performance.color}`}>
                {performance.level}
              </p>
              <p className="text-gray-700 text-lg">
                You got <span className="font-bold text-green-600">{correctAnswers}</span> out of <span className="font-bold text-gray-900">{totalQuestions}</span> questions correct
              </p>
              <p className="text-sm text-gray-600 font-medium">
                {test.subject} {test.examName && `• ${test.examName}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Correct */}
          <Card className="border-0 bg-white/95 backdrop-blur shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-700">{correctAnswers}</p>
              <p className="text-sm text-gray-700 mt-1 font-medium">Correct</p>
            </CardContent>
          </Card>

          {/* Incorrect */}
          <Card className="border-0 bg-white/95 backdrop-blur shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-red-700">{incorrectAnswers}</p>
              <p className="text-sm text-gray-700 mt-1 font-medium">Incorrect</p>
            </CardContent>
          </Card>

          {/* Skipped */}
          <Card className="border-0 bg-white/95 backdrop-blur shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-gray-700">{skippedAnswers}</p>
              <p className="text-sm text-gray-700 mt-1 font-medium">Skipped</p>
            </CardContent>
          </Card>

          {/* Time per Question */}
          <Card className="border-0 bg-white/95 backdrop-blur shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-700">{timePerQuestion}s</p>
              <p className="text-sm text-gray-700 mt-1 font-medium">Avg per Q</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <Card className="border-0 bg-white/95 backdrop-blur shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {scoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="border-0 bg-white/95 backdrop-blur shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Answer Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#d97706" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Test Details */}
        <Card className="border-0 bg-white/95 backdrop-blur shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-gray-700 font-medium">Total Time Spent</p>
                <p className="text-2xl font-bold text-orange-700">{formatTime(timeSpent)}</p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-gray-700 font-medium">Total Questions</p>
                <p className="text-2xl font-bold text-amber-700">{totalQuestions}</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-gray-700 font-medium">Accuracy Rate</p>
                <p className="text-2xl font-bold text-green-700">{percentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Review Section */}
        <div id="answers-section" className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Detailed Review</h2>
          
          {test.questions.map((question, idx) => {
            const userAnswer = answers[idx];
            const correctAnswer = question.answer || question.correctAnswer;
            const isCorrect = userAnswer === correctAnswer;
            const skipped = !(idx in answers);

            return (
              <Card
                key={idx}
                className={`border-2 cursor-pointer transition-all ${
                  skipped
                    ? 'border-gray-200 bg-gray-50'
                    : isCorrect
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
                onClick={() => setSelectedQuestion(selectedQuestion === idx ? null : idx)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                        skipped
                          ? 'bg-gray-400'
                          : isCorrect
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{question.question}</p>
                      </div>
                    </div>
                    <div className="text-2xl">
                      {skipped ? '⏭' : isCorrect ? '✓' : '✗'}
                    </div>
                  </div>

                  {selectedQuestion === idx && (
                    <div className="mt-4 pl-11 space-y-3 border-t-2 border-gray-300 pt-4">
                      {question.options && (
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-800">Options:</p>
                          {question.options.map((option, optIdx) => {
                            const isSelectedByUser = userAnswer === option;
                            const isCorrectOption = option === correctAnswer;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded text-sm ${
                                  isCorrectOption
                                    ? 'bg-green-100 text-green-800 font-semibold border border-green-300'
                                    : isSelectedByUser
                                    ? 'bg-red-100 text-red-800 font-semibold border border-red-300'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                <span className="font-semibold">{String.fromCharCode(65 + optIdx)}.</span> {option}
                                {isCorrectOption && ' (Correct)'}
                                {isSelectedByUser && !isCorrectOption && ' (Your answer)'}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {!skipped && (
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Your Answer:</p>
                          <p className={`p-2 rounded text-sm font-medium ${isCorrect ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                            {userAnswer || 'No answer provided'}
                          </p>
                        </div>
                      )}

                      {skipped && (
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Correct Answer:</p>
                          <p className="p-2 rounded text-sm bg-green-100 text-green-800 font-medium border border-green-300">{correctAnswer}</p>
                        </div>
                      )}

                      {question.explanation && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                          <p className="font-semibold text-amber-900 mb-1">Explanation</p>
                          <p className="text-amber-800 text-sm">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Button
            onClick={handleRetakeTest}
            className="gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-lg font-semibold"
          >
            <RotateCcw className="w-4 h-4" /> Retake Test
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="gap-2 px-8 py-3 text-gray-800 border-gray-300 hover:bg-gray-50 rounded-lg font-semibold"
          >
            <Home className="w-4 h-4" /> Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
