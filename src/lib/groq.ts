import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

const LANG_PROMPTS: Record<string, string> = {
  english: 'Respond in English.',
  hindi: 'Respond in Hindi (हिंदी में जवाब दें).',
  tamil: 'Respond in Tamil (தமிழில் பதிலளிக்கவும்).',
  telugu: 'Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి).',
};

export async function analyzeWrongAnswer(
  questionText: string,
  subject: string,
  topic: string,
  correctAnswer: string,
  language: string = 'english'
) {
  try {
    const prompt = `You are VIDYA, an expert JEE/NEET tutor. ${LANG_PROMPTS[language] || LANG_PROMPTS.english}

A student got this question wrong:
QUESTION: ${questionText}
SUBJECT: ${subject}
TOPIC: ${topic}  
CORRECT ANSWER: ${correctAnswer}

Analyze the mistake and respond ONLY in this JSON format (no markdown):
{
  "error_type": "concept_error",
  "confidence": 0.85,
  "misconception": "One sentence describing the exact mistake",
  "explanation": "2-3 sentences explaining the concept clearly",
  "memory_tip": "One catchy trick to remember this",
  "suggested_concepts": ["Concept 1", "Concept 2"]
}

error_type must be: concept_error, formula_error, procedure_error, calculation_error, or guessing`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: MODEL,
      temperature: 0.3,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content?.trim() || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (err) {
    console.error('Groq analysis error:', err);
    return null;
  }
}

export async function answerDoubt(
  questionText: string,
  subject: string,
  topic: string,
  studentQuestion: string,
  language: string = 'english',
  chatHistory: { role: string; content: string }[] = []
) {
  try {
    const historyContext = chatHistory
      .slice(-6)
      .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n');

    const messages: any[] = [
      {
        role: 'system',
        content: `You are VIDYA, a friendly expert JEE/NEET tutor. ${LANG_PROMPTS[language] || LANG_PROMPTS.english}
Context: Student is studying ${subject} - ${topic}.
${questionText ? `Related Question: ${questionText}` : ''}
Be helpful, encouraging, show step-by-step working for math/physics. Keep under 200 words. End with a follow-up question.`,
      },
    ];

    if (historyContext) {
      messages.push({ role: 'user', content: `Previous conversation:\n${historyContext}` });
      messages.push({ role: 'assistant', content: 'I understand the context. How can I help?' });
    }

    messages.push({ role: 'user', content: studentQuestion });

    const completion = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  } catch (err) {
    console.error('Doubt error:', err);
    throw new Error('AI temporarily unavailable');
  }
}

export async function generateHint(
  questionText: string,
  subject: string,
  topic: string,
  hintLevel: number,
  language: string = 'english'
) {
  const levels: Record<number, string> = {
    1: 'Give a very subtle hint — just name the concept or formula, nothing more.',
    2: 'Give a medium hint — mention the approach and first step.',
    3: 'Give a strong hint — show the setup but not the final answer.',
  };

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `You are a JEE/NEET tutor. ${LANG_PROMPTS[language] || LANG_PROMPTS.english}
${levels[hintLevel] || levels[1]}
Question: ${questionText}
Subject: ${subject}, Topic: ${topic}
Give ONLY the hint in under 50 words.`,
      },
    ],
    model: MODEL,
    temperature: 0.5,
    max_tokens: 150,
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}

export async function analyzeMockTestResult(
  testType: string,
  totalCorrect: number,
  totalAttempted: number,
  totalMarks: number,
  maxMarks: number,
  weakTopics: string[],
  strongTopics: string[],
  language: string = 'english'
) {
  try {
    const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `You are VIDYA, an expert ${testType} coach. ${LANG_PROMPTS[language] || LANG_PROMPTS.english}

Student mock test results:
- Score: ${totalMarks}/${maxMarks}
- Accuracy: ${accuracy}%
- Attempted: ${totalAttempted} questions
- Weak topics: ${weakTopics.slice(0, 3).join(', ')}
- Strong topics: ${strongTopics.slice(0, 3).join(', ')}

Write 3 sentences of specific, actionable advice to improve. Be direct, honest, and encouraging.`,
        },
      ],
      model: MODEL,
      temperature: 0.6,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  } catch {
    return `You scored ${totalMarks}/${maxMarks} with ${Math.round((totalCorrect / Math.max(totalAttempted, 1)) * 100)}% accuracy. Focus on your weak topics and keep practising!`;
  }
}
