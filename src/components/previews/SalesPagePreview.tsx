import { IconBolt, IconPalette, IconWorld, IconChartBar, IconHeadset, IconUsersGroup, IconHelpCircle, IconTrendingUp } from '@tabler/icons-react';
import type { ReactNode } from 'react';

export interface SiteCopy {
  eyebrow: string;
  headline: [string, string, string?];
  body: string;
  ctaPrimary: string;
  ctaSecondary: string;
  nav: string[];
  features: { icon: ReactNode; title: string; text: string }[];
  stats?: { value: string; label: string }[];
  dark?: boolean;
}

const ic = (I: typeof IconBolt) => <I size={22} stroke={1.75} />;

export const SALES_LATEST: SiteCopy = {
  eyebrow: 'SALES ENABLEMENT',
  headline: ['Build.', 'Impress.', 'Convert.'],
  body: 'EverGPT empowers Foundever sales teams to create enterprise-grade, brand-aligned web experiences in minutes — not weeks.',
  ctaPrimary: 'Explore Capabilities',
  ctaSecondary: 'See Use Cases',
  nav: ['Challenge', 'Capabilities', 'Use Cases', 'Impact'],
  features: [
    { icon: ic(IconBolt), title: 'Instant Webpage Creation', text: 'From prompt to published in minutes' },
    { icon: ic(IconPalette), title: 'Brand-Governed by Default', text: 'Foundever palette, layout and tone applied automatically' },
    { icon: ic(IconWorld), title: 'Global & Multilingual', text: 'Scale across regions without starting from scratch' },
    { icon: ic(IconChartBar), title: 'Visual Storytelling', text: 'Charts, infographics, comparison tables — all built in' },
  ],
  stats: [
    { value: '150K+', label: 'Foundever Associates' },
    { value: '45', label: 'Delivery Countries' },
    { value: '60+', label: 'Languages Supported' },
    { value: '↓70%', label: 'Asset Creation Time' },
  ],
};

/** The older live version: two lines of headline, two features, no stats band. */
export const SALES_LIVE: SiteCopy = {
  ...SALES_LATEST,
  headline: ['Build.', 'Impress.'],
  body: 'EverGPT helps Foundever sales teams create branded web pages faster.',
  features: SALES_LATEST.features.slice(0, 2),
  stats: undefined,
};

export const FAQ_COPY: SiteCopy = {
  eyebrow: 'ONBOARDING',
  headline: ['Welcome.', 'Settle in.', 'Grow.'],
  body: 'Everything new associates ask in their first two weeks, answered in one place.',
  ctaPrimary: 'Start here',
  ctaSecondary: 'Contact HR',
  nav: ['First week', 'Tools', 'Benefits', 'Contacts'],
  features: [
    { icon: ic(IconHelpCircle), title: 'Where do I find my schedule?', text: 'Your WFM portal, from day one' },
    { icon: ic(IconHeadset), title: 'Who is my team lead?', text: 'Listed in your welcome email' },
    { icon: ic(IconUsersGroup), title: 'Do I get a buddy?', text: 'Yes — for your first 90 days' },
  ],
  stats: [
    { value: '2 wks', label: 'Onboarding' },
    { value: '24/7', label: 'HR support' },
    { value: '90 days', label: 'Buddy programme' },
  ],
};

export const STORY_COPY: SiteCopy = {
  eyebrow: 'CUSTOMER STORY',
  headline: ['Faster.', 'Friendlier.', 'Telco.'],
  body: 'How a European telco cut handle time by 22% while lifting CSAT across five markets.',
  ctaPrimary: 'Read the story',
  ctaSecondary: 'Talk to sales',
  nav: ['Challenge', 'Approach', 'Results', 'Contact'],
  features: [
    { icon: ic(IconTrendingUp), title: '22% lower handle time', text: 'AI-assisted agents across 5 markets' },
    { icon: ic(IconHeadset), title: '+9 pts CSAT', text: 'Measured over two quarters' },
    { icon: ic(IconWorld), title: '5 languages', text: 'One playbook, localised' },
  ],
  stats: [
    { value: '−22%', label: 'Handle time' },
    { value: '+9', label: 'CSAT points' },
    { value: '5', label: 'Markets' },
  ],
};

export function SitePreview({ copy, brand = 'EverGPT × Foundever' }: { copy: SiteCopy; brand?: string }) {
  const [a, b, c] = copy.headline;
  return (
    <div className="pv-site">
      <div className="pv-nav">
        <div className="pv-brand">
          <b className="pv-brand-ever">EverGPT</b> {brand.replace('EverGPT ', '')}
        </div>
        <div className="pv-links">
          {copy.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
      <div className="pv-hero">
        <div className="pv-glow" />
        <div className="pv-hero-copy">
          <span className="pv-eyebrow">{copy.eyebrow}</span>
          <h1 className="pv-h1">
            <span>{a}</span>
            <span className="pv-accent">{b}</span>
            {c && <span>{c}</span>}
          </h1>
          <p className="pv-body">{copy.body}</p>
          <div className="pv-ctas">
            <span className="pv-cta">{copy.ctaPrimary}</span>
            <span className="pv-cta pv-cta-outline">{copy.ctaSecondary}</span>
          </div>
        </div>
        <div className="pv-features">
          {copy.features.map((f) => (
            <div key={f.title} className="pv-feature">
              <span className="pv-ficon">{f.icon}</span>
              <div>
                <div className="pv-ftitle">{f.title}</div>
                <div className="pv-ftext">{f.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {copy.stats && (
        <div className="pv-stats">
          {copy.stats.map((s) => (
            <div key={s.label} className="pv-stat">
              <div className="pv-stat-v">{s.value}</div>
              <div className="pv-stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
