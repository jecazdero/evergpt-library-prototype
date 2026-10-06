import { IconCheck, IconCopy, IconLoader2, IconRefresh, IconUpload, IconUsers, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { isMine, TYPE_LABEL } from '../../store/selectors';
import { StatusBadge } from '../StatusBadge';
import { PanelVisibility } from '../VisibilityLabel';

function UpdateLiveButton({ asset }: { asset: Asset }) {
  const { actions } = useStore();
  const [phase, setPhase] = useState<'idle' | 'confirm' | 'loading'>('idle');
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const n = asset.editsSincePublish ?? 0;

  useEffect(() => {
    if (phase !== 'confirm') return;
    pop.current?.querySelector<HTMLButtonElement>('[data-autofocus]')?.focus();
    const onDown = (e: MouseEvent) => {
      if (pop.current?.contains(e.target as Node) || btn.current?.contains(e.target as Node)) return;
      setPhase('idle');
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [phase]);

  const run = () => {
    setPhase('loading');
    window.setTimeout(() => actions.updateLive(asset.id), 900);
  };

  const audience =
    asset.visibility === 'public'
      ? 'Anyone with the link'
      : asset.visibility === 'org'
        ? 'Everyone at Foundever'
        : asset.visibility === 'people'
          ? 'People you shared with'
          : 'You';

  return (
    <span className="anchor">
      <button
        ref={btn}
        type="button"
        className="eg-btn primary"
        data-pin="5"
        aria-expanded={phase === 'confirm'}
        aria-busy={phase === 'loading'}
        disabled={phase === 'loading'}
        onClick={() => (asset.visibility === 'public' ? setPhase(phase === 'confirm' ? 'idle' : 'confirm') : run())}
      >
        {phase === 'loading' ? (
          <IconLoader2 size={16} stroke={1.75} className="spin" aria-hidden="true" />
        ) : (
          <IconRefresh size={16} stroke={1.75} aria-hidden="true" />
        )}
        {phase === 'loading' ? 'Updating…' : 'Update live version'}
      </button>
      {phase === 'confirm' && (
        <div
          ref={pop}
          className="popover"
          role="dialog"
          aria-label="Confirm update"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              setPhase('idle');
              btn.current?.focus();
            }
          }}
        >
          <div className="popover-title">
            Push {n} {n === 1 ? 'edit' : 'edits'} live?
          </div>
          <div className="popover-text">{audience} will see the latest version.</div>
          <div className="popover-actions">
            <button type="button" className="eg-btn secondary sm" onClick={() => setPhase('idle')}>
              Cancel
            </button>
            <button type="button" className="eg-btn primary sm" data-autofocus onClick={run}>
              Update
            </button>
          </div>
        </div>
      )}
    </span>
  );
}

export function PanelHeader({
  asset,
  onClose,
  label,
  showState = false,
}: {
  asset: Asset;
  onClose?: () => void;
  label?: string;
  /** show status + visibility in the header (the chat preview panel has no summary block) */
  showState?: boolean;
}) {
  const { dispatch, actions } = useStore();
  const mine = isMine(asset);
  // Editors share the owner's publishing rights; viewers can only copy.
  const canShare = mine || asset.permission === 'editor';
  const canPublish = canShare;

  const share = canShare && (
    <button
      type="button"
      className="eg-btn secondary"
      onClick={() => dispatch({ type: 'OPEN_DIALOG', dialog: { kind: 'share', assetId: asset.id } })}
    >
      <IconUsers size={16} stroke={1.75} aria-hidden="true" />
      Share
    </button>
  );

  let buttons: React.ReactNode;
  if (!canPublish) {
    buttons = (
      <button type="button" className="eg-btn primary" data-pin="5" onClick={() => actions.duplicateAndEdit(asset)}>
        <IconCopy size={16} stroke={1.75} aria-hidden="true" />
        Duplicate and edit
      </button>
    );
  } else if (asset.status === 'draft' || asset.status === 'unpublished') {
    buttons = (
      <>
        {share}
        <button
          type="button"
          className="eg-btn primary"
          data-pin="5"
          onClick={() => dispatch({ type: 'OPEN_DIALOG', dialog: { kind: 'publish', assetId: asset.id } })}
        >
          <IconUpload size={16} stroke={1.75} aria-hidden="true" />
          {asset.status === 'draft' ? 'Publish' : 'Republish'}
        </button>
      </>
    );
  } else if (asset.status === 'published') {
    // Live version is current: nothing to push, so the primary slot reads as a confirmed state.
    buttons = (
      <>
        {share}
        <button type="button" className="eg-btn primary is-done" data-pin="5" disabled>
          <IconCheck size={16} stroke={1.75} aria-hidden="true" />
          Published
        </button>
      </>
    );
  } else {
    buttons = (
      <>
        {share}
        <UpdateLiveButton asset={asset} />
      </>
    );
  }

  return (
    <div className="panel-head">
      <button type="button" className="eg-kebab" aria-label="Close panel" data-tip="Close (Esc)" onClick={onClose ?? (() => dispatch({ type: 'CLOSE_PANEL' }))}>
        <IconX size={18} stroke={1.5} aria-hidden="true" />
      </button>
      {showState ? (
        <div className="panel-type panel-type-state">
          <span className="panel-type-text">{label ?? TYPE_LABEL[asset.type]}</span>
          <span className="panel-type-meta">
            <StatusBadge status={asset.status} short />
            <PanelVisibility
              asset={asset}
              onClick={canShare ? () => dispatch({ type: 'OPEN_DIALOG', dialog: { kind: 'share', assetId: asset.id } }) : undefined}
            />
          </span>
        </div>
      ) : (
        <span className="panel-type">{label ?? TYPE_LABEL[asset.type]}</span>
      )}
      {buttons}
    </div>
  );
}
