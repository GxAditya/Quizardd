import axios from 'axios';

// Pollinations AI doesn't require an API key
export async function generateQuestion(topic: string, difficulty: string, questionIndex?: number) {
  try {
    let diversityInstruction = '';
    if (questionIndex !== undefined) {
      diversityInstruction = `This is question #${questionIndex + 1} in a multi-question test. `;
      if (questionIndex > 0) {
        diversityInstruction += 'Please choose a DIFFERENT subject than previous questions to ensure diversity. ';
      }
    }

    const prompt = `Generate a ${difficulty} level question about ${topic}.

                    IMPORTANT INSTRUCTIONS:
                    ${diversityInstruction}
                    1. If the topic contains multiple subjects (e.g., "Math and Science", "History, Geography, and Literature", etc.),
                       identify all the subjects and choose one randomly for this question to ensure a diverse mix of questions.
                    2. Make sure the question is detailed, clear, and appropriate for the ${difficulty} difficulty level.

                    Format the response as a VALID JSON object with the following structure:
                    {
                      "question": "the question text",
                      "options": ["option1", "option2", "option3", "option4"],
                      "correctAnswer": "correct option",
                      "explanation": "explanation of the answer"
                    }

                    IMPORTANT: Return ONLY the JSON object, without any markdown code blocks or extra text.
                    Do not include \`\`\`json or \`\`\` markers in your response.`;

    const payload = {
      model: 'openai',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates quiz questions in valid JSON format. Always respond with only the JSON object, no extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    const response = await axios.post('https://text.pollinations.ai/openai', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('No response received from Pollinations AI API');
    }

    const text = response.data.choices[0].message.content;
    console.log('Raw response from Pollinations AI API:', text.substring(0, 100) + '...');

    try {
      // Handle responses wrapped in code blocks
      let jsonText = text;

      // Check for markdown code blocks and extract the content
      if (text.includes('```')) {
        // Extract content between code blocks
        const codeBlockMatch = text.match(/```(?:json)?([\s\S]+?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          jsonText = codeBlockMatch[1].trim();
        } else {
          // If regex fails, try simple replacement
          jsonText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        }
      }

      // Find and extract JSON even if it's not properly formatted with code blocks
      if (!jsonText.startsWith('{')) {
        const jsonStart = jsonText.indexOf('{');
        if (jsonStart !== -1) {
          jsonText = jsonText.substring(jsonStart);
        }
      }

      if (!jsonText.endsWith('}')) {
        const jsonEnd = jsonText.lastIndexOf('}');
        if (jsonEnd !== -1) {
          jsonText = jsonText.substring(0, jsonEnd + 1);
        }
      }

      console.log('Extracted JSON:', jsonText.substring(0, 100) + '...');

      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Pollinations response:', text);
      throw new Error('Invalid response format from Pollinations AI API');
    }
  } catch (error: any) {
    console.error('Detailed error:', error);

    throw new Error(`Question generation failed: ${error.message}`);
  }
}