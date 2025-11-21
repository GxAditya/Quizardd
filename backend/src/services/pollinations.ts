import axios from 'axios';

// Pollinations AI usage: Text generation endpoint
export async function generateQuestion(topic: string, difficulty: string, examPattern: string, questionIndex?: number) {
  try {
    let diversityInstruction = '';
    if (questionIndex !== undefined) {
      diversityInstruction = `This is question #${questionIndex + 1} in a multi-question test. `;
      if (questionIndex > 0) {
        diversityInstruction += 'Please choose a DIFFERENT subject than previous questions to ensure diversity. ';
      }
    }

    const examInstruction = examPattern ? `This question should follow the pattern and format of ${examPattern} exam.` : '';

    const prompt = `Generate a ${difficulty} level question about ${topic}.
                    ${examInstruction}

                    IMPORTANT INSTRUCTIONS:
                    ${diversityInstruction}
                    1. If the topic contains multiple subjects (e.g., \"Math and Science\", \"History, Geography, and Literature\", etc.),
                       identify all the subjects and choose one randomly for this question to ensure a diverse mix of questions.
                    2. Make sure the question is detailed, clear, and appropriate for the ${difficulty} difficulty level.

                    Format the response as a VALID JSON object with the following structure:
                    {
                      \"question\": \"the question text\",
                      \"options\": [\"option1\", \"option2\", \"option3\", \"option4\"],
                      \"correctAnswer\": \"correct option\",
                      \"explanation\": \"explanation of the answer\"
                    }

                    IMPORTANT: Return ONLY the JSON object, without any markdown code blocks or extra text.
                    Do not include \`\`\`json or \`\`\` markers in your response.`;

    // Pollinations currently limits temperature for some provider backends.
    // Use 1.0 (default) to prevent 400 errors for unsupported temperatures.
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
      // use default temperature compatible with provider
      temperature: 1.0,
      max_tokens: 1000
    };

    // Optional bearer token for registered backends
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (process.env.POLLINATIONS_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.POLLINATIONS_TOKEN}`;
    }

    console.log('Sending payload to Pollinations:', JSON.stringify(payload).substring(0, 1000));
    const response = await axios.post('https://text.pollinations.ai/openai', payload, {
      headers
    });

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('No response received from Pollinations AI API');
    }

    const text = response.data.choices[0].message.content;
    console.log('Raw response from Pollinations AI API:', text?.substring(0, 100) + '...');

    try {
      let jsonText = text || '';

      if (jsonText.includes('```')) {
        const codeBlockMatch = jsonText.match(/```(?:json)?([\s\S]+?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          jsonText = codeBlockMatch[1].trim();
        } else {
          jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        }
      }

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

      console.log('Extracted JSON:', jsonText?.substring(0, 100) + '...');

      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Pollinations response:', text);
      throw new Error('Invalid response format from Pollinations AI API');
    }
    } catch (error: any) {
      // Log detailed axios response for easier debugging
      if (error.response) {
        console.error('Pollinations API response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        try {
          console.error('Pollinations error details:', JSON.stringify(error.response.data.details, null, 2));
        } catch (e) {
          // ignore
        }
      } else {
        console.error('Detailed error:', error?.message || error);
      }

      throw new Error(`Question generation failed: ${error?.message || 'Unknown error'}`);
  }
}
