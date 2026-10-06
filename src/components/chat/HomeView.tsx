import { IconArrowRight, IconExternalLink } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { isMine, relDate } from '../../store/selectors';
import { TypeIcon } from '../icons';
import { AssetPreview } from '../previews/AssetPreview';
import { StatusBadge } from '../StatusBadge';
import { Composer, Footnote } from './Composer';

const SHORTCUT_COUNT = 4;

/** Quick follow-ups offered once an asset is attached. */
const FOLLOW_UPS = ['Summarise the key points', 'Create a version for another audience', 'Update it with the latest numbers'];

function LibraryShortcut({ asset, active, onPick }: { asset: Asset; active: boolean; onPick: () => void }) {
  const { dispatch } = useStore();
  return (
    <div className={`lib-short${active ? ' is-active' : ''}`}>
      <button type="button" className="lib-short-main" aria-pressed={active} onClick={onPick}>
        <span className="lib-short-thumb">
          <span className={`gthumb-page gthumb-${asset.previewKind}`}>
            <AssetPreview asset={asset} />
          </span>
        </span>
        <span className="lib-short-body">
          <span className="lib-short-title">
            <TypeIcon type={asset.type} size={14} />
            <span className="ellipsis">{asset.title}</span>
          </span>
          <span className="lib-short-meta">
            <StatusBadge status={asset.status} short />
            <span>{relDate(asset.editedAt)}</span>
          </span>
        </span>
      </button>
      <button
        type="button"
        className="lib-short-open"
        aria-label={`Open ${asset.title} in Library`}
        data-tip="Open in Library"
        onClick={() => dispatch({ type: 'GO_LIBRARY', selectId: asset.id, tab: isMine(asset) ? 'mine' : 'shared' })}
      >
        <IconExternalLink size={14} stroke={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}

export function HomeView() {
  const { state, dispatch } = useStore();
  const [refId, setRefId] = useState<string | null>(null);
  const [text, setText] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);

  const recent = state.emptyLibrary
    ? []
    : [...state.assets].sort((x, y) => y.editedAt.localeCompare(x.editedAt)).slice(0, SHORTCUT_COUNT);
  const reference = state.assets.find((a) => a.id === refId) ?? null;

  const pick = (a: Asset) => {
    setRefId(refId === a.id ? null : a.id);
    input.current?.focus();
  };

  return (
    <main className="home" aria-label="New chat">
      <div className="home-center">
        <h1 className="t-greeting home-greeting">How can I help you today?</h1>
        <Composer
          ref={input}
          reference={reference}
          onReferenceChange={(a) => setRefId(a?.id ?? null)}
          value={text}
          onValueChange={setText}
        />
        {reference && (
          <div className="home-followups" aria-label="Suggested prompts">
            {FOLLOW_UPS.map((p) => (
              <button
                key={p}
                type="button"
                className="eg-chip home-followup"
                onClick={() => {
                  setText(p);
                  input.current?.focus();
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        {recent.length > 0 && (
          <section className="lib-shorts" aria-labelledby="lib-shorts-h">
            <div className="lib-shorts-head">
              <h2 id="lib-shorts-h" className="lib-shorts-h">
                Pick up from your Library
              </h2>
              <button type="button" className="link-btn lib-shorts-all" onClick={() => dispatch({ type: 'GO_LIBRARY' })}>
                View all
                <IconArrowRight size={14} stroke={1.75} aria-hidden="true" />
              </button>
            </div>
            <div className="lib-shorts-row">
              {recent.map((a) => (
                <LibraryShortcut key={a.id} asset={a} active={a.id === refId} onPick={() => pick(a)} />
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="home-foot">
        <Footnote />
      </div>
    </main>
  );
}
