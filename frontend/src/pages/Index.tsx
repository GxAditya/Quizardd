

import TestForm from "@/components/TestForm";
import { Lightbulb, Book, Clock, BarChart3, Zap, Brain, Target } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Intelligent algorithms create custom questions tailored to your needs"
    },
    {
      icon: <Book className="w-6 h-6" />,
      title: "Multiple Exam Patterns",
      description: "Support for GMAT, SAT, JEE, NEET, and more"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Timed Challenges",
      description: "Build speed and accuracy with realistic time constraints"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Detailed Analytics",
      description: "Comprehensive performance insights and answer explanations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col">
      <div className="px-6 py-6 border-b border-amber-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Quizardd
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200/15 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-5xl mx-auto space-y-12 relative z-10">
          {/* Hero Section */}
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full border border-amber-200">
              <Lightbulb className="w-4 h-4 text-amber-700" />
              <span className="text-sm font-semibold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                Welcome to Quizardd
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                Unleash Your Inner Quiz Whiz 
              </span>
              <span className="text-gray-800"> with Quizardd's Smart Test Magic</span>
            </h1>
            
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-semibold">
              Create, conquer, and master any subject with AI-powered quizzes. Challenge yourself, track your progress, and become a true Quizardd!
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/70 backdrop-blur px-4 py-2 rounded-lg border border-amber-100">
                <Zap className="w-4 h-4 text-amber-600" />
                AI-Powered Questions
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/70 backdrop-blur px-4 py-2 rounded-lg border border-amber-100">
                <Clock className="w-4 h-4 text-orange-600" />
                Timed Tests
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/70 backdrop-blur px-4 py-2 rounded-lg border border-amber-100">
                <BarChart3 className="w-4 h-4 text-rose-600" />
                Instant Results
              </div>
            </div>
          </div>
          
          {/* Test Form */}
          <TestForm />

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur border border-amber-100/50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-4 py-8">
            <div className="text-center p-6 bg-gradient-to-br from-amber-100/60 to-amber-50/60 rounded-2xl border border-amber-200/50">
              <p className="text-4xl font-bold text-amber-700">100+</p>
              <p className="text-sm text-gray-700 mt-2 font-medium">Question Types</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-100/60 to-orange-50/60 rounded-2xl border border-orange-200/50">
              <p className="text-4xl font-bold text-orange-700">20+</p>
              <p className="text-sm text-gray-700 mt-2 font-medium">Exam Patterns</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-rose-100/60 to-rose-50/60 rounded-2xl border border-rose-200/50">
              <p className="text-4xl font-bold text-rose-700">Unlimited</p>
              <p className="text-sm text-gray-700 mt-2 font-medium">Practice Tests</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
