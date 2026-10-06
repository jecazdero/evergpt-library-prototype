import { IconBuilding, IconChevronDown, IconLock, IconUsers, IconWorld } from '@tabler/icons-react';
import type { Asset } from '../data/types';
import { personById } from '../data/people';

export function AvatarStack({ ids, max = 3, size = 22 }: { ids: string[]; max?: number; size?: number }) {
  const shown = ids.slice(0, max);
  const extra = ids.length - shown.length;
  return (
    <span className="avatar-stack" aria-hidden="true">
      {shown.map((id) => {
        const p = personById(id);
        return (
          <span key={id} className="avatar-sm" style={{ background: p.color, width: size, height: size }} title={p.name}>
            {p.initials}
          </span>
        );
      })}
      {extra > 0 && (
        <span className="avatar-sm avatar-more" style={{ width: size, height: size }}>
          +{extra}
        </span>
      )}
    </span>
  );
}

/** Visibility for list rows ("row") and grid cards ("grid"). */
export function VisibilityLabel({ asset, variant = 'row' }: { asset: Asset; variant?: 'row' | 'grid' }) {
  const v = asset.visibility;
  if (v === 'public')
    return (
      <span className="vis-public">
        <IconWorld size={14} stroke={1.5} aria-hidden="true" />
        Public
      </span>
    );
  if (v === 'org')
    return (
      <span className="vis vis-secondary">
        <IconBuilding size={14} stroke={1.5} aria-hidden="true" />
        Foundever
      </span>
    );
  if (v === 'people') {
    const ids = asset.sharedWith.filter((id) => id !== 'randy' || asset.ownerId !== 'randy');
    if (variant === 'grid')
      return (
        <span className="vis vis-secondary">
          <IconUsers size={14} stroke={1.5} aria-hidden="true" />
          {ids.length} {ids.length === 1 ? 'person' : 'people'}
        </span>
      );
    return (
      <span className="vis vis-secondary" aria-label={`Shared with ${ids.length} people`}>
        <AvatarStack ids={ids} />
        {ids.length}
      </span>
    );
  }
  return (
    <span className="vis vis-muted">
      <IconLock size={14} stroke={1.5} aria-hidden="true" />
      Only you
    </span>
  );
}

/** Larger visibility badge used in the asset panel. */
export function PanelVisibility({ asset, onClick }: { asset: Asset; onClick?: () => void }) {
  const v = asset.visibility;
  const ids = asset.sharedWith.filter((id) => id !== 'randy' || asset.ownerId !== 'randy');
  const content =
    v === 'public' ? (
      <>
        <IconWorld size={14} stroke={1.5} aria-hidden="true" />
        <span className="pvis-text">Public on the web</span>
        <IconChevronDown size={12} stroke={1.5} aria-hidden="true" />
      </>
    ) : v === 'org' ? (
      <>
        <IconBuilding size={14} stroke={1.5} aria-hidden="true" />
        <span className="pvis-text">Anyone at Foundever</span>
      </>
    ) : v === 'people' ? (
      <>
        <IconUsers size={14} stroke={1.5} aria-hidden="true" />
        <span className="pvis-text">
          Shared with {ids.length} {ids.length === 1 ? 'person' : 'people'}
        </span>
      </>
    ) : (
      <>
        <IconLock size={14} stroke={1.5} aria-hidden="true" />
        <span className="pvis-text">Only you</span>
      </>
    );
  const cls = v === 'public' ? 'pvis pvis-public' : 'pvis';
  if (!onClick) return <span className={cls}>{content}</span>;
  return (
    <button type="button" className={`${cls} pvis-btn`} onClick={onClick} aria-label="Change who can see it" data-tip="Change who can see it">
      {content}
    </button>
  );
}
