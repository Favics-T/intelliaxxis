import {
  type FC,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { useProfileStore } from '../store/profileStore';
import { useIntelligenceStore } from '../store/intelligenceStore';
import { useResearch } from '../hook/useResearch';
import { ChatMessage } from '../component/research/ChatMessage';
import { Spinner } from '../component/ui/Spinner';
import type { ResearchSession } from '../types/research';

const STARTER_QUESTIONS = [
  'What are the biggest trends in my industry right now?',
  'Who are my most dangerous competitors and what are they doing?',
  'What growth strategy should I focus on this quarter?',
  'What regulations could affect my business in the next 12 months?',
  'How can I reduce my customer acquisition cost?',
];

export const ResearchPage: FC = () => {
  const { profile }   = useProfileStore();
  const { sessions, deleteSession } = useIntelligenceStore();
  const { ask, isLoading, error, activeSession, setActiveSession } = useResearch();

  const [input, setInput]           = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const bottomRef                   = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || isLoading) return;
    setInput('');
    await ask(q, activeSession?.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const startNewChat = () => {
    setActiveSession(null);
    setInput('');
  };

  return (
    <div className="animate-[fade-up_0.5s_ease-out_both] flex h-[calc(100vh-10rem)] gap-5">

      {/* Sidebar — session history */}
      <div className={`flex flex-col gap-3 ${showHistory ? 'w-64 shrink-0' : 'hidden'} md:flex md:w-56 md:shrink-0`}>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-textSecondary">
            History
          </p>
          <button
            onClick={startNewChat}
            className="font-mono text-[10px] text-cyan hover:underline"
          >
            + New
          </button>
        </div>

        <div className="flex-1 space-y-1.5 overflow-y-auto">
          {sessions.length === 0 && (
            <p className="text-[11px] text-textSecondary">No sessions yet</p>
          )}
          {sessions.map((s: ResearchSession) => (
            <div
              key={s.id}
              className={`group flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 cursor-pointer transition-all ${
                activeSession?.id === s.id
                  ? 'border-cyan/20 bg-cyan/5'
                  : 'border-white/5 hover:border-white/10'
              }`}
              onClick={() => setActiveSession(s)}
            >
              <p className="truncate text-[11px] text-textSecondary group-hover:text-textPrimary">
                {s.title}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(s.id);
                  if (activeSession?.id === s.id) setActiveSession(null);
                }}
                className="shrink-0 text-[10px] text-textDim opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-card border border-white/5 bg-surface">

        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="rounded-lg border border-white/10 p-1.5 text-textSecondary transition-all hover:border-white/20 hover:text-textPrimary md:hidden"
            >
              ☰
            </button>
            <div>
              <p className="text-[13px] font-medium text-textPrimary">
                {activeSession ? activeSession.title : 'Research Assistant'}
              </p>
              <p className="font-mono text-[9px] text-textSecondary">
                Specialised in {profile.industry} · {profile.businessName}
              </p>
            </div>
          </div>
          {activeSession && (
            <button
              onClick={startNewChat}
              className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-textSecondary transition-all hover:border-cyan/30 hover:text-cyan"
            >
              + New Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Welcome state */}
          {!activeSession && (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl">💬</div>
                <p className="font-medium text-textPrimary">
                  Ask me anything about your industry
                </p>
                <p className="text-sm text-textSecondary max-w-sm">
                  I'm your personal analyst, specialised in{' '}
                  <span className="text-cyan">{profile.industry}</span> and tuned to{' '}
                  <span className="text-textPrimary">{profile.businessName}</span>'s context.
                </p>
              </div>

              {/* Starter questions */}
              <div className="w-full max-w-lg space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-textSecondary">
                  Try asking
                </p>
                {STARTER_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="w-full rounded-xl border border-white/5 bg-surface2 px-4 py-3 text-left text-[12px] text-textSecondary transition-all hover:border-cyan/20 hover:text-textPrimary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
         {/* Messages */}
{activeSession?.messages.map((msg, index) => {
  const isLastMessage = index === activeSession.messages.length - 1;
  const isAssistant   = msg.role === 'assistant';
  return (
    <ChatMessage
      key={msg.id}
      message={msg}
      animate={isLastMessage && isAssistant}
    />
  );
})}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet/30 bg-violet/10 font-mono text-[10px] text-violet">
                AI
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-white/5 bg-surface2 px-4 py-3">
                <Spinner size="sm" />
              </div>
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-[12px] text-danger">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/5 p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask anything about ${profile.industry}...`}
              rows={1}
              disabled={isLoading}
              className="input-field flex-1 resize-none leading-relaxed"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan/30 bg-cyan/10 text-cyan transition-all hover:bg-cyan/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ↑
            </button>
          </div>
          <p className="mt-2 font-mono text-[9px] text-textSecondary">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};