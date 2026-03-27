import type { VercelRequest, VercelResponse } from '@vercel/node';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  relevanceScore: number;
}

interface NewsApiArticle {
  title?: string;
  description?: string;
  url?: string;
  source?: { name?: string };
  publishedAt?: string;
}

interface NewsApiResponse {
  status: string;
  articles?: NewsApiArticle[];
  message?: string;
}

const INDUSTRY_KEYWORDS: Record<string, string> = {
  'Technology':              'technology OR software OR AI OR startup',
  'Fintech':                 'fintech OR payments OR banking OR cryptocurrency',
  'E-commerce':              'ecommerce OR "online retail" OR delivery OR marketplace',
  'Healthcare':              'healthcare OR medtech OR health OR medical',
  'Education':               'edtech OR education OR learning OR schools',
  'Logistics':               'logistics OR "supply chain" OR delivery OR shipping',
  'Food & Beverage':         'food OR beverage OR restaurant OR "food delivery"',
  'Fashion & Apparel':       'fashion OR apparel OR clothing OR retail',
  'Real Estate':             '"real estate" OR property OR housing OR construction',
  'Manufacturing':           'manufacturing OR industry OR production OR factory',
  'Media & Entertainment':   'media OR entertainment OR streaming OR content',
  'Agriculture':             'agriculture OR farming OR agritech OR food',
  'Energy':                  'energy OR solar OR renewable OR oil',
  'Professional Services':   'consulting OR "professional services" OR advisory',
  'Retail':                  'retail OR consumer OR shopping OR store',
};

const buildDemoNews = (industry: string): NewsArticle[] => [
  {
    id: 'news-001',
    title: `AI adoption accelerating across ${industry} sector in 2026`,
    description: `New research shows ${industry} companies are increasing AI investment by 45% year-on-year, with early adopters reporting significant efficiency gains and competitive advantages over peers who have delayed adoption.`,
    url: '#',
    source: 'TechCrunch',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 95,
  },
  {
    id: 'news-002',
    title: `Funding activity in ${industry} reaches 18-month high`,
    description: `Venture capital investment in ${industry} startups surged last quarter, with investors showing renewed confidence in the sector. Deal sizes are increasing and valuations are stabilising after two years of correction.`,
    url: '#',
    source: 'Bloomberg',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 88,
  },
  {
    id: 'news-003',
    title: `Consumer behaviour shifts creating new opportunities in ${industry}`,
    description: `A comprehensive study of 10,000 consumers reveals significant shifts in purchasing patterns and service expectations within the ${industry} space, pointing to underserved segments that early movers can capture.`,
    url: '#',
    source: 'Reuters',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 82,
  },
  {
    id: 'news-004',
    title: `Regulatory landscape shifting for ${industry} operators`,
    description: `Policymakers are finalising new frameworks that will affect how ${industry} businesses operate, with compliance requirements expected to increase costs for unprepared operators while creating barriers to entry for new competitors.`,
    url: '#',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 79,
  },
  {
    id: 'news-005',
    title: `African ${industry} market outpacing global growth projections`,
    description: `The African ${industry} market is growing at 2.3x the global average, driven by mobile penetration, urbanisation, and a young population with rapidly evolving consumption patterns. Analysts are revising growth projections upward.`,
    url: '#',
    source: 'Stears',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    relevanceScore: 91,
  },
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  const apiKey   = process.env.NEWS_API_KEY;
  const demoMode = process.env.DEMO_MODE === '1' || process.env.DEMO_MODE === 'true';
  const industry = (req.body?.industry as string) || 'Technology';
  const market   = (req.body?.market as string)   || '';

  if (demoMode || !apiKey) {
    res.status(200).json({ articles: buildDemoNews(industry) });
    return;
  }

  try {
    const keywords = INDUSTRY_KEYWORDS[industry] ?? industry;
    const query    = market
      ? `(${keywords}) AND (${market})`
      : keywords;

    const url = `https://newsapi.org/v2/everything?` +
      `q=${encodeURIComponent(query)}` +
      `&language=en` +
      `&sortBy=publishedAt` +
      `&pageSize=8` +
      `&apiKey=${apiKey}`;

    const response = await fetch(url);
    const data     = (await response.json()) as NewsApiResponse;

    if (!response.ok || data.status !== 'ok') {
      res.status(200).json({ articles: buildDemoNews(industry) });
      return;
    }

    const articles: NewsArticle[] = (data.articles ?? [])
      .filter((a) => a.title && a.description)
      .map((a, i) => ({
        id:             `news-${i}`,
        title:          a.title ?? '',
        description:    a.description ?? '',
        url:            a.url ?? '#',
        source:         a.source?.name ?? 'Unknown',
        publishedAt:    a.publishedAt ?? new Date().toISOString(),
        relevanceScore: Math.max(95 - i * 5, 60),
      }));

    res.status(200).json({
      articles: articles.length > 0 ? articles : buildDemoNews(industry),
    });
  } catch {
    res.status(200).json({ articles: buildDemoNews(industry) });
  }
}