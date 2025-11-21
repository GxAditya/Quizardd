import express from 'express';
import { generateQuestion } from '../services/pollinations';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { topic, difficulty, questionCount = 1, examName = '' } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'Topic and difficulty are required' });
    }

    const validQuestionCount = Math.min(Math.max(1, questionCount), 10); // Limit to 10 questions max
    
    // Determine if the topic might contain multiple subjects
    const potentialSubjectsInTopic = topic.includes(' and ') || 
                                    topic.includes(',') || 
                                    topic.includes('/') || 
                                    topic.includes('&');
                                    
    console.log(`Topic "${topic}" might contain multiple subjects: ${potentialSubjectsInTopic}`);
    console.log(`Exam Name: ${examName || 'Not specified'}`);
    
    const questions = [];
    // Generate questions sequentially
    for (let i = 0; i < validQuestionCount; i++) {
      try {
        // For each question, we'll slightly modify the topic to encourage diversity
        // if multiple subjects are detected
        let currentTopic = topic;
        if (potentialSubjectsInTopic && i > 0) {
          currentTopic = `${topic} (Please choose a different subject than previous questions for variety)`;
        }
        
        const question = await generateQuestion(currentTopic, difficulty, examName, i);
        questions.push(question);
      } catch (err) {
        console.error(`Error generating question ${i+1}:`, err);
        // If we have at least one question, return what we have
        if (questions.length > 0) break;
        throw err; // Otherwise rethrow
      }
    }
    
    // Always return consistent structure
    res.json({
      title: `${topic} Test (${difficulty} difficulty)`,
      subject: topic,
      examName: examName || '',
      questions: questions
    });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate question',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
