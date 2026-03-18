import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResearchBody {
  question: string;
  history: Message[];
  context: {
    businessName: string;
    industry: string;
    businessStage: string;
    targetMarket: string;
    goals: string[];
    businessDescription: string;
  };
}

interface GeminiTextPart { text?: string }
interface GeminiCandidate { content?: { parts?: GeminiTextPart[] } }
interface GeminiResponse {
  error?: { message?: string };
  candidates?: GeminiCandidate[];
}

const buildPrompt = (body: ResearchBody): string => {
  const { question, history, context } = body;

  const historyText = history.length
    ? history
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n')
    : 'No prior conversation.';

  return `You are a Senior Industry Intelligence Analyst working exclusively for ${context.businessName}. You have deep expertise in ${context.industry} and you understand this business intimately.

BUSINESS CONTEXT:
- Business: ${context.businessName}
- Industry: ${context.industry}
- Stage: ${context.businessStage}
- Target Market: ${context.targetMarket}
- Goals: ${context.goals.join(', ')}
- Description: ${context.businessDescription}

CONVERSATION HISTORY:
${historyText}

CURRENT QUESTION:
${question}

INSTRUCTIONS:
- Answer as a trusted analyst who knows this business deeply
- Be specific — reference their industry, stage, and market in your answer
- Structure your response clearly with sections where appropriate
- Provide actionable recommendations, not just information
- If you cite statistics or trends, be specific about the context
- Keep responses comprehensive but scannable — use short paragraphs
- End with 2-3 specific next actions they can take

Answer the question now:`;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  const apiKey   = process.env.GEMINI_API_KEY;
  const demoMode = process.env.DEMO_MODE === '1' || process.env.DEMO_MODE === 'true';
  const body     = req.body as ResearchBody;

  if (!body?.question) {
    res.status(400).json({ error: 'Missing question' });
    return;
  }

  if (demoMode || !apiKey) {
    res.status(200).json({
      answer: `Great question about ${body.context.industry}. Based on ${body.context.businessName}'s current stage as a ${body.context.businessStage} in the ${body.context.targetMarket} market, here is my analysis:\n\n**Key Insight**\nThis is a demo response. Connect your Gemini API key to get real AI-powered research answers tailored specifically to your business.\n\n**What You Should Know**\nThe research chat feature allows you to ask any business or industry question and receive detailed, personalised answers that take into account your specific business context, goals, and market position.\n\n**Next Steps**\n1. Add your GEMINI_API_KEY to your environment variables\n2. Set DEMO_MODE=0\n3. Redeploy and ask your real question`,
      sources: [],
    });
    return;
  }

  try {
    const prompt = buildPrompt(body);

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 2048 },
      }),
    });

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;

    if (!data || !response.ok) {
      res.status(502).json({ error: data?.error?.message ?? 'Gemini API error' });
      return;
    }

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const answer = parts.map((p) => p.text).filter(Boolean).join('\n').trim();

    if (!answer) {
      res.status(502).json({ error: 'No response generated' });
      return;
    }

    res.status(200).json({ answer, sources: [] });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}