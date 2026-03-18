import type { FC } from 'react';
import type { ResearchMessage } from '../../types/research';

interface Props {
  message: ResearchMessage;
}

export const ChatMessage: FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';

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
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-textPrimary">
          {message.content}
        </p>
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