import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { brief, name, role, company, practiceAreas, education, experienceYears, location } = await request.json();
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    const userBrief = brief?.trim() || '';
    const userName = name?.trim() || 'IP Professional';
    const userRole = role?.trim() || 'Intellectual Property Specialist';
    const userCompany = company?.trim() || 'International IP Practice';
    const userPractices = practiceAreas?.trim() || 'Patents, Trademarks, IP Strategy, Licensing';
    const userEducation = education?.trim() || 'Degree in Law & Intellectual Property';
    const userLocation = location?.trim() || 'Global';
    const userExp = experienceYears ? `${experienceYears} years` : 'Established practice';

    const systemPrompt = `You are an executive biographer and professional profile copilot for the Women in Intellectual Property Alliance (WIPA).
The author is an Intellectual Property professional, patent attorney, trademark counsel, or innovation leader.

Your task: Craft an engaging, authentic, polished, and comprehensive professional biography / About summary (2 concise, high-impact paragraphs, ~110-150 words total) based on the user's brief notes and profile details.

Guidelines:
- Voice: Natural, polished professional first-person narrative (e.g., "I am an Intellectual Property attorney..." or "With over X years of experience in IP law, I focus on...").
- Structure:
  - Paragraph 1: Core expertise, years of experience, current practice focus, and key sectors.
  - Paragraph 2: Strategic approach to IP value creation, patent/trademark portfolio management, and commitment to collaboration through the WIPA network.
- Tone: Authoritative, forward-looking, articulate, and welcoming.
- Formatting: Do NOT use markdown bold/italic asterisks (** or *). Write strictly in clean, ready-to-publish plain text paragraphs.
- Output ONLY the biography text. Do not include quotes, greetings, or meta commentary.`;

    const userPrompt = `User's Brief Notes / Rough Idea:
"${userBrief || 'Write a comprehensive and engaging professional bio for my IP profile.'}"

Profile Context:
- Name: ${userName}
- Role / Title: ${userRole}
- Organization / Firm: ${userCompany}
- Practice Areas: ${userPractices}
- Education: ${userEducation}
- Experience: ${userExp}
- Location: ${userLocation}`;

    // 1. Call OpenRouter with openai/gpt-4o-mini
    if (openRouterKey) {
      try {
        const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://platform.womensipalliance.com",
            "X-Title": "WIPA Profile AI Copilot"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (orRes.ok) {
          const data = await orRes.json();
          const generated = data.choices?.[0]?.message?.content?.trim();
          if (generated) {
            // Strip any accidental markdown bolding
            const cleanText = generated.replace(/\*\*/g, '').replace(/\*/g, '');
            return NextResponse.json({ text: cleanText });
          }
        } else {
          const errData = await orRes.json().catch(() => ({}));
          console.warn('OpenRouter error:', orRes.status, errData);
        }
      } catch (orErr) {
        console.warn('OpenRouter API call failed:', orErr);
      }
    }

    // 2. High-quality smart contextual fallback
    const fallbackBio = `As an experienced ${userRole} at ${userCompany}${userLocation ? ` based in ${userLocation}` : ''}, I specialize in advising clients across ${userPractices}. ${userBrief ? `Building upon my work in ${userBrief}, ` : ''}My practice focuses on delivering strategic, commercial IP solutions that protect core innovation and maximize portfolio valuation.

With an educational foundation from ${userEducation}, I am passionate about advancing intellectual property best practices, fostering international collaboration, and actively contributing to the Women in Intellectual Property Alliance (WIPA) community.`;

    return NextResponse.json({ text: fallbackBio });

  } catch (error: any) {
    console.error('AI Bio Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate biography' },
      { status: 500 }
    );
  }
}
