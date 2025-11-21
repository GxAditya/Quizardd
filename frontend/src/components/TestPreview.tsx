
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Test, Question } from '@/services/pollinationsService';

interface TestPreviewProps {
  test: Test;
}

const TestPreview = ({ test }: TestPreviewProps) => {
  const [selectedGroup, setSelectedGroup] = useState("all");
  
  // Calculate groups based on question count
  const calculateGroups = () => {
    const questionCount = test.questions.length;
    let groupSize = 10;
    
    if (questionCount <= 10) {
      return [{ id: "all", name: "All Questions", questions: test.questions }];
    }
    
    if (questionCount <= 30) {
      groupSize = Math.ceil(questionCount / 3);
    } else {
      groupSize = Math.ceil(questionCount / 5);
    }
    
    const groups = [{ id: "all", name: "All Questions", questions: test.questions }];
    
    for (let i = 0; i < questionCount; i += groupSize) {
      const groupNumber = Math.floor(i / groupSize) + 1;
      const groupQuestions = test.questions.slice(i, i + groupSize);
      
      groups.push({
        id: `group-${groupNumber}`,
        name: `Group ${groupNumber}`,
        questions: groupQuestions,
      });
    }
    
    return groups;
  };
  
  const groups = calculateGroups();
  
  const handlePrint = () => {
    window.print();
  };
  
  const renderQuestion = (question: Question, index: number) => (
    <div key={index} className="group">
      <div className="p-4 space-y-2">
        <div className="flex gap-2">
          <span className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm font-medium text-amber-600">
            {index + 1}
          </span>
          <div className="space-y-2">
            <p className="font-medium">{question.question}</p>
            {question.options && question.options.length > 0 && (
              <div className="pl-5 space-y-2 mt-2">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-start gap-2">
                    <span className="text-sm font-medium text-amber-600">{String.fromCharCode(65 + optIndex)}.</span>
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Separator className="last:hidden bg-amber-100" />
    </div>
  );
  
  const selectedGroupData = groups.find(group => group.id === selectedGroup) || groups[0];
  
  return (
    <div className="w-full animate-fade-in print:animate-none">
      <Card className="bg-white/95 backdrop-blur-sm border border-amber-200 shadow-lg print:shadow-none rounded-3xl">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-xs font-medium text-amber-500 mb-1 print:hidden">
                Test Preview
              </div>
              <CardTitle className="text-2xl text-amber-800">{test.title}</CardTitle>
            </div>
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="self-start print:hidden button-animation border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              Print Test
            </Button>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="all" value={selectedGroup} onValueChange={setSelectedGroup} className="print:hidden">
          <div className="px-6">
            <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-transparent pb-1 justify-start">
              {groups.map(group => (
                <TabsTrigger 
                  key={group.id} 
                  value={group.id}
                  className="px-3 py-1.5 h-auto data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 data-[state=active]:shadow-sm"
                >
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {groups.map(group => (
            <TabsContent key={group.id} value={group.id} className="mt-0 pt-0">
              <CardContent className="p-0">
                <div className="max-h-[70vh] overflow-y-auto">
                  {group.questions.map((question, index) => renderQuestion(
                    question, 
                    group.id === "all" ? index : groups[0].questions.indexOf(question)
                  ))}
                </div>
              </CardContent>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* This will be visible on print only */}
        <div className="hidden print:block">
          <CardContent className="p-0">
            {test.questions.map((question, index) => renderQuestion(question, index))}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default TestPreview;
