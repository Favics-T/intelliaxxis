import { type FC, useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { Button } from '../component/ui/Button';
import { Input, Textarea } from '../component/ui/Input';
import { INDUSTRIES, GOAL_OPTIONS, type BusinessGoal } from '../types/profile';
import { Select } from '../component/ui/Select';

export const ProfilePage: FC = () => {
  const { profile, updateProfile, resetProfile } = useProfileStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleGoal = (goal: BusinessGoal) => {
    const updated = profile.goals.includes(goal)
      ? profile.goals.filter((g) => g !== goal)
      : [...profile.goals, goal];
    updateProfile({ goals: updated });
  };

  return (
    <div className="animate-fade-up max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-textSecondary mb-1">
            Business Profile
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">
            Your Profile
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Keep this updated — it directly affects the quality of your intelligence
          </p>
        </div>
        <Button onClick={handleSave}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </Button>
      </div>

      {/* Basic info */}
      <div className="card space-y-4">
        <p className="label-tag">Business Information</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Business Name"
            value={profile.businessName}
            onChange={(e) => updateProfile({ businessName: e.target.value })}
          />
          <Input
            label="Your Name"
            value={profile.founderName}
            onChange={(e) => updateProfile({ founderName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Industry
          </label>
          {/* <select
            value={profile.industry}
            onChange={(e) => updateProfile({ industry: e.target.value })}
            className="input-field appearance-none cursor-pointer"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i} className="bg-surface2">{i}</option>
            ))}
          </select> */}
          <Select
            label='Industry'
            value={profile.industry}
            options={INDUSTRIES}
            onChange={(v)=> updateProfile({industry:v})}
          />
        </div>
        <Input
          label="Sub-sector"
          value={profile.subSector}
          onChange={(e) => updateProfile({ subSector: e.target.value })}
          placeholder="e.g. Mobile payments, B2B SaaS"
        />
      </div>

      {/* Business description */}
      <div className="card space-y-4">
        <p className="label-tag">Business Description</p>
        <Textarea
          label="Describe your business"
          value={profile.businessDescription}
          onChange={(e) => updateProfile({ businessDescription: e.target.value })}
          rows={5}
          placeholder="The more detail you provide, the better your intelligence will be..."
        />
        <Textarea
          label="Products & Services"
          value={profile.productsServices}
          onChange={(e) => updateProfile({ productsServices: e.target.value })}
          rows={3}
          placeholder="List your main products or services..."
        />
        <Textarea
          label="Biggest Challenge"
          value={profile.biggestChallenge}
          onChange={(e) => updateProfile({ biggestChallenge: e.target.value })}
          rows={2}
          placeholder="What is your biggest challenge right now?"
        />
      </div>

      {/* Goals */}
      <div className="card space-y-4">
        <p className="label-tag">Business Goals</p>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => {
            const active = profile.goals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`rounded-full border px-3 py-1.5 text-[12px] transition-all ${
                  active
                    ? 'border-cyan/60 bg-cyan/10 text-cyan'
                    : 'border-white/10 text-textSecondary hover:border-white/20'
                }`}
              >
                {active && <span className="mr-1.5">✓</span>}
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unique advantage */}
      <div className="card space-y-4">
        <p className="label-tag">Competitive Positioning</p>
        <Textarea
          label="Your Unique Advantage"
          value={profile.uniqueAdvantage}
          onChange={(e) => updateProfile({ uniqueAdvantage: e.target.value })}
          rows={3}
          placeholder="What makes you different from competitors?"
        />
        <Textarea
          label="Customer Description"
          value={profile.customerDescription}
          onChange={(e) => updateProfile({ customerDescription: e.target.value })}
          rows={3}
          placeholder="Describe your ideal customer..."
        />
      </div>

      {/* Danger zone */}
      <div className="card border-danger/15 space-y-3">
        <p className="label-tag">Danger Zone</p>
        <p className="text-[13px] text-textSecondary">
          Reset your profile and start onboarding again. This will clear all saved data.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm('Are you sure? This will clear all your data.')) {
              resetProfile();
              window.location.href = '/onboarding';
            }
          }}
        >
          Reset Profile
        </Button>
      </div>
    </div>
  );
};