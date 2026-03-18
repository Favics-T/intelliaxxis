import type { VercelRequest, VercelResponse } from '@vercel/node';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    res.status(200).json({
      status: 'FAIL',
      reason: 'CLAUDE_API_KEY is not set',
    });
    return;
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 20,
        messages: [
          {
            role: 'user',
            content: 'Reply with exactly: CLAUDE_CONNECTED',
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(200).json({
        status: 'FAIL',
        httpStatus: response.status,
        error: data?.error?.message ?? JSON.stringify(data),
      });
      return;
    }

    const text = data.content?.[0]?.text ?? '';

    res.status(200).json({
      status: 'SUCCESS',
      claudeReply: text,
      connected: text.includes('CLAUDE_CONNECTED'),
      keyPrefix: apiKey.slice(0, 12) + '...',
      demoMode: process.env.DEMO_MODE,
    });

  } catch (err) {
    res.status(200).json({
      status: 'FAIL',
      reason: 'Network error',
      error: err instanceof Error ? err.message : 'Unknown',
    });
  }
}
