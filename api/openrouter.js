const DEFAULT_MODELS = [
  'google/gemma-3-27b-it:free',
  'google/gemma-3-12b-it:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'openrouter/free',
];

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
  }

  const { messages, models = DEFAULT_MODELS } = request.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({ error: 'messages must be a non-empty array' });
  }

  const lastError = [];
  const referer = request.headers.origin ?? `https://${request.headers.host}`;

  for (const model of models) {
    try {
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': referer,
          'X-Title': 'AI Trip Planner',
        },
        body: JSON.stringify({ model, messages }),
      });

      const data = await openRouterResponse.json();

      if (!openRouterResponse.ok) {
        const message = data?.error?.message ?? `HTTP ${openRouterResponse.status}`;
        lastError.push(`${model}: ${message}`);
        continue;
      }

      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string') {
        lastError.push(`${model}: missing response content`);
        continue;
      }

      return response.status(200).json({ content, model });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lastError.push(`${model}: ${message}`);
    }
  }

  return response.status(502).json({
    error: `All models failed:\n${lastError.join('\n')}`,
  });
}
