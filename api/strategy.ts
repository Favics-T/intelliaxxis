import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface StrategyBody {
  context: {
    businessName: string;
    industry: string;
    businessStage: string;
    revenueRange: string;
    targetMarket: string;
    goals: string[];
    biggestChallenge: string;
    competitors: string[];
    uniqueAdvantage: string;
    businessDescription: string;
  };
}

interface GeminiTextPart { text?: string }
interface GeminiCandidate { content?: { parts?: GeminiTextPart[] } }
interface GeminiResponse {
  error?: { message?: string };
  candidates?: GeminiCandidate[];
}

const buildPrompt = (body: StrategyBody): string => {
  const { context } = body;
  return `You are a Strategic Business Advisor with 20 years of experience helping ${context.businessStage} businesses in ${context.industry} grow. You have been briefed on this business and must generate highly specific, actionable strategic recommendations.

BUSINESS PROFILE:
- Business: ${context.businessName}
- Industry: ${context.industry}
- Stage: ${context.businessStage}
- Revenue: ${context.revenueRange}
- Market: ${context.targetMarket}
- Goals: ${context.goals.join(', ')}
- Biggest Challenge: ${context.biggestChallenge || 'Not specified'}
- Competitors: ${context.competitors.join(', ') || 'None specified'}
- Unique Advantage: ${context.uniqueAdvantage || 'Not specified'}
- Description: ${context.businessDescription}

Generate 5 strategic recommendations specifically for ${context.businessName}. Each must be directly tied to their goals, stage, and challenges. No generic advice.

Return ONLY valid JSON. No markdown, no backticks.

{
  "recommendations": [
    {
      "id": "<unique id e.g. rec-001>",
      "title": "<specific action-oriented title>",
      "rationale": "<2-3 sentences explaining why this recommendation matters for this specific business>",
      "whyItMatters": "<1-2 sentences on the direct impact on their goals>",
      "implementationSteps": [
        { "step": 1, "action": "<specific action>", "timeframe": "<e.g. Week 1-2>" },
        { "step": 2, "action": "<specific action>", "timeframe": "<e.g. Week 3-4>" },
        { "step": 3, "action": "<specific action>", "timeframe": "<e.g. Month 2>" }
      ],
      "effortLevel": "<Low | Medium | High>",
      "impactScore": <number 1-100>,
      "timeSensitivity": "<Immediate | This Week | This Month | This Quarter>",
      "status": "pending",
      "framework": "<strategic framework used e.g. Blue Ocean | Porter Five Forces | Jobs to Be Done | OKR | Growth Loops>",
      "createdAt": "<ISO date string>"
    }
  ]
}`;
};

const buildDemoData = (context: StrategyBody['context']) => ({
  recommendations: [
    {
      id: 'rec-001',
      title: `Establish a referral programme to reduce CAC for ${context.businessName}`,
      rationale: `For a ${context.businessStage} in ${context.industry}, customer acquisition cost is typically the biggest growth bottleneck. A structured referral programme leverages your existing customers to acquire new ones at a fraction of the cost of paid channels.`,
      whyItMatters: `This directly addresses the goal of expanding your customer base while reducing operational costs — two of your stated priorities.`,
      implementationSteps: [
        { step: 1, action: 'Identify your top 20 most satisfied customers and reach out personally', timeframe: 'Week 1' },
        { step: 2, action: 'Design a simple referral incentive — start with a discount or service credit', timeframe: 'Week 2' },
        { step: 3, action: 'Launch the programme and track referral conversion rate monthly', timeframe: 'Week 3-4' },
      ],
      effortLevel: 'Low',
      impactScore: 78,
      timeSensitivity: 'This Month',
      status: 'pending',
      framework: 'Growth Loops',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-002',
      title: `Define and own a specific niche within ${context.industry}`,
      rationale: `${context.businessName} is competing in a broad market. Narrowing focus to a specific niche allows you to dominate a segment before expanding, which is the most capital-efficient growth strategy for a ${context.businessStage}.`,
      whyItMatters: `This directly improves competitive positioning — your most important stated goal — and creates a defensible market position.`,
      implementationSteps: [
        { step: 1, action: 'Analyse your current customer base and identify the most profitable segment', timeframe: 'Week 1-2' },
        { step: 2, action: 'Build a specific value proposition and messaging for this niche', timeframe: 'Week 3-4' },
        { step: 3, action: 'Redirect 80% of marketing spend to this niche for 90 days and measure results', timeframe: 'Month 2' },
      ],
      effortLevel: 'Medium',
      impactScore: 85,
      timeSensitivity: 'This Quarter',
      status: 'pending',
      framework: 'Blue Ocean',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-003',
      title: 'Build a content engine to generate organic leads',
      rationale: `Content marketing is the highest ROI channel for ${context.businessStage} businesses with limited budgets. Creating valuable content that addresses your target customers' pain points builds trust and drives inbound leads.`,
      whyItMatters: 'This supports your revenue growth goal by creating a sustainable, low-cost lead generation channel that compounds over time.',
      implementationSteps: [
        { step: 1, action: 'Identify the top 10 questions your customers ask and turn each into a piece of content', timeframe: 'Week 1-2' },
        { step: 2, action: 'Publish 2 pieces of content per week on the platform where your customers spend time', timeframe: 'Month 1' },
        { step: 3, action: 'Track which content drives the most engagement and double down on that format', timeframe: 'Month 2-3' },
      ],
      effortLevel: 'Medium',
      impactScore: 72,
      timeSensitivity: 'This Month',
      status: 'pending',
      framework: 'Jobs to Be Done',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-004',
      title: `Map and close the top 3 competitive gaps against ${context.competitors[0] || 'key competitors'}`,
      rationale: 'Understanding exactly where your competitors are beating you allows you to make targeted investments that improve your win rate rather than spreading resources across everything.',
      whyItMatters: 'Closing even one significant competitive gap can meaningfully improve your conversion rate and competitive positioning.',
      implementationSteps: [
        { step: 1, action: 'Do a structured feature and positioning comparison against your top 3 competitors', timeframe: 'Week 1' },
        { step: 2, action: 'Survey 10 lost customers on why they chose a competitor over you', timeframe: 'Week 2' },
        { step: 3, action: 'Prioritise the top gap by impact and create a 60-day plan to close it', timeframe: 'Week 3-4' },
      ],
      effortLevel: 'Medium',
      impactScore: 80,
      timeSensitivity: 'This Month',
      status: 'pending',
      framework: 'Porter Five Forces',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rec-005',
      title: 'Implement OKRs to align team execution with growth goals',
      rationale: `As ${context.businessName} grows, execution alignment becomes the main bottleneck. OKRs create a clear connection between daily work and strategic goals, reducing wasted effort.`,
      whyItMatters: 'This directly improves operational efficiency — reducing the cost of misaligned effort and keeping the team focused on the highest-impact activities.',
      implementationSteps: [
        { step: 1, action: 'Define 3 company-level objectives for the next quarter with measurable key results', timeframe: 'Week 1' },
        { step: 2, action: 'Cascade objectives to each team member with individual key results', timeframe: 'Week 2' },
        { step: 3, action: 'Hold a weekly 30-minute OKR review to track progress and remove blockers', timeframe: 'Ongoing' },
      ],
      effortLevel: 'Low',
      impactScore: 70,
      timeSensitivity: 'This Week',
      status: 'pending',
      framework: 'OKR',
      createdAt: new Date().toISOString(),
    },
  ],
});

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
  const body     = req.body as StrategyBody;

  if (!body?.context) {
    res.status(400).json({ error: 'Missing context' });
    return;
  }

  if (demoMode || !apiKey) {
    res.status(200).json(buildDemoData(body.context));
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
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
      }),
    });

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;

    if (!data || !response.ok) {
      res.status(200).json(buildDemoData(body.context));
      return;
    }

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const raw   = parts.map((p) => p.text).filter(Boolean).join('\n').trim();

    if (!raw) {
      res.status(200).json(buildDemoData(body.context));
      return;
    }

    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    try {
      res.status(200).json(JSON.parse(cleaned));
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        res.status(200).json(JSON.parse(match[0]));
      } else {
        res.status(200).json(buildDemoData(body.context));
      }
    }
  } catch {
    res.status(200).json(buildDemoData(body.context));
  }
}