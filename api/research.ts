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
  const demoAnswers: Record<string, string> = {
    jumia: `**Situation Assessment**\nJumia's entry into Lagos grocery delivery is a serious competitive threat — but it's also a signal that validates your market. Here's what FreshCart should do in the next 30 days:\n\n**Week 1 — Don't Panic, Gather Intelligence**\nBefore reacting, understand exactly what Jumia is offering. Order from them 3-4 times across different neighbourhoods and document: actual delivery time vs. promised, product quality, packaging, customer service responsiveness, and pricing. You cannot out-compete what you haven't benchmarked.\n\n**Week 2 — Activate Your Moat**\nJumia's strength is breadth and brand. FreshCart's strength is depth and locality. This week, reach out personally to your top 50 customers. Don't pitch — just check in, ask for feedback, and remind them you exist. Churning customers back from Jumia is 5x harder than preventing them from leaving in the first place.\n\n**Week 3 — Launch Your Counter-Positioning**\nAnnounce FreshCart's "Local First" promise publicly: faster delivery, fresher produce, local supplier partnerships. Back it with a 20-minute delivery guarantee in your strongest zones. Jumia cannot operationally match hyperlocal speed — this is your wedge.\n\n**Week 4 — Go After B2B**\nJumia will focus on consumer volume. FreshCart should open a corporate accounts channel targeting Lagos companies with 50+ employees. One corporate account = 200 B2C customers in monthly revenue. Jumia's sales team is not calling HR managers — yours should be.\n\n**The Bottom Line**\nJumia entering your market means you were right about the opportunity. The businesses that survive well-funded competitor entry are the ones that go deeper into their niche rather than trying to match scale for scale. FreshCart's path is speed, locality, and quality — not price.`,

    default: `**Analysis for ${body.context.businessName}**\n\nBased on your position as a ${body.context.businessStage} in the ${body.context.industry} space targeting the ${body.context.targetMarket} market, here is my assessment:\n\n**Current Market Position**\nYou are operating in a high-growth segment with significant opportunity ahead. The key variables that will determine your trajectory over the next 12 months are customer acquisition efficiency, operational scalability, and competitive differentiation.\n\n**Key Strategic Insight**\nBusinesses at your stage typically face a critical fork: compete broadly and burn capital, or go deep into a specific niche and build a defensible position. Given your current revenue range and team size, the data strongly favours the niche approach — own a specific customer segment completely before expanding.\n\n**What Your Competitors Are Missing**\nMost competitors in ${body.context.industry} are optimising for volume. The gap they leave is in quality, personalisation, and customer relationships — exactly where a ${body.context.businessStage} can win.\n\n**Recommended Actions**\n1. Identify your top 20% of customers by revenue and interview them this week — they will tell you exactly what to double down on\n2. Map the one thing you do better than anyone else and make it the centrepiece of your marketing\n3. Set a 90-day target for a single metric that matters most — whether that's CAC, NPS, or revenue per customer\n\n**Bottom Line**\nYou have the right foundation. The question is not whether the opportunity exists — it clearly does. The question is how fast you can move to establish a position that is genuinely hard to replicate.`,
  };

  const question = body.question.toLowerCase();
  const answer = question.includes('jumia') || question.includes('competitor') || question.includes('competition')
    ? demoAnswers.jumia
    : demoAnswers.default;

  res.status(200).json({ answer, sources: [] });
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