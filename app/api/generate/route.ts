import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subjects, questionCount } = body;

    if (!subjects || !questionCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const systemPrompt = `You are an expert educational quiz generator. 
Generate exactly ${questionCount} multiple-choice questions on the topic(s): ${subjects}.
Return ONLY valid JSON in this exact structure, with no extra text or markdown code blocks:
{
  "questions": [
    {
      "question": "The question text here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0, // an integer 0-3 representing the index of the correct option
      "explanation": "Brief explanation of why the answer is correct."
    }
  ]
}
Do not use markdown blocks like \`\`\`json. Return raw JSON.`;

    const prompt = `Generate a ${questionCount}-question quiz about ${subjects}.`;

    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?system=${encodeURIComponent(systemPrompt)}&json=true&model=openai`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Pollinations API returned ${response.status}`);
    }

    let textResponse = await response.text();
    
    // Clean up potential markdown blocks if present
    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.replace(/^```json/, "").replace(/```$/, "");
    } else if (textResponse.startsWith("```")) {
      textResponse = textResponse.replace(/^```/, "").replace(/```$/, "");
    }
    
    const parsed = JSON.parse(textResponse.trim());
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
