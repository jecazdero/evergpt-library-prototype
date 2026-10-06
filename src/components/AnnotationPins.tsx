import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/context';

/** Annotation text from Figma node 12:100. */
const NOTES: { tag: string; title: string; text: string }[] = [
  {
    tag: 'Find',
    title: 'Library sits right under "New chat"',
    text: 'The asset becomes a first-class object in the nav, not a by-product buried in a chat. Each new asset also shows a light "Saved to Library" confirmation in chat to close the discovery loop.',
  },
  {
    tag: 'Find',
    title: 'One search, two tabs, two filters, two views',
    text: 'A full-width search sits above everything, because recall starts with "what was it called". It matches title, content and source-chat name. Ownership is the primary split (My assets / Shared with me). Only Type and Status filters, sorted by last edited. List is the default view because the metadata is what people act on; grid is one click away for recognising visual assets by thumbnail.',
  },
  {
    tag: 'Understand',
    title: 'Status and visibility are separate columns',
    text: 'Status answers "what version is live?" (Draft · Published · Changes pending · Unpublished). Visibility answers "who can see it?" (Only you → People → Foundever → Public). Only Public gets a strong colour: an unintended public page is the costliest mistake.',
  },
  {
    tag: 'Understand',
    title: 'Provenance on every row',
    text: 'Each asset links back to the chat it came from, the place to keep editing it. If that chat is deleted, the asset survives and says so.',
  },
  {
    tag: 'Act',
    title: 'Primary action follows state',
    text: 'Draft → Publish · Published → a confirmed Published state · Changes pending → Update live version. This is the riskiest combination (Public + stale), so the fix is the one brand-coloured button.',
  },
  {
    tag: 'Understand',
    title: 'Explain the risk in plain words',
    text: 'The callout states what visitors see today and how far behind it is. The Latest / Live toggle lets the owner check the gap before updating.',
  },
  {
    tag: 'Act',
    title: 'The Library is a launchpad, not an editor',
    text: 'Editing happens through conversation, so "Edit in new chat" opens a fresh chat with the asset loaded. Duplicate, Download, Rename, Unpublish and Delete live in the overflow menu. Making something Public always asks for confirmation; moving down is one click.',
  },
];

interface PinPos {
  n: number;
  x: number;
  y: number;
}

export function AnnotationPins() {
  const { state } = useStore();
  const [pins, setPins] = useState<PinPos[]>([]);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (!state.showPins) {
      setPins([]);
      return;
    }
    let raf = 0;
    let last = '';
    const tick = () => {
      const next: PinPos[] = [];
      for (let n = 1; n <= 7; n++) {
        const el = document.querySelector<HTMLElement>(`[data-pin="${n}"]`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.bottom < 0 || r.top > window.innerHeight) continue;
        // pin sits on the top-left corner of the element, nudged outward
        next.push({ n, x: r.left - 10, y: r.top - 10 });
      }
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setPins(next);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [state.showPins]);

  if (!state.showPins) return null;
  return createPortal(
    <div className="pins" aria-label="Annotation pins">
      {pins.map((p) => {
        const note = NOTES[p.n - 1];
        const left = p.x + 300 > window.innerWidth;
        return (
          <div key={p.n} className="pin-wrap" style={{ left: Math.max(4, p.x), top: Math.max(4, p.y) }}>
            <button
              type="button"
              className="pin"
              aria-label={`Annotation ${p.n}: ${note.title}`}
              onMouseEnter={() => setHover(p.n)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(p.n)}
              onBlur={() => setHover(null)}
            >
              {p.n}
            </button>
            {hover === p.n && (
              <div className={`pin-card${left ? ' to-left' : ''}`} role="tooltip">
                <span className={`pin-tag tag-${note.tag.toLowerCase()}`}>{note.tag}</span>
                <div className="pin-title">{note.title}</div>
                <p className="pin-text">{note.text}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>,
    document.body,
  );
}
