import type { Chat } from './types';

export const SEED_CHATS: Chat[] = [
  { id: 'chat-sales', title: 'Create webpage about sales', prompt: 'Create webpage about sales at foundever', assetId: 'sales-enablement', inSidebar: true },
  { id: 'chat-okrs', title: 'OKRs review', prompt: 'Turn our Q3 OKRs into a review deck', assetId: 'q3-okrs', inSidebar: true },
  { id: 'chat-ds', title: 'Design system updates', prompt: 'Summarise the design system updates as release notes', assetId: 'ds-notes', inSidebar: true },
  { id: 'chat-acme', title: 'Acme pitch prep', prompt: 'Build a pitch deck for Acme Retail', assetId: 'acme-pitch', inSidebar: false },
  { id: 'chat-faq', title: 'Onboarding FAQ', prompt: 'Create an onboarding FAQ page for new associates', assetId: 'onboarding-faq', inSidebar: false },
  { id: 'chat-telco', title: 'Telco case study', prompt: 'Write a customer story page for our telco client', assetId: 'telco-story', inSidebar: false },
  { id: 'chat-hiring', title: 'Hiring plan Q4', prompt: 'Draft the Q4 hiring plan as a report', assetId: 'q4-hiring', inSidebar: false },
];

/** Full display names used in the panel "Source chat" row. */
export const CHAT_FULL_TITLE: Record<string, string> = {
  'chat-sales': 'Create webpage about sales at foundever',
};
