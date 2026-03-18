import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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

  return `You are a Senior Industry Intelligence Analyst with 20 years of experience advising business owners. Generate a detailed, personalised industry intelligence report for this business.

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

Generate 6 highly specific, actionable industry intelligence signals for this business. Every signal must feel written specifically for ${context.businessName}.

Return ONLY valid JSON. No markdown, no backticks, no preamble.

{
  "summary": "<2-3 sentence executive summary of the most important intelligence for this business right now>",
  "signals": [
    {
      "id": "sig-001",
      "headline": "<specific punchy headline max 12 words>",
      "summary": "<2-3 sentence summary of what is happening>",
      "fullAnalysis": "<detailed 4-6 sentence analysis>",
      "whyItMatters": "<1-2 sentences why this matters specifically to ${context.businessName}>",
      "strategicImplication": "<1-2 sentences on strategic implication>",
      "category": "<Market Trend | Competitor Move | Regulation | Technology | Consumer Behavior | Economic Signal | Opportunity>",
      "impactLevel": "<Critical | High | Medium | Low>",
      "trajectory": "<Emerging | Accelerating | Plateauing | Declining>",
      "recommendedActions": ["<action 1>", "<action 2>", "<action 3>"],
      "industry": "${context.industry}",
      "createdAt": "${new Date().toISOString()}",
      "saved": false,
      "dismissed": false
    }
  ]
}

Generate exactly 6 signals. Include at least one Opportunity, one Technology, and one threat signal.`;
};

const buildDemoData = (context: BusinessContext) => ({
  summary: `The ${context.industry} industry is experiencing significant shifts driven by AI adoption and changing consumer expectations. For ${context.businessName}, the most critical developments are around technology integration and competitive positioning in the ${context.targetMarket} market.`,
  signals: [
    {
      id: 'sig-001',
      headline: `AI automation reshaping ${context.industry} operations globally`,
      summary: `AI tools are being rapidly adopted across the ${context.industry} sector, with early adopters reporting 30-40% efficiency gains. Businesses that delay adoption risk falling behind competitors already automating key workflows.`,
      fullAnalysis: `The adoption of AI in ${context.industry} has crossed the early adopter phase and is now entering mainstream deployment. Key areas include customer service automation, data analysis, and operational workflows. Businesses in the ${context.targetMarket} market are seeing competitive pressure to adopt these tools or risk losing market share to more efficient competitors. The cost of AI tools has dropped significantly making them accessible even to ${context.businessStage} businesses.`,
      whyItMatters: `For ${context.businessName}, this represents both a risk and an opportunity — early adoption could significantly reduce operational costs and improve service delivery.`,
      strategicImplication: `Delaying AI integration by more than 6 months puts ${context.businessName} at a measurable disadvantage against competitors already deploying these tools.`,
      category: 'Technology',
      impactLevel: 'High',
      trajectory: 'Accelerating',
      recommendedActions: [
        `Audit current ${context.industry} workflows that could benefit from AI automation`,
        'Allocate budget to pilot one AI tool within the next 30 days',
        'Track competitor AI adoption and document their reported outcomes',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-002',
      headline: `Consumer expectations rising sharply in ${context.targetMarket}`,
      summary: `Customers in ${context.targetMarket} are demanding faster service, greater transparency, and personalised experiences. Businesses failing to meet these expectations are seeing higher churn rates.`,
      fullAnalysis: `Research across ${context.targetMarket} markets shows a significant shift in consumer expectations over the past 12 months. Speed, personalisation, and transparency are now baseline expectations rather than differentiators. For businesses in ${context.industry}, this means the cost of not meeting these expectations is higher churn and reduced referrals.`,
      whyItMatters: `${context.businessName}'s customers are part of this broader trend — understanding their evolving expectations is critical to retention and growth.`,
      strategicImplication: `Investing in customer experience improvements now will deliver compounding returns as expectations continue to rise.`,
      category: 'Consumer Behavior',
      impactLevel: 'High',
      trajectory: 'Accelerating',
      recommendedActions: [
        'Survey your top 20 customers on their biggest frustrations this week',
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
      headline: `Underserved market segment emerging for ${context.businessStage} businesses`,
      summary: `A gap in the ${context.industry} market is emerging that aligns with ${context.businessName}'s positioning. Early movers are gaining traction with minimal competition.`,
      fullAnalysis: `Analysis of the ${context.industry} market reveals an underserved segment that aligns with ${context.businessName}'s capabilities and target customer profile. This opportunity is being overlooked by larger incumbents focused on their existing base. ${context.businessStage} businesses with agility are best positioned to capture this segment.`,
      whyItMatters: `This opportunity directly aligns with your goal of ${context.goals[0] || 'growing the business'} and could provide meaningful revenue within 6 months.`,
      strategicImplication: `Moving within the next 60 days gives ${context.businessName} a first-mover advantage before larger competitors identify the gap.`,
      category: 'Opportunity',
      impactLevel: 'High',
      trajectory: 'Emerging',
      recommendedActions: [
        'Conduct 10 discovery interviews with potential customers in this segment within 3 weeks',
        'Create a simple landing page to test demand before full development',
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
      summary: `New regulations affecting ${context.industry} are coming into effect with significant implications for businesses in ${context.targetMarket}.`,
      fullAnalysis: `Regulatory bodies overseeing ${context.industry} are tightening compliance requirements around data handling, consumer protection, and operational standards. Businesses in ${context.targetMarket} have a limited window to adapt. The cost of non-compliance significantly outweighs the cost of proactive adaptation.`,
      whyItMatters: `${context.businessName} needs to assess its current compliance posture against new requirements to avoid disruption.`,
      strategicImplication: `Proactive compliance positions ${context.businessName} as a trusted operator and becomes a competitive differentiator.`,
      category: 'Regulation',
      impactLevel: 'Medium',
      trajectory: 'Accelerating',
      recommendedActions: [
        'Schedule a compliance review with a legal advisor familiar with your industry',
        'Document current data handling practices against new requirements',
        'Create a compliance roadmap with clear milestones and ownership',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-005',
      headline: `Competitor activity intensifying in ${context.targetMarket} market`,
      summary: `Key competitors in ${context.industry} are increasing investment in ${context.targetMarket}, raising the competitive bar for all players.`,
      fullAnalysis: `Competitor analysis reveals increased activity in ${context.targetMarket} from established ${context.industry} players. This includes new product launches, increased marketing spend, and talent acquisition. The competitive intensity validates the market opportunity but means ${context.businessName} needs a sharper differentiation strategy.`,
      whyItMatters: `With ${context.competitors.length > 0 ? context.competitors.slice(0, 2).join(' and ') : 'key competitors'} increasing investment, ${context.businessName} risks losing ground without a clear differentiation play.`,
      strategicImplication: `The window for establishing a defensible market position in ${context.targetMarket} is narrowing — differentiation strategy needs clarifying within 90 days.`,
      category: 'Competitor Move',
      impactLevel: 'Medium',
      trajectory: 'Accelerating',
      recommendedActions: [
        'Create a competitive matrix comparing your offering against top 3 competitors',
        'Identify 2-3 areas where you can decisively out-compete',
        'Develop a clear one-sentence differentiation statement and test with 5 customers',
      ],
      industry: context.industry,
      createdAt: new Date().toISOString(),
      saved: false,
      dismissed: false,
    },
    {
      id: 'sig-006',
      headline: `Economic conditions creating headwinds for growing businesses`,
      summary: `Macroeconomic conditions are creating specific challenges for ${context.revenueRange} businesses in ${context.targetMarket}.`,
      fullAnalysis: `Current economic conditions including inflation pressures and tightening consumer spending are disproportionately affecting businesses at the ${context.revenueRange} revenue stage. Key risks are rising customer acquisition costs, longer sales cycles, and margin pressure. Businesses that adapt their cost structure and double down on retention will be better positioned when conditions improve.`,
      whyItMatters: `${context.businessName}'s current stage makes it particularly exposed to these pressures — having a clear plan protects your runway.`,
      strategicImplication: `Focusing on retention and reducing CAC through referral and organic channels will protect margins better than increased paid acquisition.`,
      category: 'Economic Signal',
      impactLevel: 'Medium',
      trajectory: 'Plateauing',
      recommendedActions: [
        'Review unit economics and identify top 3 cost reduction opportunities',
        'Launch a customer referral programme to reduce paid acquisition reliance',
        'Model 3 revenue scenarios to stress-test your runway',
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
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(context) }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
      }),
    });

    const data = (await response.json().catch(() => null)) as GeminiResponse | null;

    if (!data || !response.ok) {
      res.status(200).json(buildDemoData(context));
      return;
    }

    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const raw   = parts
      .map((p) => p.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!raw) {
      res.status(200).json(buildDemoData(context));
      return;
    }

    const cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    try {
      res.status(200).json(JSON.parse(cleaned));
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