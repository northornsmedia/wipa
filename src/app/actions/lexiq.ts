'use server';

import { PAGE_MAP } from '@/lib/lexiq/page-map';
import { LEXIQ_SYSTEM_PROMPT } from '@/lib/lexiq/system-prompt';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    // OpenRouter Integrations
    // ----------------------------------------------------
    let openRouterModel = "nvidia/nemotron-3.5-lightning:free"; 
    let apiKey = process.env.OPENROUTER_NEMOTRON_KEY || process.env.OPENROUTER_API_KEY;

    if (selectedModel?.includes("LexisNexis") || selectedModel === "Sally 4.1 Pro" || selectedModel === "Sally Super" || selectedModel === "LexIQ Super") {
      openRouterModel = "openai/gpt-4o-mini";
      apiKey = "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"; // Old OpenRouter key
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
        messages: orMessages,
        reasoning: { enabled: true }
      })
    });

    if (!res.ok) {
      throw new Error(`OpenRouter API error: ${res.statusText}`);
    }

    const data = await res.json();
    const assistantMessage = data.choices[0].message;
    let text = assistantMessage.content;
    const reasoning_details = assistantMessage.reasoning_details;

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

    return { text, action, reasoning_details };
  } catch (error) {
    console.error("AI API Error:", error);
    return { error: "Failed to generate response. Please try again." };
  }
}
