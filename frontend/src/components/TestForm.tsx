import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import LoadingState from './LoadingState';
import { generateTest } from '@/services/pollinationsService';
import { BookOpen, Target, Gauge, ArrowRight } from 'lucide-react';

interface FormData {
  subject: string;
  examName: string;
  questionCount: number;
  difficulty: string;
}

const TestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    examName: '',
    questionCount: 5,
    difficulty: 'medium',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, questionCount: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (formData.questionCount < 1 || formData.questionCount > 10) {
      toast.error('Please select between 1 and 10 questions');
      return;
    }

    setLoading(true);
    
    try {
      const test = await generateTest(formData.subject, formData.questionCount, formData.examName);
      
      if (!test || !test.questions || test.questions.length === 0) {
        throw new Error('No questions were generated');
      }
      
      navigate('/test', { state: { test } });
    } catch (error) {
      console.error('Error generating test:', error);
      toast.error('Error generating test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState subject={formData.subject} count={formData.questionCount} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in relative">
      {/* Background decorations with warm colors */}
      <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-amber-100/40 to-orange-100/40 rounded-3xl blur-sm"></div>
      <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-tl from-rose-100/40 to-amber-100/50 rounded-3xl blur-sm"></div>
      
      <Card className="border border-amber-100/50 bg-gradient-to-br from-white via-amber-50/30 to-white backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <CardContent className="pt-8 pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Subject Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <Label 
                  htmlFor="subject" 
                  className="text-sm font-semibold text-gray-800"
                >
                  Subject or Topic
                </Label>
              </div>
              <Input
                id="subject"
                name="subject"
                placeholder="E.g., Mathematics, History, Biology..."
                value={formData.subject}
                onChange={handleInputChange}
                className="bg-white/70 border-amber-200 rounded-xl font-medium text-gray-800 placeholder:text-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
              />
              <p className="text-xs text-gray-600 mt-2">
                Tip: Use multiple subjects separated by commas for variety
              </p>
            </div>

            {/* Exam Name Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-amber-700" />
                <Label 
                  htmlFor="examName" 
                  className="text-sm font-semibold text-gray-800"
                >
                  Exam Type <span className="text-gray-500 font-normal text-xs">(Optional)</span>
                </Label>
              </div>
              <Input
                id="examName"
                name="examName"
                placeholder="E.g., GMAT, SAT, JEE Main, NEET..."
                value={formData.examName}
                onChange={handleInputChange}
                className="bg-white/70 border-amber-200 rounded-xl font-medium text-gray-800 placeholder:text-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50"
              />
              <p className="text-xs text-gray-600 mt-2">
                Questions will be formatted according to the exam pattern
              </p>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-5 h-5 text-amber-700" />
                <Label 
                  htmlFor="difficulty" 
                  className="text-sm font-semibold text-gray-800"
                >
                  Difficulty Level
                </Label>
              </div>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/70 border border-amber-200 rounded-xl font-medium text-gray-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 transition-all appearance-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            {/* Question Count Slider */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <Label 
                  htmlFor="questionCount" 
                  className="text-sm font-semibold text-gray-800"
                >
                  Number of Questions
                </Label>
                <span className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {formData.questionCount}
                </span>
              </div>
              
              <Slider
                id="questionCount"
                min={1}
                max={10}
                step={1}
                value={[formData.questionCount]}
                onValueChange={handleSliderChange}
                className="py-4"
              />
              
              <div className="flex justify-between text-xs text-gray-600 px-1 font-medium">
                <span>1 Question</span>
                <span>10 Questions</span>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-8 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl h-12 font-semibold text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Generate & Start Test
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestForm;
