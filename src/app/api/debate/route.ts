import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AGENTS } from '@/lib/agents';
import { AgentId } from '@/types/agent';

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { agentId, marketContext, round, previousMessages } = await req.json() as {
      agentId: AgentId;
      marketContext: string;
      round: number;
      previousMessages?: Array<{ agentName: string; content: string }>;
    };

    const agent = AGENTS[agentId];
    if (!agent) {
      return new Response(JSON.stringify({ error: 'Invalid agent' }), { status: 400 });
    }

    const roundDescriptions: Record<number, string> = {
      1: 'This is Round 1: Opening Statements. Analyze the market data and present your perspective. Focus on what the data tells YOU given your analytical lens.',
      2: 'This is Round 2: Rebuttals. You\'ve heard the other analysts. Challenge their arguments, poke holes in their reasoning, and reinforce your position using the data.',
      3: 'This is Round 3: Final Verdict. Give your FINAL probability estimate (a specific percentage) and your most compelling 1-sentence argument. Format: "My verdict: X% probability. [Your argument]"',
      0: 'MARKET ALERT — Flash reaction. Give a 1-sentence snap reaction to this market shift. Be punchy and specific.',
    };

    let userContent = `${marketContext}\n\n${roundDescriptions[round] || roundDescriptions[1]}`;

    if (previousMessages && previousMessages.length > 0) {
      userContent += '\n\nPREVIOUS ARGUMENTS FROM OTHER ANALYSTS:\n';
      userContent += previousMessages.map(m => `${m.agentName}: "${m.content}"`).join('\n');
    }

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 250,
      system: agent.systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Debate API error:', error);
    return new Response(JSON.stringify({ error: 'Debate generation failed' }), { status: 500 });
  }
}
