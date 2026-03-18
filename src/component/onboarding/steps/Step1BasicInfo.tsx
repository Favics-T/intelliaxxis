import { type FC, useState } from 'react';
import { useProfileStore } from '../../../store/profileStore';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import {
  INDUSTRIES,
  type BusinessStage,
  type RevenueRange,
  type TeamSize,
} from '../../../types/profile';

const STAGES: BusinessStage[] = [
  'Idea Stage',
  'Early Startup',
  'Growing Startup',
  'Established Business',
  'Scaling Company',
];

const REVENUE_RANGES: RevenueRange[] = [
  'Pre-revenue',
  'Under $50K',
  '$50K - $200K',
  '$200K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M - $20M',
  '$20M+',
];

const TEAM_SIZES: TeamSize[] = [
  'Solo founder',
  '2 - 5',
  '6 - 20',
  '21 - 50',
  '51 - 200',
  '200+',
];

interface Props { onNext: () => void }

export const Step1BasicInfo: FC<Props> = ({ onNext }) => {
  const { profile, updateProfile } = useProfileStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!profile.businessName.trim()) e.businessName = 'Business name is required';
    if (!profile.founderName.trim())  e.founderName  = 'Your name is required';
    if (!profile.industry)            e.industry     = 'Please select an industry';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onNext();
  };

  return (
    <div className="animate-[fade-up_0.4s_ease-out_both] space-y-8">
      {/* Heading */}
      <div>
        <div className="label-tag">Step 1 of 5</div>
        <h2 className="text-2xl font-bold tracking-tight text-textPrimary">
          Tell us about your business
        </h2>
        <p className="mt-2 text-sm text-textSecondary">
          This helps IntelliAxis personalise every insight and recommendation to your specific context.
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Business Name"
            placeholder="e.g. Acme Technologies"
            value={profile.businessName}
            onChange={(e) => updateProfile({ businessName: e.target.value })}
            error={errors.businessName}
          />
          <Input
            label="Your Name"
            placeholder="e.g. James Okafor"
            value={profile.founderName}
            onChange={(e) => updateProfile({ founderName: e.target.value })}
            error={errors.founderName}
          />
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Industry
          </label>
          <select
            value={profile.industry}
            onChange={(e) => updateProfile({ industry: e.target.value })}
            className="input-field appearance-none cursor-pointer"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i} className="bg-surface2">{i}</option>
            ))}
          </select>
          {errors.industry && (
            <p className="text-[11px] text-danger">{errors.industry}</p>
          )}
        </div>

        {/* Sub-sector */}
        <Input
          label="Sub-sector (optional)"
          placeholder="e.g. Mobile payments, B2B SaaS, Fast fashion"
          value={profile.subSector}
          onChange={(e) => updateProfile({ subSector: e.target.value })}
        />

        {/* Stage + Revenue */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
              Business Stage
            </label>
            <select
              value={profile.businessStage}
              onChange={(e) => updateProfile({ businessStage: e.target.value as BusinessStage })}
              className="input-field appearance-none cursor-pointer"
            >
              {STAGES.map((s) => (
                <option key={s} value={s} className="bg-surface2">{s}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
              Annual Revenue
            </label>
            <select
              value={profile.revenueRange}
              onChange={(e) => updateProfile({ revenueRange: e.target.value as RevenueRange })}
              className="input-field appearance-none cursor-pointer"
            >
              {REVENUE_RANGES.map((r) => (
                <option key={r} value={r} className="bg-surface2">{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Team size */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-textSecondary">
            Team Size
          </label>
          <div className="flex flex-wrap gap-2">
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => updateProfile({ teamSize: size })}
                className={`rounded-full border px-4 py-1.5 font-mono text-[11px] transition-all ${
                  profile.teamSize === size
                    ? 'border-cyan/60 bg-cyan/10 text-cyan'
                    : 'border-white/10 bg-surface text-textSecondary hover:border-white/20'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Continue →</Button>
      </div>
    </div>
  );
};