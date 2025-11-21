import { toast } from 'sonner';

export interface Question {
  question: string;
  options?: string[];
  answer?: string;
  correctAnswer?: string; // Support for both answer formats
  explanation?: string;
}

export interface Test {
  title: string;
  subject: string;
  examName?: string;
  questions: Question[];
}

// Frontend calls local backend POST /api/questions/generate which now uses Pollinations
export async function generateTest(subject: string, questionCount: number, examName?: string): Promise<Test> {
  try {
    const validQuestionCount = Math.min(Math.max(1, questionCount), 10);
    if (validQuestionCount < questionCount) {
      toast.info(`Note: Currently limited to generating a maximum of 10 questions at once`);
    }

    const examText = examName ? ` for ${examName}` : '';
    toast.info(`Generating ${validQuestionCount} questions about ${subject}${examText}...`);

    const response = await fetch('http://localhost:3001/api/questions/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: subject,
        difficulty: 'medium',
        questionCount: validQuestionCount,
        examName: examName || ''
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      toast.error(errorData.details || 'Failed to generate test');
      throw new Error(errorData.details || 'Failed to generate test');
    }

    const data = await response.json();
    const testData: Test = {
      title: data.title || `${subject} Test`,
      subject: data.subject || subject,
      examName: data.examName || '',
      questions: Array.isArray(data.questions) ? data.questions : [data]
    };

    if (!testData.questions || testData.questions.length === 0) {
      toast.error('No questions were generated');
      throw new Error('No questions were generated');
    }

    testData.questions = testData.questions.map(q => {
      if (q.correctAnswer && !q.answer) {
        return { ...q, answer: q.correctAnswer };
      }
      return q;
    });

    toast.success(`Generated ${testData.questions.length} questions successfully`);
    return testData;
  } catch (error) {
    console.error('Error in generateTest:', error);
    throw error;
  }
}
