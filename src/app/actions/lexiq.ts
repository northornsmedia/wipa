'use server';

import { PAGE_MAP } from '@/lib/lexiq/page-map';
import { LEXIQ_SYSTEM_PROMPT } from '@/lib/lexiq/system-prompt';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSupabaseServerClient } from '@/lib/supabase-server';

// Initialize the Gemini API with the provided key or fallback to environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AQ.Ab8RN6LM_qT0qVauGLGT8udlmi9lF2yAQGGpNZZFn4QF55T4ag');

export async function generateLexIQResponse(history: any[], selectedModel?: string) {
  try {
    const routeListStr = Object.entries(PAGE_MAP).map(([route, info]) => 
      `${route}: ${info.name} (Aliases: ${info.aliases.join(', ')})`
    ).join('\n');
    
    const pageMapContext = `\n\n--- PLATFORM ROUTES ---\nYou can navigate the user to any of these paths:\n${routeListStr}`;
    const fullSystemInstruction = LEXIQ_SYSTEM_PROMPT + pageMapContext;

    // ----------------------------------------------------
    // Gemini Integration (Sally Gemini)
    // ----------------------------------------------------
    if (selectedModel === "Sally Gemini" || selectedModel === "LexIQ Gemini") {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3.6-flash",
        systemInstruction: fullSystemInstruction
      });

      // Format the history for Gemini (needs 'user' and 'model' roles)
      let formattedHistory = history.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      // The last message should be the new prompt, the rest is history
      const promptMessage = formattedHistory.pop();
      
      // Gemini API requires the history to start with a 'user' message.
      while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.shift();
      }
      
      if (!promptMessage) return { error: "No prompt provided" };

      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(promptMessage.parts[0].text);
      const text = (await result.response).text();

      // We could parse JSON here, but the user didn't ask for Gemini to use navigation formatting specifically.
      // We will parse it just in case Gemini gets it right!
      let action = undefined;
      let finalContent = text;
      const codeBlockMatch = finalContent.match(/```(?:json)?\s*({[\s\S]*?"action"\s*:\s*"navigate"[\s\S]*?})\s*```/);
      if (codeBlockMatch) {
        try {
          action = JSON.parse(codeBlockMatch[1]);
          finalContent = finalContent.replace(codeBlockMatch[0], '').trim();
        } catch (e) {}
      } else {
        const rawJsonMatch = finalContent.match(/{\s*"action"\s*:\s*"navigate"\s*,\s*"path"\s*:\s*"[^"]+"\s*}/);
        if (rawJsonMatch) {
          try {
            action = JSON.parse(rawJsonMatch[0]);
            finalContent = finalContent.replace(rawJsonMatch[0], '').trim();
          } catch (e) {}
        }
      }

      return { text: finalContent, action };
    }

    // ----------------------------------------------------
    // NVIDIA NIM Integration (Sally 4.1 Pro / Nemotron)
    // ----------------------------------------------------
    const nvidiaKey = process.env.NVIDIA_API_KEY || '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';
    const isNvidiaModel = !selectedModel || 
      selectedModel.includes("LexisNexis") || 
      selectedModel === "Sally 4.1 Pro" || 
      selectedModel === "Sally Fast" ||
      selectedModel.toLowerCase().includes("nemotron");

    if (isNvidiaModel && nvidiaKey) {
      const nvModelsToTry = [
        "meta/llama-3.2-11b-vision-instruct",
        "google/gemma-4-31b-it",
        "nvidia/nemotron-3-super-120b-a12b"
      ];

      for (const nvModel of nvModelsToTry) {
        try {
          const nvMessages = [
            { role: "system", content: fullSystemInstruction },
            ...history.map(msg => ({ 
              role: msg.role === 'ai' ? 'assistant' : 'user', 
              content: msg.content 
            }))
          ];

          const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${nvidiaKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: nvModel,
              messages: nvMessages,
              temperature: 0.5,
              top_p: 1,
              max_tokens: 1024,
              stream: false
            })
          });

          if (nvRes.ok) {
            const data = await nvRes.json();
            const assistantMessage = data.choices?.[0]?.message;
            let text = (assistantMessage?.content || "").replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

            if (!text) continue;

            // Parse if AI decided to navigate via JSON
            let action = undefined;
            const codeBlockMatch = text.match(/```(?:json)?\s*({[\s\S]*?"action"\s*:\s*"navigate"[\s\S]*?})\s*```/);
            if (codeBlockMatch) {
              try {
                action = JSON.parse(codeBlockMatch[1]);
                text = text.replace(codeBlockMatch[0], '').trim();
              } catch (e) {
                console.error("Failed to parse AI action json from code block:", e);
              }
            } else {
              const rawJsonMatch = text.match(/{\s*"action"\s*:\s*"navigate"\s*,\s*"path"\s*:\s*"[^"]+"\s*}/);
              if (rawJsonMatch) {
                try {
                  action = JSON.parse(rawJsonMatch[0]);
                  text = text.replace(rawJsonMatch[0], '').trim();
                } catch (e) {
                  console.error("Failed to parse AI action json from raw match:", e);
                }
              }
            }

            return { text, action };
          }
        } catch (nvErr) {
          console.error(`NVIDIA API call failed on ${nvModel}:`, nvErr);
        }
      }
    }

    // ----------------------------------------------------
    // OpenRouter Integrations (Fallback & Other Models)
    // ----------------------------------------------------
    let openRouterModel = "nvidia/nemotron-3.5-lightning:free"; 
    let apiKey = process.env.OPENROUTER_NEMOTRON_KEY || process.env.OPENROUTER_API_KEY;

    if (selectedModel?.includes("LexisNexis") || selectedModel === "Sally 4.1 Pro" || selectedModel === "Sally Super" || selectedModel === "LexIQ Super") {
      openRouterModel = "openai/gpt-4o-mini";
      apiKey = process.env.OPENROUTER_API_KEY || "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";
    } else if (selectedModel === "Sally Advanced" || selectedModel === "LexIQ Advanced") {
      openRouterModel = "google/gemma-4-31b-it:free";
      apiKey = process.env.OPENROUTER_GEMMA_KEY || process.env.OPENROUTER_API_KEY;
    } else if (selectedModel === "Sally Beta" || selectedModel === "LexIQ Beta") {
      openRouterModel = "dots-studio/dots-3-note-preview:free";
      apiKey = process.env.OPENROUTER_DOTS_KEY || process.env.OPENROUTER_API_KEY;
    }

    const orMessages = [
      { role: "system", content: fullSystemInstruction },
      ...history.map(msg => ({ 
        role: msg.role === 'ai' ? 'assistant' : 'user', 
        content: msg.content,
        ...(msg.reasoning_details ? { reasoning_details: msg.reasoning_details } : {}) 
      }))
    ];

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: orMessages
      })
    });

    if (!res.ok) {
      throw new Error(`OpenRouter API error: ${res.statusText}`);
    }

    const data = await res.json();
    const assistantMessage = data.choices[0].message;
    let text = (assistantMessage?.content || "").replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // Parse if AI decided to navigate via JSON
    let action = undefined;
    const codeBlockMatch = text.match(/```(?:json)?\s*({[\s\S]*?"action"\s*:\s*"navigate"[\s\S]*?})\s*```/);
    if (codeBlockMatch) {
      try {
        action = JSON.parse(codeBlockMatch[1]);
        text = text.replace(codeBlockMatch[0], '').trim();
      } catch (e) {
        console.error("Failed to parse AI action json from code block:", e);
      }
    } else {
      const rawJsonMatch = text.match(/{\s*"action"\s*:\s*"navigate"\s*,\s*"path"\s*:\s*"[^"]+"\s*}/);
      if (rawJsonMatch) {
        try {
          action = JSON.parse(rawJsonMatch[0]);
          text = text.replace(rawJsonMatch[0], '').trim();
        } catch (e) {
          console.error("Failed to parse AI action json from raw match:", e);
        }
      }
    }

    return { text, action };
  } catch (error) {
    console.error("AI API Error:", error);
    return { error: "Failed to generate response. Please try again." };
  }
}

/**
 * Direct messaging server action for Sally IP using real NVIDIA NIM API
 * Dynamically grounded in live WIPA database IP news & upcoming events
 */
export async function askSallyChatAI(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const nvidiaKey = process.env.NVIDIA_API_KEY || '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';

  // 1. Fetch live platform context from Supabase (top 5 IP news wire stories & top 4 events)
  let newsContext = 'No live wire headlines loaded.';
  let eventsContext = 'No upcoming events loaded.';

  try {
    const supabase = getSupabaseServerClient();
    const [{ data: news }, { data: events }] = await Promise.all([
      supabase
        .from('ip_news')
        .select('title, summary, organization, created_at, slug')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('events')
        .select('title, event_date, location, is_virtual, category')
        .order('created_at', { ascending: false })
        .limit(4)
    ]);

    if (news && news.length > 0) {
      newsContext = news.map((n: any, i: number) => 
        `${i + 1}. **${n.title}** (${n.organization || 'Global IP Wire'})\n   - Summary: ${n.summary || 'Recent legal development'}\n   - Full Briefing: /platform/resources/ip-news/${n.slug || ''}`
      ).join('\n');
    }

    if (events && events.length > 0) {
      eventsContext = events.map((e: any, i: number) => {
        const dateStr = e.event_date ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming';
        return `${i + 1}. **${e.title}** (${e.category || 'Event'})\n   - Date: ${dateStr}\n   - Format: ${e.is_virtual ? 'Virtual CLE / Webinar' : (e.location || 'In-Person')}`;
      }).join('\n');
    }
  } catch (dbErr) {
    console.warn("Notice: Real-time context fetch for Sally IP skipped:", dbErr);
  }

  const systemPrompt = `You are Sally IP, the elite AI intellectual property and legal co-pilot for the Women in IP Alliance (WIPA) platform.
You are chatting directly in real-time with a verified WIPA member in the platform messenger.

### LIVE PLATFORM INTEL (REAL-TIME DATABASE KNOWLEDGE):
#### LATEST IP WIRE HEADLINES:
${newsContext}

#### UPCOMING WIPA EVENTS & WEBINARS:
${eventsContext}

### STRICT OPERATIONAL RULES:
1. **ABSOLUTELY NO CANNED DEFLECTION LOOPS**:
   - NEVER end messages with repetitive interrogation like "What are you working on today?" or "Are you tackling a specific IP challenge?" or "How can I assist you with patent strategy, trademarks, research, or drafting today?".
   - NEVER deflect a question with another generic question. Give a SUBSTANTIVE, DIRECT, ACTIONABLE answer immediately.
2. **IP NEWS & INDUSTRY DEVELOPMENTS**:
   - When the user asks about "latest IP news", "IP news", "what's new in IP", or recent legal developments, IMMEDIATELY present the real live news headlines from LATEST IP WIRE HEADLINES above!
   - Highlight key legal takeaways, strategic implications for patent/trademark counsel, cite the source, and mention they can read full briefings at [WIPA IP News](/platform/resources/ip-news).
3. **UPCOMING EVENTS & SUMMITS**:
   - When asked about events, webinars, CLEs, or summits, share the real scheduled events above with dates and formats, and direct them to [WIPA Events](/platform/events).
4. **CASUAL GREETINGS & SHORT CHAT**:
   - If the user asks "how are you?", answer warmly and naturally in one single sentence (e.g. "I'm doing great, thank you! Ready whenever you want to explore IP matters.") without interrogating them.
   - If the user sends a greeting ("hi", "hello"), reply warmly in 1 brief sentence.
   - If the user sends emojis or reactions, acknowledge them with friendly brevity.
5. **DEEP INTELLECTUAL PROPERTY & LEGAL EXPERTISE**:
   - For substantive legal or technical inquiries (patent claims drafting, 35 U.S.C. 101 subject matter eligibility under Alice/Mayo, novelty 102, non-obviousness 103, enablement/written description 112, trademark clearance under DuPont/Polaroid factors, copyright fair use 17 U.S.C. 107, model training IP liabilities, trade secret defense, licensing, IP valuations), provide authoritative, thorough, and high-caliber legal analysis.
6. **FORMATTING**:
   - Use clean, modern Markdown with bold headings and concise bullet points. Avoid filler preambles.`;

  // 2. Sanitize chat history so previous repetitive assistant deflections don't bias the model
  const sanitizedMessages = (messages || [])
    .filter(m => m && m.content && m.content.trim().length > 0)
    .slice(-10)
    .map(m => {
      let clean = m.content
        .replace(/What are you working on today\??/gi, '')
        .replace(/Are you tackling a specific IP challenge or looking for guidance on a particular issue\??/gi, '')
        .replace(/How can I assist you today—whether it’s patent drafting.*?guidance\./gi, '')
        .trim();
      return {
        role: m.role,
        content: clean || m.content
      };
    });

  // Active models on the user's NVIDIA NIM API
  const nvidiaModels = [
    "meta/llama-3.2-11b-vision-instruct",
    "google/gemma-4-31b-it",
    "nvidia/nemotron-3-super-120b-a12b"
  ];

  for (const model of nvidiaModels) {
    try {
      const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${nvidiaKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...sanitizedMessages
          ],
          temperature: 0.5,
          max_tokens: 850,
          stream: false
        })
      });

      if (nvRes.ok) {
        const data = await nvRes.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && typeof content === 'string' && content.trim()) {
          const cleanText = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
          if (cleanText) {
            return { text: cleanText };
          }
        }
      } else {
        console.warn(`NVIDIA API model ${model} returned status ${nvRes.status}`);
      }
    } catch (err) {
      console.error(`NVIDIA API call error on model ${model}:`, err);
    }
  }

  return { text: "I'm having a brief connection hitch with the NVIDIA AI service. Please ask your question again!" };
}



