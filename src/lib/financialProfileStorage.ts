import type { FinancialProfile } from "@/components/dashboard/types";

const guestStorageKey = "fintrack:financial-profile:guest";

export function getFinancialProfileStorageKey(userId?: string | null) {
  return userId ? `fintrack:financial-profile:${userId}` : guestStorageKey;
}

export function getSavedFinancialProfile(userId?: string | null) {
  const savedProfile = window.localStorage.getItem(
    getFinancialProfileStorageKey(userId),
  );

  if (!savedProfile) {
    return null;
  }

  return JSON.parse(savedProfile) as FinancialProfile;
}

export function saveFinancialProfile(
  profile: FinancialProfile,
  userId?: string | null,
) {
  window.localStorage.setItem(
    getFinancialProfileStorageKey(userId),
    JSON.stringify(profile),
  );
}
