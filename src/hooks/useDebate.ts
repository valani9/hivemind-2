'use client';

import { useCallback } from 'react';
import { useDebateStore } from '@/stores/debateStore';
import { useMarketStore } from '@/stores/marketStore';
import { AGENTS, AGENT_ORDER, buildMarketContext } from '@/lib/agents';
import { AgentId } from '@/types/agent';

async function streamAgentResponse(
  agentId: AgentId,
  marketContext: string,
  round: number,
  previousMessages: Array<{ agentName: string; content: string }>,
  onChunk: (text: string) => void,
  onDone: () => void
) {
  const res = await fetch('/api/debate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, marketContext, round, previousMessages }),
  });

  if (!res.ok) throw new Error(`Debate API error: ${res.status}`);

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No reader');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) onChunk(parsed.text);
        } catch { /* skip */ }
      }
    }
  }
  onDone();
}

export function useDebate() {
  const {
    startDebate: initDebate,
    addMessage,
    updateMessage,
    finishMessage,
    completeRound,
    setGenerating,
    addFlashReaction,
    rounds,
    currentRound,
    setCurrentRound,
    isActive,
    isGenerating,
    selectedContract,
  } = useDebateStore();

  const { currentEvent, orderBook, ticker, trades } = useMarketStore();

  const getMarketContext = useCallback(() => {
    if (!currentEvent || !currentEvent.contracts[selectedContract]) return '';
    return buildMarketContext(
      currentEvent,
      currentEvent.contracts[selectedContract],
      orderBook ?? undefined,
      ticker ?? undefined,
      trades
    );
  }, [currentEvent, orderBook, ticker, trades, selectedContract]);

  const runRound = useCallback(async (roundNum: number) => {
    if (!currentEvent) return;

    const marketContext = getMarketContext();
    if (!marketContext) return;

    setGenerating(true);

    // Get previous round messages for rebuttals
    const prevRound = rounds.find(r => r.number === roundNum - 1);
    const previousMessages = prevRound?.messages.map(m => ({
      agentName: AGENTS[m.agentId].name,
      content: m.content,
    })) || [];

    // Stream all 4 agents in parallel
    const contentMap: Record<string, string> = {};

    await Promise.all(
      AGENT_ORDER.map(async (agentId) => {
        contentMap[agentId] = '';

        addMessage({
          agentId,
          round: roundNum,
          content: '',
          isStreaming: true,
          timestamp: Date.now(),
        });

        await streamAgentResponse(
          agentId,
          marketContext,
          roundNum,
          roundNum > 1 ? previousMessages : [],
          (text) => {
            contentMap[agentId] += text;
            updateMessage(agentId, roundNum, contentMap[agentId]);
          },
          () => {
            finishMessage(agentId, roundNum);
          }
        );
      })
    );

    completeRound(roundNum);
  }, [currentEvent, getMarketContext, rounds, addMessage, updateMessage, finishMessage, completeRound, setGenerating]);

  const startDebate = useCallback(async (ticker: string) => {
    initDebate(ticker);

    // Small delay to let state settle
    await new Promise(r => setTimeout(r, 100));
    await runRound(1);
  }, [initDebate, runRound]);

  const nextRound = useCallback(async () => {
    if (currentRound >= 3 || isGenerating) return;
    const next = currentRound + 1;
    setCurrentRound(next);
    await runRound(next);
  }, [currentRound, isGenerating, setCurrentRound, runRound]);

  const triggerFlashReaction = useCallback(async (shiftDescription: string) => {
    if (!currentEvent) return;

    const marketContext = getMarketContext();
    const flashContext = `${marketContext}\n\nMARKET ALERT: ${shiftDescription}\n\nGive a 1-sentence snap reaction to this market shift. Be punchy and specific.`;

    for (const agentId of AGENT_ORDER) {
      let content = '';
      await streamAgentResponse(
        agentId,
        flashContext,
        0,
        [],
        (text) => { content += text; },
        () => {
          addFlashReaction({
            agentId,
            content,
            shiftType: shiftDescription,
            timestamp: Date.now(),
          });
        }
      );
    }
  }, [currentEvent, getMarketContext, addFlashReaction]);

  return {
    startDebate,
    nextRound,
    triggerFlashReaction,
    isActive,
    isGenerating,
    currentRound,
  };
}
