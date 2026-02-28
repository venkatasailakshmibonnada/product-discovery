const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const PORT = 5001;
const products = require('./products.json');

app.use(cors());
app.use(express.json());

// GET /api/products
app.get('/api/products', (req, res) => {
  const { category, query } = req.query;
  let results = [...products];

  if (category) {
    results = results.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({ products: results });
});

// POST /api/ask
app.post('/api/ask', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query field.' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: missing API key.' });
  }

  const productContext = products.map(p =>
    `ID:${p.id} | ${p.name} | ${p.category} | $${p.price} | Tags: ${p.tags.join(', ')}`
  ).join('\n');

  const prompt = `You are a helpful product assistant. Given a user query and a product catalog,
identify the most relevant products and write a short 1-2 sentence summary of your recommendations.

Product catalog:
${productContext}

User query: ${query}

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "productIds": ["1", "3"],
  "summary": "Here are the best matches for your query..."
}`;

  try {
    const client = new Groq({ apiKey: GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    });

    const rawContent = completion.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const match = rawContent.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed || !Array.isArray(parsed.productIds)) {
      return res.status(502).json({ error: 'Unexpected response format from AI.' });
    }

    const matchedProducts = products.filter(p => parsed.productIds.includes(p.id));

    return res.json({
      summary: parsed.summary || '',
      products: matchedProducts
    });

  } catch (err) {
    console.error('LLM API error:', err.message);

    const status = err.status ?? err.response?.status;
    if (status === 429) return res.status(503).json({ error: 'AI service is rate-limited. Please try again shortly.' });
    if (status === 401 || status === 403) return res.status(502).json({ error: 'AI service authentication failed.' });
    if (err.message?.includes('timeout') || err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'AI service timed out.' });
    }

    return res.status(502).json({ error: 'AI service unavailable. Please try again later.' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
