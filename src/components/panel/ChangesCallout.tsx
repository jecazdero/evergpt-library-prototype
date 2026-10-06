import { IconAlertTriangle } from '@tabler/icons-react';
import { useRef } from 'react';
import type { Asset } from '../../data/types';
import { personById } from '../../data/people';
import { isMine, shortDate } from '../../store/selectors';

const HEADLINE: Record<Asset['visibility'], string> = {
  public: 'Anyone with the link still sees the old version',
  org: 'Everyone at Foundever still sees the old version',
  people: 'People you shared with still see the old version',
  private: 'The live version is behind your latest edit',
};

/** Amber callout for "changes pending"; collapses (animated) once the live version is updated. */
export function ChangesCallout({ asset }: { asset: Asset }) {
  const open = asset.status === 'changes_pending';
  const last = useRef<{ title: string; body: string } | null>(null);

  if (open) {
    const n = asset.editsSincePublish ?? 0;
    const who = isMine(asset) ? 'You' : personById(asset.ownerId).name;
    last.current = {
      title: HEADLINE[asset.visibility],
      body: `Live version published ${shortDate(asset.livePublishedAt ?? asset.editedAt)}. ${who} made ${n} ${n === 1 ? 'edit' : 'edits'} in chat since then. ${isMine(asset) ? 'Update to push them live.' : ''}`.trim(),
    };
  }
  if (!last.current) return null;

  return (
    <div className={`collapse${open ? ' open' : ''}`} aria-hidden={!open}>
      <div className="collapse-inner">
        <div className="callout" role="note" data-pin="6">
          <IconAlertTriangle size={16} stroke={1.75} aria-hidden="true" />
          <div>
            <div className="callout-title">{last.current.title}</div>
            <div className="callout-body">{last.current.body}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
