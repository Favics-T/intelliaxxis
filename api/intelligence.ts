import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface BusinessContext {
  businessName: string;
  industry: string;
  subSector?: string;
  businessStage: string;
  revenueRange: string;
  teamSize: string;
  goals: string[];
  biggestChallenge?: string;
  targetMarket: string;
  geographies: string[];
  customerDescription?: string;
  competitors: string[];
  uniqueAdvantage?: string;
  businessDescription: string;
  productsServices?: string;
}

interface GeminiTextPart { text?: string }
interface GeminiCandidate { content?: { parts?: GeminiTextPart[] } }
interface GeminiResponse {
  error?: { message?: string };
  candidates?: GeminiCandidate[];
}

const buildPrompt = (context: BusinessContext): string => {
  const competitorsList = context.competitors.length
    ? context.competitors.join(', ')
    : 'None specified';

  const goalsList = context.goals.length
    ? context.goals.join(', ')
    : 'Not specified';

  return `You are a Senior Industry Intelligence Analyst with 20 years of experience advising business owners. Your job is to generate a detailed, personalised industry intelligence report for the business described below.

BUSINESS PROFILE:
- Business Name: ${context.businessName}
- Industry: ${context.industry}${context.subSector ? ` / ${context.subSector}` : ''}
- Stage: ${context.businessStage}
- Revenue: ${context.revenueRange}
- Team Size: ${context.teamSize}
- Target Market: ${context.targetMarket}
- Geographies: ${context.geographies.join(', ') || 'Not specified'}
- Business Goals: ${goalsList}
- Known Competitors: ${competitorsList}
- Unique Advantage: ${context.uniqueAdvantage || 'Not specified'}
- Customer Description: ${context.customerDescription || 'Not specified'}
- Biggest Challenge: ${context.biggestChallenge || 'Not specified'}
- Business Description: ${context.businessDescription}
- Products/Services: ${context.productsServices || 'Not specified'}

YOUR TASK:
Generate 6 highly specific, actionable industry intelligence signals for this business. Each signal must be directly relevant to their industry, stage, geography, and goals. Do NOT generate generic signals. Every signal must feel like it was written specifically for ${context.businessName}.

Return ONLY a valid JSON object. No markdown, no backticks, no preamble.

{
  "summary": "<2-3 sentence executive summary of the most important intelligence for this business right now>",
  "signals": [
    {
      "id": "<unique string id e.g. sig-001>",
      "headline": "<specific, punchy headline — max 12 words>",
      "summary": "<2-3 sentence summary of what is happening>",
      "fullAnalysis": "<detailed 4-6 sentence analysis of this trend or development>",
      "whyItMatters": "<1-2 sentences explaining specifically why this matters to ${context.businessName}>",
      "strategicImplication": "<1-2 sentences on the strategic implication for this business>",
      "category": "<one of: Market Trend | Competitor Move | Regulation | Technology | Consumer Behavior | Economic Signal | Opportunity>",
      "impactLevel": "<one of: Critical | High | Medium | Low>",
      "trajectory": "<one of: Emerging | Accelerating | Plateauing | Declining>",
      "recommendedActions": ["<specific action 1>", "<specific action 2>", "<specific action 3>"],
      "industry": "${context.industry}",
      "createdAt": "<ISO date string>",
      "saved": false,
      "dismissed": false
    }
  ]
}

Generate exactly 6 signals. Mix categories — include at least one Opportunity, one potential threat, and one Technology signal. Make every signal specific to their business context.`;
};

const buildDemoData = (context: BusinessContext) => ({
  summary: `The ${context.industry} industry is experiencing significant shifts driven by AI adoption and changing consumer expectations. For ${context.businessName}, the most critical developments are around technology integration and competitive positioning in the ${context.targetMarket} market.`,
  signals: [
    {
      id: 'sig-001',
      headline: `AI automation reshaping ${context.industry} operations`,
      summary: `AI tools are being rapidly adopted across the ${context.industry} sector, with early adopters reporting 30-40% efficiency gains. Businesses that delay adoption risk falling behind competitors who are already automating key workflows.`,
      fullAnalysis: `The adoption of AI in ${context.industry} has crossed the early adopter phase and is now entering mainstream deployment. Key areas include customer service automation, data analysis, and operational workflows. Businesses in the ${context.targetMarket} market are seeing competitive pressure to adopt these tools or risk losing market share to more efficient competitors.`,
      whyItMatters: `For ${context.businessName}, this represents both a risk and an opportunity — early adoption could significantly reduce operational costs and improve service delivery.`,
      strategicImplication: `Delaying AI integration by more than 6 months puts ${context.businessName} at a measurable disadvantage against competitors who are already deploying these tools.`,
      category: 'Technology',
      impactLevel: 'High',
      trajectory: 'Accelerating',
      recommendedActions: [
        `Audit current workflows in ${context.industry} that could benefit from AI automation`,
        'Allocate a small budget to pilot one AI tool within the next 30 days',
        'Track competitor adoption of AI tools and document their reported outcomes',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-002',
      headline: `Consumer expectations rising in ${context.targetMarket} market`,
      summary: `Customers in ${context.targetMarket} are increasingly demanding faster service, greater transparency, and personalised experiences. Businesses failing to meet these expectations are seeing higher churn rates.`,
      fullAnalysis: `Research across ${context.targetMarket} markets shows a significant shift in consumer expectations over the past 12 months. Speed, personalisation, and transparency are now baseline expectations rather than differentiators. For businesses in ${context.industry}, this means the cost of not meeting these expectations is higher churn and reduced word-of-mouth referrals.`,
      whyItMatters: `${context.businessName}'s customers are part of this broader trend — understanding their evolving expectations is critical to retention and growth.`,
      strategicImplication: `Investing in customer experience improvements now will deliver compounding returns as expectations continue to rise across the ${context.targetMarket} market.`,
      category: 'Consumer Behavior',
      impactLevel: 'High',
      trajectory: 'Accelerating',
      recommendedActions: [
        'Survey your top 20 customers on their biggest frustrations within 2 weeks',
        'Identify the top 3 experience gaps and create a 90-day improvement plan',
        'Implement a simple NPS tracking system to monitor satisfaction trends',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-003',
      headline: `New market opportunity emerging for ${context.businessStage} businesses`,
      summary: `A gap in the market is emerging that aligns directly with ${context.businessName}'s current positioning. Early movers in this space are gaining significant traction with minimal competition.`,
      fullAnalysis: `Analysis of the ${context.industry} market reveals an underserved segment that aligns with ${context.businessName}'s capabilities and target customer profile. This opportunity is currently being overlooked by larger incumbents who are focused on their existing customer base. ${context.businessStage} businesses with agility and proximity to customers are best positioned to capture this segment.`,
      whyItMatters: `This opportunity directly aligns with ${context.businessName}'s goal of ${context.goals[0] || 'growing the business'} and could provide a meaningful revenue boost within 6 months.`,
      strategicImplication: `Moving on this opportunity within the next 60 days gives ${context.businessName} a first-mover advantage before larger competitors identify the gap.`,
      category: 'Opportunity',
      impactLevel: 'High',
      trajectory: 'Emerging',
      recommendedActions: [
        'Conduct 10 discovery interviews with potential customers in this segment within 3 weeks',
        'Create a simple landing page to test demand before full product development',
        'Define the minimum viable offer needed to serve this segment profitably',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-004',
      headline: `Regulatory changes impacting ${context.industry} compliance requirements`,
      summary: `New regulations affecting the ${context.industry} sector are coming into effect, with significant implications for businesses operating in ${context.targetMarket}. Non-compliance carries financial and reputational risk.`,
      fullAnalysis: `Regulatory bodies overseeing ${context.industry} are tightening compliance requirements, particularly around data handling, consumer protection, and operational standards. Businesses in ${context.targetMarket} have a limited window to adapt their operations. The cost of non-compliance — both financial penalties and reputational damage — significantly outweighs the cost of proactive adaptation.`,
      whyItMatters: `${context.businessName} needs to assess its current compliance posture against these new requirements to avoid disruption to operations.`,
      strategicImplication: `Proactive compliance positions ${context.businessName} as a trusted operator and can become a competitive differentiator when marketing to risk-conscious customers.`,
      category: 'Regulation',
      impactLevel: 'Medium',
      trajectory: 'Accelerating',
      recommendedActions: [
        'Schedule a compliance review with a legal advisor familiar with your industry',
        'Document current data handling and operational practices against new requirements',
        'Create a compliance roadmap with clear milestones and ownership',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-005',
      headline: `Competitor activity intensifying in ${context.targetMarket}`,
      summary: `Key competitors in the ${context.industry} space are increasing their investment in ${context.targetMarket}, signalling growing confidence in the market opportunity. This is raising the competitive bar for all players.`,
      fullAnalysis: `Competitor analysis reveals increased activity in ${context.targetMarket} from established players in ${context.industry}. This includes new product launches, increased marketing spend, and talent acquisition. The competitive intensity suggests the market opportunity is validated but also means ${context.businessName} needs a clearer differentiation strategy to maintain and grow its position.`,
      whyItMatters: `With ${context.competitors.length > 0 ? context.competitors.slice(0, 2).join(' and ') : 'key competitors'} increasing investment, ${context.businessName} risks being squeezed unless it sharpens its positioning.`,
      strategicImplication: `The window for establishing a defensible market position in ${context.targetMarket} is narrowing — differentiation strategy needs to be clarified and communicated within 90 days.`,
      category: 'Competitor Move',
      impactLevel: 'Medium',
      trajectory: 'Accelerating',
      recommendedActions: [
        'Create a detailed competitive matrix comparing your offering against top 3 competitors',
        'Identify 2-3 areas where you can out-compete on service, speed, or price',
        'Develop a clear one-sentence differentiation statement and test it with 5 customers',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-006',
      headline: `Economic conditions creating headwinds for ${context.revenueRange} businesses`,
      summary: `Macroeconomic conditions are creating specific challenges for businesses at the ${context.revenueRange} revenue stage, particularly around customer acquisition costs and operational expenses.`,
      fullAnalysis: `Current economic conditions — including inflation pressures, currency fluctuations in ${context.targetMarket}, and tightening consumer spending — are disproportionately affecting businesses at the ${context.revenueRange} revenue stage. The key risks are rising customer acquisition costs, longer sales cycles, and pressure on margins. Businesses that proactively adapt their cost structure and value proposition now will be better positioned when conditions ease.`,
      whyItMatters: `${context.businessName}'s current stage makes it particularly exposed to these economic pressures — having a clear plan to navigate them is critical.`,
      strategicImplication: `Focusing on customer retention and reducing CAC through referral and organic channels will protect margins better than increased paid acquisition spend in the current environment.`,
      category: 'Economic Signal',
      impactLevel: 'Medium',
      trajectory: 'Plateauing',
      recommendedActions: [
        'Review your unit economics and identify the top 3 cost reduction opportunities',
        'Launch a customer referral programme to reduce reliance on paid acquisition',
        'Model 3 revenue scenarios (base, downside, recovery) to stress-test your runway',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
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
  const context  = req.body?.context as BusinessContext | undefined;

  if (!context) {
    res.status(400).json({ error: 'Missing business context' });
    return;
  }

  if (demoMode || !apiKey) {
    res.status(200).json(buildDemoData(context));
    return;
  }

  try {
    const prompt = buildPrompt(context);

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
      }),
    });

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;

    if (!data) {
      res.status(200).json(buildDemoData(context));
      return;
    }

    if (!response.ok) {
      const message = data.error?.message ?? '';
      const isQuota =
        message.toLowerCase().includes('quota') ||
        message.toLowerCase().includes('rate limit');
      if (isQuota) {
        res.status(200).json(buildDemoData(context));
        return;
      }
      res.status(502).json({ error: message || 'Gemini API error' });
      return;
    }

    const parts  = data.candidates?.[0]?.content?.parts ?? [];
    const raw    = parts.map((p) => p.text).filter(Boolean).join('\n').trim();

    if (!raw) {
      res.status(200).json(buildDemoData(context));
      return;
    }

    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      res.status(200).json(parsed);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        res.status(200).json(JSON.parse(match[0]));
      } else {
        res.status(200).json(buildDemoData(context));
      }
    }
  } catch {
    res.status(200).json(buildDemoData(context));
  }
}