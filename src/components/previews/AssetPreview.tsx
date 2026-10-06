import type { Asset } from '../../data/types';
import { DeckPreview } from './DeckPreview';
import { ReportPreview } from './ReportPreview';
import { FAQ_COPY, SALES_LATEST, SALES_LIVE, STORY_COPY, SitePreview, type SiteCopy } from './SalesPagePreview';
import { ScaledFrame } from './ScaledFrame';

export type PreviewVersion = 'latest' | 'live';

export const DESIGN_WIDTH: Record<Asset['previewKind'], number> = {
  sales: 1200,
  faq: 1200,
  story: 1200,
  deck: 960,
  report: 800,
};

function siteCopy(asset: Asset, version: PreviewVersion): SiteCopy {
  if (asset.previewKind === 'sales') {
    // The live version is behind the latest edit only while changes are pending.
    return version === 'live' && asset.status === 'changes_pending' ? SALES_LIVE : SALES_LATEST;
  }
  const base = asset.previewKind === 'faq' ? FAQ_COPY : STORY_COPY;
  if (asset.id === 'holiday-peak')
    return { ...base, eyebrow: 'HOLIDAY PEAK', headline: ['Ramp up.', 'Stay calm.', 'Deliver.'], body: asset.blurb };
  if (asset.id === 'buddy-programme')
    return { ...base, eyebrow: 'BUDDY PROGRAMME', headline: ['Pair up.', 'Learn fast.', 'Belong.'], body: asset.blurb };
  return base;
}

/** The asset rendered at full size; use inside ScaledFrame. */
export function AssetRender({ asset, version = 'latest' }: { asset: Asset; version?: PreviewVersion }) {
  switch (asset.previewKind) {
    case 'deck':
      return <DeckPreview title={asset.title} subtitle={asset.blurb} />;
    case 'report':
      return <ReportPreview title={asset.title} subtitle={asset.blurb} />;
    default:
      return <SitePreview copy={siteCopy(asset, version)} />;
  }
}

export function AssetPreview({ asset, version = 'latest', className }: { asset: Asset; version?: PreviewVersion; className?: string }) {
  return (
    <ScaledFrame width={DESIGN_WIDTH[asset.previewKind]} className={className}>
      <AssetRender asset={asset} version={version} />
    </ScaledFrame>
  );
}
