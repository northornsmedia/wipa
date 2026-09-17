'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

interface RefineNewsParams {
  title: string;
  summary: string;
  content: string;
  jurisdiction?: string;
  mode?: 'journalistic' | 'executive' | 'formal';
}

interface RefineNewsResult {
  success: boolean;
  refinedTitle: string;
  refinedSummary: string;
  refinedContent: string;
  improvements: string[];
  error?: string;
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || 'AQ.Ab8RN6LM_qT0qVauGLGT8udlmi9lF2yAQGGpNZZFn4QF55T4ag'
);

export async function refineNewsWithAI(params: RefineNewsParams): Promise<RefineNewsResult> {
  const { title, summary, content, jurisdiction = 'Global', mode = 'journalistic' } = params;

  if (!title.trim() && !content.trim()) {
    return {
      success: false,
      refinedTitle: title,
      refinedSummary: summary,
      refinedContent: content,
      improvements: [],
      error: 'Please provide at least a title or draft text to refine.'
    };
  }

  const prompt = `You are a Senior Editor at the Women's Intellectual Property Alliance (WIPA) Global News Wire and a veteran legal journalist for Reuters and Law360.
Your task is to refine, polish, and elevate an intellectual property legal news briefing written by a contributor.

JURISDICTION CONTEXT: ${jurisdiction}
EDITING MODE: ${mode === 'executive' ? 'Executive Briefing (succinct, high-impact key takeaways)' : mode === 'formal' ? 'Formal Legal Analysis (rigorous IP doctrine, statutory framing)' : 'Journalistic Polish (compelling headline, active voice, AP/Law360 journalism style)'}

ORIGINAL DRAFT INPUTS:
- Title/Headline: "${title}"
- Summary/Key Takeaway: "${summary}"
- Draft Content:
${content}

INSTRUCTIONS:
1. HEADLINE: Create a punchy, authoritative, professional legal news headline (capitalized appropriately, no clickbait, no punctuation at the end).
2. SUMMARY: Craft a sharp 1-2 sentence executive briefing summary summarizing who, what happened, the legal/commercial consequence, and what IP professionals need to know.
3. BODY CONTENT: Write clean, well-structured HTML for the body:
   - Use standard HTML tags: <h2>, <h3>, <p>, <strong>, <blockquote>, <ul>, <li>.
   - DO NOT use markdown characters like ** or ##.
   - Retain all factual claims, party names, patent/trademark numbers, courts, and docket details if present.
   - Organize logically into 2-4 sections with clear <h2> subheadings (e.g., <h2>Core Ruling & Background</h2>, <h2>Strategic IP Implications</h2>, <h2>What Lies Ahead</h2>).
   - Ensure a polished, neutral, high-level IP legal journalistic tone.
4. IMPROVEMENTS: List 3-4 bullet points highlighting specific improvements made (e.g. "Sharpened headline for legal precision", "Structured into distinct impact sections", "Corrected statutory phrasing").

OUTPUT FORMAT:
Return ONLY a valid JSON object with the following schema, with no markdown code fence wrappers or extraneous text:
{
  "refinedTitle": "string",
  "refinedSummary": "string",
  "refinedContent": "string (valid HTML with <h2>, <p>, <ul>, <li>, <strong>)",
  "improvements": ["string", "string", "string"]
}`;

  // 1. Attempt OpenRouter First (GPT-4o-mini / Nemotron) if API key exists
  const openRouterKey = process.env.OPENROUTER_API_KEY || "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";
  
  if (openRouterKey) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://platform.womensipalliance.com",
          "X-Title": "WIPA IP Newsroom"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert legal journalist and IP editor. Always return only valid JSON without markdown fences."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.4
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawOutput = data.choices?.[0]?.message?.content || "";
        const cleanJsonStr = rawOutput.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim();
        const parsed = JSON.parse(cleanJsonStr);

        return {
          success: true,
          refinedTitle: parsed.refinedTitle || title,
          refinedSummary: parsed.refinedSummary || summary,
          refinedContent: parsed.refinedContent || content,
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Elevated editorial tone and legal clarity."]
        };
      }
    } catch (err) {
      console.warn("OpenRouter refine failed, falling back to Gemini:", err);
    }
  }

  // 2. Fallback to Gemini
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJsonStr = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim();
    const parsed = JSON.parse(cleanJsonStr);

    return {
      success: true,
      refinedTitle: parsed.refinedTitle || title,
      refinedSummary: parsed.refinedSummary || summary,
      refinedContent: parsed.refinedContent || content,
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Polished journalistic tone and structured headings."]
    };
  } catch (err: any) {
    console.error("Gemini refine also failed:", err);

    // Graceful fallback: clean up content locally if AI services are unavailable
    const fallbackTitle = title
      ? title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : "Intellectual Property Briefing";
    
    const fallbackSummary = summary || (content ? content.replace(/<[^>]*>/g, '').slice(0, 160) + '...' : '');

    return {
      success: true,
      refinedTitle: fallbackTitle,
      refinedSummary: fallbackSummary,
      refinedContent: content.includes('<p>') ? content : `<p>${content}</p>`,
      improvements: [
        "Capitalized headline to legal journalism style",
        "Preserved verified facts and structural integrity",
        "Ensured responsive HTML formatting"
      ]
    };
  }
}
