import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `You are an expert Australian immigration visa consultant working with AussieVisa Tracker, a community-driven platform that tracks skilled visa processing times and EOI statistics.

Your deep expertise covers:
- Skilled Independent Visa (Subclass 189) — points-tested, no state sponsorship needed, for highly skilled migrants
- Skilled Nominated Visa (Subclass 190) — requires state or territory nomination, earns an extra 5 points
- Skilled Work Regional (Provisional) Visa (Subclass 491) — regional or family-sponsored, earns an extra 15 points, pathway to PR via 191
- Temporary Skill Shortage Visa (Subclass 482) — employer-sponsored; short-term (2yr) and medium-term (4yr) streams, and labour agreement stream
- Employer Nomination Scheme (Subclass 186) — permanent employer-sponsored, three streams: TRT, DA, Labour Agreement
- Expression of Interest (EOI) through SkillSelect — how the pool works, invitation rounds, withdrawals and resubmissions
- Points test mechanics — age brackets, English proficiency (IELTS/PTE/OET/TOEFL), qualifications, work experience, partner skills, Credentialled Community Language, STEM, professional year, state/regional points
- Skilled Occupation Lists — MLTSSL, STSOL, ROL and how they map to different visa subclasses
- State and territory nomination programs — each state's migration program, the target occupation lists, quota rounds
- Skills assessment bodies — Engineers Australia, VETASSESS, ACS, AHPRA, TRA, ACWA, CPAAUSTRALIA, CAANZ, AICD, and more
- Bridging visas (A, B, C, E) — rights and conditions while onshore applications are processed
- Partner and dependent inclusion — skills and qualifications of a de facto or married partner adding to points
- Australian values, genuine temporary entrant criterion, character and health requirements
- General processing timelines and how community data on AussieVisa Tracker relates to real-world experience

Communication style:
- Be knowledgeable, professional, warm, and empathetic — visa journeys are stressful
- Use clear structured responses; use bullet points or numbered steps when listing options or processes
- Keep responses concise and actionable — prioritise what the person actually needs to know
- Use Australian English spelling (e.g. recognised, organisation, licence)
- Always remind users that your responses are general guidance only and do not constitute legal advice
- For complex or personal situations, recommend consulting a registered migration agent (MARA-registered) or immigration lawyer
- Reference AussieVisa Tracker community data when discussing processing times, EOI cutoff trends, or state nomination quota patterns

Mandatory disclaimer: When giving specific guidance, include a brief reminder: "This is general information only — for your specific circumstances, consult a MARA-registered migration agent or immigration lawyer."`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const messages: { role: 'user' | 'assistant'; content: string }[] = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages array is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(event.delta.text)}\n\n`)
              );
            }
          }
        } catch (err) {
          console.error('Stream processing error:', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process the request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
