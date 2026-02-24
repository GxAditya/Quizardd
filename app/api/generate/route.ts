import { NextResponse } from "next/server";

const POLLINATIONS_API_BASE_URL =
  process.env.POLLINATIONS_API_BASE_URL ?? "https://gen.pollinations.ai";
const POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL ?? "openai";
const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY;

export async function POST(request: Request) {
  if (!POLLINATIONS_API_KEY) {
    return NextResponse.json(
      { error: "Server misconfiguration: POLLINATIONS_API_KEY is not set." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { subjects, questionCount } = body;

    if (!subjects || !questionCount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert educational quiz generator. 
Generate exactly ${questionCount} multiple-choice questions on the topic(s): ${subjects}.
Return ONLY valid JSON in this exact structure, with no extra text or markdown code blocks:
{
  "questions": [
    {
      "question": "The question text here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why the answer is correct."
    }
  ]
}
Do not use markdown blocks like \`\`\`json. Return raw JSON.`;

    const response = await fetch(
      `${POLLINATIONS_API_BASE_URL}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${POLLINATIONS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: POLLINATIONS_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Generate a ${questionCount}-question quiz about ${subjects}.`,
            },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pollinations API error:", response.status, errorText);
      throw new Error(`Pollinations API returned ${response.status}`);
    }

    const data = await response.json();

    // Extract the content from the OpenAI-compatible response shape
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Pollinations API");
    }

    // Content is already JSON (json_object mode), parse it
    let parsed: unknown;
    try {
      parsed = typeof content === "string" ? JSON.parse(content) : content;
    } catch {
      throw new Error("Failed to parse model response as JSON");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}
