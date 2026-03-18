import { type FC, useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Textarea } from '../../ui/Input';
import { Button } from '../../ui/Button';

interface Props { onFinish: () => void; onBack: () => void }

export const Step5Description: FC<Props> = ({ onFinish, onBack }) => {
  const { profile, updateProfile } = useProfileStore();
  const [error, setError] = useState('');

  const handleFinish = () => {
    if (!profile.businessDescription.trim()) {
      setError('Please describe your business');
      return;
    }
    onFinish();
  };

  return (
    <div className="animate-[fade-up_0.4s_ease-out_both] space-y-8">
      <div>
        <div className="label-tag">Step 5 of 5</div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">
          Describe your business
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          This is the most important input. The more detail you give, the more precise your intelligence will be.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Textarea
            label="Business Description"
            placeholder="Tell IntelliAxis everything about your business. What do you do, who do you serve, how do you make money, what stage are you at, what have you tried, what's working and what isn't? The more context, the better the analysis."
            rows={7}
            value={profile.businessDescription}
            onChange={(e) => {
              updateProfile({ businessDescription: e.target.value });
              setError('');
            }}
          />
          {error && <p className="mt-1 text-[11px] text-danger">{error}</p>}
          <p className="mt-1.5 text-[11px] text-textSecondary">
            {profile.businessDescription.length} characters
            {profile.businessDescription.length < 100 && profile.businessDescription.length > 0 && (
              <span className="ml-2 text-amber">· Add more detail for better results</span>
            )}
            {profile.businessDescription.length >= 100 && (
              <span className="ml-2 text-emerald">· Great level of detail ✓</span>
            )}
          </p>
        </div>

        <Textarea
          label="Products & Services"
          placeholder="List your main products or services and what makes them different."
          rows={3}
          value={profile.productsServices}
          onChange={(e) => updateProfile({ productsServices: e.target.value })}
        />
      </div>

      {/* Summary card */}
      {profile.businessName && (
        <div className="rounded-xl border border-white/5 bg-surface2 p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Profile Summary
          </p>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div>
              <span className="text-textSecondary">Business: </span>
              <span className="text-textPrimary">{profile.businessName}</span>
            </div>
            <div>
              <span className="text-textSecondary">Industry: </span>
              <span className="text-textPrimary">{profile.industry}</span>
            </div>
            <div>
              <span className="text-textSecondary">Stage: </span>
              <span className="text-textPrimary">{profile.businessStage}</span>
            </div>
            <div>
              <span className="text-textSecondary">Market: </span>
              <span className="text-textPrimary">{profile.targetMarket}</span>
            </div>
            <div>
              <span className="text-textSecondary">Goals: </span>
              <span className="text-textPrimary">{profile.goals.length} selected</span>
            </div>
            <div>
              <span className="text-textSecondary">Competitors: </span>
              <span className="text-textPrimary">
                {profile.competitors.length > 0
                  ? profile.competitors.slice(0, 2).join(', ')
                  : 'None added'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={handleFinish} size="lg">
          Launch IntelliAxis →
        </Button>
      </div>
    </div>
  );
};