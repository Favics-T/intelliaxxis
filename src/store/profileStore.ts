import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BusinessProfile } from '../types/profile';
import { EMPTY_PROFILE } from '../types/profile';

interface ProfileStore {
  profile: BusinessProfile;
  hasCompletedOnboarding: boolean;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: EMPTY_PROFILE,
      hasCompletedOnboarding: false,

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      completeOnboarding: () =>
        set((state) => ({
          hasCompletedOnboarding: true,
          profile: {
            ...state.profile,
            isComplete: true,
            completedAt: new Date().toISOString(),
          },
        })),

      resetProfile: () =>
        set({
          profile: EMPTY_PROFILE,
          hasCompletedOnboarding: false,
        }),
    }),
    {
      name: 'intelliaxis-profile', // localStorage key
    },
  ),
);