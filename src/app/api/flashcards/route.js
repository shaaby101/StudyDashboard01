import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { content } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not set in environment variables." }, { status: 500 });
    }

    const systemPrompt = `You are an expert educational AI. Extract highly specific, useful flashcards from the provided text.
DO NOT ask generic questions like "What is the topic about?" or "Describe in one sentence".
Ask precise questions that test factual knowledge, definitions, or critical concepts mentioned in the text.
The answers must be descriptive but precise.
Return ONLY a valid JSON object with this exact structure:
{
  "flashcards": [
    { "q": "Specific question?", "a": "Precise answer." }
  ]
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Groq API error" }, { status: response.status });
    }

    const jsonStr = data.choices[0].message.content;
    const parsed = JSON.parse(jsonStr);

    return NextResponse.json({ flashcards: parsed.flashcards });
  } catch (error) {
    console.error("Flashcards API Error:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}
