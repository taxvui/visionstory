'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Locale, TRANSLATIONS } from '@/lib/i18n';
import { StockAvatar, VoiceOption, STOCK_AVATARS, VOICE_CATALOG } from '@/lib/catalog';
import { CreditTransaction, ProjectRecord, UserAccount } from '@/lib/db';

interface ProviderKeysStatus {
  openai: boolean;
  gemini: boolean;
  elevenlabs: boolean;
  replicate: boolean;
}

interface ApiKeySummary {
  id: string;
  name: string;
  rawPreview: string;
  createdAt: string;
}

interface VisionStoryContextValue {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (typeof TRANSLATIONS)['en'];
  user: UserAccount;
  avatars: StockAvatar[];
  voices: VoiceOption[];
  projects: ProjectRecord[];
  ledger: CreditTransaction[];
  apiKeys: ApiKeySummary[];
  providerKeysConfigured: ProviderKeysStatus;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  ledgerModalOpen: boolean;
  setLedgerModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshState: () => Promise<void>;
  claimWeeklyBonus: () => Promise<void>;
}

const DEFAULT_USER: UserAccount = {
  id: 'usr_creator_01',
  name: 'Creator Studio',
  email: 'creator@visionstory.local',
  provider: 'demo',
  plan: 'free',
  billingCycle: 'monthly',
  credits: 10,
  autoRecharge: false,
  autoRechargeThreshold: 10,
  autoRechargePack: 100,
  createdAt: new Date().toISOString(),
};

const VisionStoryContext = createContext<VisionStoryContextValue | null>(null);

export function VisionStoryProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [user, setUser] = useState<UserAccount>(DEFAULT_USER);
  const [avatars, setAvatars] = useState<StockAvatar[]>(STOCK_AVATARS);
  const [voices, setVoices] = useState<VoiceOption[]>(VOICE_CATALOG);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [ledger, setLedger] = useState<CreditTransaction[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeySummary[]>([]);
  const [providerKeysConfigured, setProviderKeysConfigured] = useState<ProviderKeysStatus>({
    openai: false,
    gemini: false,
    elevenlabs: false,
    replicate: false,
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3600);
  }, []);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vs_locale', loc);
    }
  }, []);

  const refreshState = useCallback(async () => {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.user) setUser(data.user);
      if (data.avatars) setAvatars(data.avatars);
      if (data.voices) setVoices(data.voices);
      if (data.projects) setProjects(data.projects);
      if (data.ledger) setLedger(data.ledger);
      if (data.apiKeys) setApiKeys(data.apiKeys);
      if (data.providerKeysConfigured) setProviderKeysConfigured(data.providerKeysConfigured);
    } catch {
      // ignore offline boot
    }
  }, []);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('vs_locale') : null;
    if (saved === 'vi' || saved === 'en') {
      setLocaleState(saved);
    }
    refreshState();
  }, [refreshState]);

  const claimWeeklyBonus = useCallback(async () => {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'claim_weekly_bonus' }),
    });
    if (res.ok) {
      const data = await res.json();
      await refreshState();
      showToast(
        locale === 'vi'
          ? `Đã nhận +${data.bonus} credits thưởng ghé thăm hàng tuần!`
          : `Claimed +${data.bonus} Weekly Visit Bonus credits!`
      );
    }
  }, [locale, refreshState, showToast]);

  const t = TRANSLATIONS[locale] as unknown as (typeof TRANSLATIONS)['en'];

  return (
    <VisionStoryContext.Provider
      value={{
        locale,
        setLocale,
        t,
        user,
        avatars,
        voices,
        projects,
        ledger,
        apiKeys,
        providerKeysConfigured,
        authModalOpen,
        setAuthModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        ledgerModalOpen,
        setLedgerModalOpen,
        toastMessage,
        showToast,
        refreshState,
        claimWeeklyBonus,
      }}
    >
      {children}
      {toastMessage && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 200,
            background: 'hsl(222, 18%, 13%)',
            border: '1px solid var(--border-strong)',
            borderLeft: '4px solid var(--accent-brand)',
            padding: '13px 18px',
            borderRadius: 12,
            boxShadow: 'var(--shadow-elevated)',
            fontSize: '0.9rem',
            fontWeight: 600,
            maxWidth: 400,
          }}
        >
          {toastMessage}
        </div>
      )}
    </VisionStoryContext.Provider>
  );
}

export function useVisionStory() {
  const ctx = useContext(VisionStoryContext);
  if (!ctx) {
    throw new Error('useVisionStory must be used inside VisionStoryProvider');
  }
  return ctx;
}
