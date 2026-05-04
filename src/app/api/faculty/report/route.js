import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { facultyName, department, subjects } = await request.json();

    const prompt = `
      You are an AI Academic Analyst for the Studesh platform. 
      Generate a "Class Engagement & Success Pulse Report" for ${facultyName} in the ${department} department.
      
      The faculty teaches: ${subjects.join(', ')}.
      
      Current Class Stats (Mock):
      - Average Attendance: 84.2%
      - Top Performing Subject: ${subjects[0]} (Avg Score: 88/100)
      - Most Asked Question: "How to implement AVL rotations?"
      - Students at Risk: 3 (Attendance below 75%)
      
      Provide a detailed report in Markdown format with the following sections:
      1. Executive Summary
      2. Subject-wise Analysis
      3. Engagement Trends
      4. Actionable Recommendations for ${facultyName}
      
      Keep the tone professional, encouraging, and data-driven.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      return NextResponse.json({ error: 'Groq API failed', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    console.log('Groq Response received successfully');
    const reportContent = data.choices?.[0]?.message?.content || "Report generation failed. Please try again.";

    return NextResponse.json({ report: reportContent });
  } catch (error) {
    console.error('Report Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
