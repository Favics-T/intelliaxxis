import { type FC, useState, useEffect } from 'react';
import type { ResearchMessage } from '../../types/research';

interface Props {
  message: ResearchMessage;
  animate?: boolean;
}

const useTypingAnimation = (text: string, animate: boolean, speed = 8) => {
  const [displayed, setDisplayed] = useState(animate ? '' : text);
  const [done, setDone]           = useState(!animate);

  useEffect(() => {
    if (!animate) { setDisplayed(text); setDone(true); return; }

    setDisplayed('');
    setDone(false);

    let i = 0;
    const interval = setInterval(() => {
      i += speed;
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, 16);

    return () => clearInterval(interval);
  }, [text, animate, speed]);

  return { displayed, done };
};

// Render markdown-like formatting
const FormattedText: FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Bold headers **text**
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={i} className="font-semibold text-textPrimary text-[13px]">
              {line.slice(2, -2)}
            </p>
          );
        }
        // Numbered list
        if (/^\d+\./.test(line)) {
          const num   = line.match(/^(\d+)\./)?.[1] ?? '1';
          const content = line.replace(/^\d+\.\s*/, '');
          return (
            <div key={i} className="flex items-start gap-2.5">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan/20 bg-cyan/10 font-mono text-[9px] text-cyan mt-0.5">
                {num}
              </div>
              <p className="text-[13px] leading-relaxed text-textSecondary">{content}</p>
            </div>
          );
        }
        // Empty line
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Normal paragraph
        return (
          <p key={i} className="text-[13px] leading-relaxed text-textSecondary">
            {line}
          </p>
        );
      })}
    </div>
  );
};

export const ChatMessage: FC<Props> = ({ message, animate = false }) => {
  const isUser = message.role === 'user';
  const { displayed, done } = useTypingAnimation(
    message.content,
    animate && !isUser,
    12,
  );

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${
        isUser
          ? 'border-cyan/30 bg-cyan/10 text-cyan'
          : 'border-violet/30 bg-violet/10 text-violet'
      }`}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'rounded-tr-sm bg-cyan/10 border border-cyan/15'
          : 'rounded-tl-sm bg-surface2 border border-white/5'
      }`}>
        {isUser ? (
          <p className="text-[13px] leading-relaxed text-textPrimary">
            {message.content}
          </p>
        ) : (
          <FormattedText text={displayed} />
        )}

        {/* Cursor while typing */}
        {!done && !isUser && (
          <span className="inline-block h-3.5 w-0.5 bg-cyan animate-[spin-cw_0.8s_steps(1)_infinite] ml-0.5 align-middle" />
        )}

        <p className="mt-1.5 font-mono text-[9px] text-textSecondary">
          {new Date(message.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};