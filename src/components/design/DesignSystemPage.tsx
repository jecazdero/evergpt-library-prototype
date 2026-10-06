import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconCopy,
  IconDots,
  IconEdit,
  IconFolderOpen,
  IconLayoutGrid,
  IconList,
  IconLock,
  IconPaperclip,
  IconPencil,
  IconSearch,
  IconShare,
  IconTrash,
  IconTriangleSquareCircle,
  IconUsers,
  IconWorld,
  IconX,
} from '@tabler/icons-react';
import { useState, type ReactNode } from 'react';
import type { Asset, Status, Visibility } from '../../data/types';
import { useStore } from '../../store/context';
import { IconLibrary, TypeIcon } from '../icons';
import { MenuButton } from '../Menu';
import { PermissionBadge, StatusBadge } from '../StatusBadge';
import { AvatarStack, PanelVisibility, VisibilityLabel } from '../VisibilityLabel';
import { VisibilityLadder } from '../dialogs/VisibilityLadder';

/* ---------- Reference data ---------- */

const SECTIONS = [
  { id: 'principles', label: 'Principles' },
  { id: 'color', label: 'Color' },
  { id: 'type', label: 'Typography' },
  { id: 'space', label: 'Spacing & radius' },
  { id: 'elevation', label: 'Elevation & motion' },
  { id: 'icons', label: 'Iconography' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'status', label: 'Status & visibility' },
  { id: 'nav', label: 'Navigation' },
  { id: 'inputs', label: 'Inputs & filters' },
  { id: 'overlays', label: 'Menus & overlays' },
  { id: 'cards', label: 'Cards & rows' },
  { id: 'feedback', label: 'Feedback' },
];

const PRINCIPLES = [
  { n: '01', title: 'Calm by default', text: 'Neutral surfaces and ink carry the UI. Brand violet is reserved for the primary action, selection and focus — never decoration.' },
  { n: '02', title: 'State is always visible', text: 'Every asset shows what it is, who can see it and whether the live version is current. Status and visibility are separate signals.' },
  { n: '03', title: 'Risk gets a colour', text: 'Red is only for “public on the web” and destructive actions. Amber is only for “changes pending”. If it is coloured, it matters.' },
  { n: '04', title: 'Chat-native', text: 'Assets are born in chat. Library patterns echo the chat surface (same tiles, cards, type) so the two feel like one product.' },
];

const COLOR_GROUPS: { name: string; note: string; tokens: string[] }[] = [
  { name: 'Brand', note: 'Primary action, selection, focus ring', tokens: ['--brand', '--brand-hover', '--brand-ink', '--brand-line', '--brand-soft', '--brand-tint'] },
  { name: 'Ink', note: 'Text hierarchy — use the lowest level that is still readable', tokens: ['--ink', '--ink-nav', '--ink-secondary', '--ink-muted', '--ink-footnote', '--ink-placeholder'] },
  { name: 'Surface & border', note: 'Layering is done with surfaces first, borders second', tokens: ['--surface', '--surface-sidebar', '--surface-muted', '--surface-chip', '--surface-tile', '--border-soft', '--border', '--border-control'] },
  { name: 'Semantic', note: 'Status pairs: background + on-colour, always used together', tokens: ['--status-published', '--on-status-published', '--status-review', '--on-status-review', '--public-bg', '--public-ink', '--callout-bg', '--callout-border'] },
];

const TYPE_SCALE = [
  { cls: 't-greeting', name: 'Greeting', spec: 'Figtree 28/36 · 600', sample: 'Good afternoon, Randy' },
  { cls: 't-title', name: 'Title', spec: 'Figtree 20/28 · 600', sample: 'Library' },
  { cls: 't-answer-heading', name: 'Answer heading', spec: 'Figtree 17/24 · 700', sample: 'Here’s your sales page' },
  { cls: 't-message', name: 'Message', spec: 'Noto Sans 15/22 · 400', sample: 'I drafted a landing page with three sections.' },
  { cls: 't-item-title', name: 'Item title', spec: 'Inter 14/20 · 500', sample: 'Sales enablement page' },
  { cls: 't-nav', name: 'Nav / body', spec: 'Inter 14/20 · 400', sample: 'New chat' },
  { cls: 't-button', name: 'Button', spec: 'Inter 14/20 · 500', sample: 'Publish' },
  { cls: 't-label', name: 'Label', spec: 'Inter 12/16 · 500', sample: 'Last edited' },
  { cls: 't-meta', name: 'Meta', spec: 'Inter 12/16 · 400', sample: 'Edited 2 hours ago' },
  { cls: 't-footnote', name: 'Footnote', spec: 'Noto Sans 11/16 · 400', sample: 'EverGPT can make mistakes.' },
];

const SPACE = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--space-8'];
const RADII = ['--radius-xs', '--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-full'];

const ICONS: { el: ReactNode; name: string }[] = [
  { el: <IconEdit size={18} stroke={1.5} />, name: 'edit' },
  { el: <IconLibrary />, name: 'library*' },
  { el: <IconSearch size={18} stroke={1.5} />, name: 'search' },
  { el: <IconShare size={18} stroke={1.5} />, name: 'share' },
  { el: <IconCopy size={18} stroke={1.5} />, name: 'copy' },
  { el: <IconPencil size={18} stroke={1.5} />, name: 'pencil' },
  { el: <IconTrash size={18} stroke={1.5} />, name: 'trash' },
  { el: <IconDots size={18} stroke={1.5} />, name: 'dots' },
  { el: <IconLock size={18} stroke={1.5} />, name: 'lock' },
  { el: <IconUsers size={18} stroke={1.5} />, name: 'users' },
  { el: <IconWorld size={18} stroke={1.5} />, name: 'world' },
  { el: <IconFolderOpen size={18} stroke={1.5} />, name: 'folder-open' },
];

const STATUSES: Status[] = ['draft', 'published', 'changes_pending', 'unpublished'];
const VISIBILITIES: Visibility[] = ['private', 'people', 'org', 'public'];

/** Minimal asset stub so real components can render in the gallery. */
const stub = (visibility: Visibility, sharedWith: string[] = []): Asset => ({
  id: `ds-${visibility}`,
  title: 'Sample asset',
  type: 'webpage',
  status: 'draft',
  visibility,
  sharedWith,
  sharePerms: {},
  ownerId: 'randy',
  permission: 'owner',
  sourceChatId: null,
  sourceChatTitle: '',
  createdAt: '2026-10-01T10:00:00',
  editedAt: '2026-10-01T10:00:00',
  keywords: [],
  previewKind: 'sales',
  blurb: '',
});

/* ---------- Layout helpers ---------- */

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={`ds-${id}`} className="ds-section">
      <h2 className="ds-h2">{title}</h2>
      {lead && <p className="ds-lead">{lead}</p>}
      {children}
    </section>
  );
}

/** One documented component: live preview on top, spec underneath. */
function Spec({ name, source, usage, children, wide }: { name: string; source: string; usage: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`ds-spec${wide ? ' is-wide' : ''}`}>
      <div className="ds-stage">{children}</div>
      <div className="ds-spec-foot">
        <div className="ds-spec-name">{name}</div>
        <code className="ds-code">{source}</code>
        <p className="ds-spec-usage">{usage}</p>
      </div>
    </div>
  );
}

function Swatch({ token }: { token: string }) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return (
    <div className="ds-swatch">
      <span className="ds-chip" style={{ background: `var(${token})` }} />
      <code className="ds-token">{token}</code>
      <span className="ds-hex">{value}</span>
    </div>
  );
}

/* ---------- Page ---------- */

export function DesignSystemPage() {
  const { dispatch } = useStore();
  const [active, setActive] = useState('principles');
  const [vis, setVis] = useState<Visibility>('people');
  const [seg, setSeg] = useState<'list' | 'grid'>('list');
  const [tab, setTab] = useState<'mine' | 'shared'>('mine');

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(`ds-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const toast = () => dispatch({ type: 'PUSH_TOAST', toast: { id: Date.now(), text: 'Link copied', actionLabel: 'Undo', onAction: () => {} } });

  return (
    <div className="ds">
      <aside className="ds-toc" aria-label="On this page">
        <div className="ds-toc-label">On this page</div>
        {SECTIONS.map((s) => (
          <button key={s.id} type="button" className={`ds-toc-item${active === s.id ? ' on' : ''}`} onClick={() => jump(s.id)}>
            {s.label}
          </button>
        ))}
      </aside>

      <main className="ds-main">
        <header className="ds-hero">
          <span className="eg-logo" aria-label="EverGPT">
            <span className="ever">Ever</span>
            <span className="gpt">GPT</span>
          </span>
          <h1 className="t-greeting">Components &amp; Design System</h1>
          <p className="ds-lead">
            Foundations and components used in the Library prototype. Tokens live in <code className="ds-code">src/styles/tokens.css</code>, static
            component classes (prefix <code className="ds-code">eg-</code>) in <code className="ds-code">components.css</code>. Everything on this page
            is rendered with production classes and React components — what you see is what ships.
          </p>
          <div className="ds-meta">
            <span className="st-badge st-published">
              <span className="st-dot" />
              v0.3 · Library prototype
            </span>
            <span className="ds-meta-txt">Icons: Tabler 1.5px · Fonts: Inter, Figtree, Noto Sans</span>
          </div>
        </header>

        <Section id="principles" title="Principles" lead="Four rules every new screen should pass before review.">
          <div className="ds-principles">
            {PRINCIPLES.map((p) => (
              <div key={p.n} className="ds-principle">
                <span className="ds-principle-n">{p.n}</span>
                <div className="t-item-title">{p.title}</div>
                <p className="ds-small">{p.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="color" title="Color" lead="Always reference tokens, never hex values. Semantic colours come in background / on-colour pairs.">
          {COLOR_GROUPS.map((g) => (
            <div key={g.name} className="ds-colorgroup">
              <div className="ds-h3">
                {g.name} <span className="ds-h3-note">{g.note}</span>
              </div>
              <div className="ds-swatches">
                {g.tokens.map((t) => (
                  <Swatch key={t} token={t} />
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section id="type" title="Typography" lead="Three families with clear jobs: Figtree for display, Noto Sans for conversation, Inter for UI chrome. Use the t-* utility classes.">
          <div className="ds-table">
            {TYPE_SCALE.map((t) => (
              <div key={t.cls} className="ds-type-row">
                <span className={t.cls}>{t.sample}</span>
                <span className="ds-type-name">{t.name}</span>
                <span className="ds-type-spec">{t.spec}</span>
                <code className="ds-code">.{t.cls}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="space" title="Spacing & radius" lead="4px base grid. Controls are 32px tall (28px small); icon buttons 36px. Radius grows with container size.">
          <div className="ds-two">
            <div className="ds-panel">
              <div className="ds-h3">Spacing</div>
              {SPACE.map((s) => (
                <div key={s} className="ds-space-row">
                  <code className="ds-token">{s}</code>
                  <span className="ds-space-bar" style={{ width: `var(${s})` }} />
                </div>
              ))}
            </div>
            <div className="ds-panel">
              <div className="ds-h3">Radius</div>
              <div className="ds-radii">
                {RADII.map((r) => (
                  <div key={r} className="ds-radius">
                    <span className="ds-radius-box" style={{ borderRadius: `var(${r})` }} />
                    <code className="ds-token">{r.replace('--radius-', '')}</code>
                  </div>
                ))}
              </div>
              <p className="ds-small">Badges xs · nav &amp; chips sm · buttons md · cards lg · dialogs xl · composer 2xl · avatars full</p>
            </div>
          </div>
        </Section>

        <Section id="elevation" title="Elevation & motion" lead="Two shadows only. Anything floating above content uses --shadow-menu; the composer has its own softer lift.">
          <div className="ds-two">
            <div className="ds-elev" style={{ boxShadow: 'var(--shadow-composer)' }}>
              <code className="ds-token">--shadow-composer</code>
              <span className="ds-small">Composer</span>
            </div>
            <div className="ds-elev" style={{ boxShadow: 'var(--shadow-menu)' }}>
              <code className="ds-token">--shadow-menu</code>
              <span className="ds-small">Menus, popovers, dialogs, toasts</span>
            </div>
          </div>
          <p className="ds-small ds-gap">
            Motion: <code className="ds-code">--ease-out</code> cubic-bezier(0.2, 0.7, 0.2, 1). 120–200ms for UI feedback, entering elements
            fade + rise 4–8px. Respect <code className="ds-code">prefers-reduced-motion</code>.
          </p>
        </Section>

        <Section id="icons" title="Iconography" lead="Tabler icons, 1.5px stroke, 18px in navigation and 16px inside buttons and menus. * = custom glyph in icons.tsx.">
          <div className="ds-icons">
            {ICONS.map((i) => (
              <div key={i.name} className="ds-icon">
                {i.el}
                <span>{i.name}</span>
              </div>
            ))}
          </div>
          <div className="ds-row ds-gap">
            <span className="eg-tile"><TypeIcon type="webpage" /></span>
            <span className="eg-tile"><TypeIcon type="presentation" /></span>
            <span className="eg-tile"><TypeIcon type="report" /></span>
            <span className="ds-small">Asset type tiles — <code className="ds-code">&lt;TypeIcon type /&gt;</code> inside <code className="ds-code">.eg-tile</code></span>
          </div>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className="ds-grid">
            <Spec name="Button" source=".eg-btn.primary | .secondary | .ghost | .danger" usage="One primary per view. Danger only inside confirmation dialogs.">
              <div className="ds-row">
                <button type="button" className="eg-btn primary">Publish</button>
                <button type="button" className="eg-btn secondary">Share</button>
                <button type="button" className="eg-btn ghost">Cancel</button>
                <button type="button" className="eg-btn danger">Delete</button>
              </div>
            </Spec>
            <Spec name="Sizes & states" source=".eg-btn.sm · .icon-only · [aria-disabled]" usage="Small for dense toolbars. Disabled buttons keep a tooltip explaining why.">
              <div className="ds-row">
                <button type="button" className="eg-btn secondary sm">Small</button>
                <button type="button" className="eg-btn secondary icon-only" aria-label="Copy link"><IconCopy size={16} stroke={1.5} /></button>
                <button type="button" className="eg-btn primary" aria-disabled="true">Disabled</button>
              </div>
            </Spec>
            <Spec name="Split button" source=".btn-group > .eg-btn" usage="Primary action plus related options, e.g. Update live version ▾.">
              <div className="btn-group">
                <button type="button" className="eg-btn primary">Update live version</button>
                <button type="button" className="eg-btn primary icon-only" aria-label="More"><IconChevronDown size={16} stroke={1.5} /></button>
              </div>
            </Spec>
            <Spec name="Icon & round buttons" source=".icon-btn · .eg-kebab · .eg-round" usage="Icon-only controls always carry aria-label + data-tip.">
              <div className="ds-row">
                <button type="button" className="icon-btn" aria-label="Share"><IconShare size={18} stroke={1.5} /></button>
                <button type="button" className="eg-kebab" aria-label="More"><IconDots size={18} stroke={1.5} /></button>
                <button type="button" className="eg-round neutral" aria-label="Attach"><IconPaperclip size={18} stroke={1.5} /></button>
                <button type="button" className="eg-round brand" aria-label="Send"><IconArrowUp size={18} stroke={1.75} /></button>
              </div>
            </Spec>
          </div>
        </Section>

        <Section id="status" title="Status & visibility" lead="Status answers “is the live version current?”, visibility answers “who can see it?”. Never merge them into one badge.">
          <div className="ds-grid">
            <Spec name="StatusBadge" source="<StatusBadge status short? />" usage="Dot = live on the web. Short labels kick in automatically when the list gets narrow.">
              <div className="ds-row ds-wrap">
                {STATUSES.map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
            </Spec>
            <Spec name="PermissionBadge" source="<PermissionBadge permission />" usage="Shown only on assets shared with me. Owner renders nothing.">
              <div className="ds-row">
                <PermissionBadge permission="editor" />
                <PermissionBadge permission="viewer" />
              </div>
            </Spec>
            <Spec name="VisibilityLabel" source="<VisibilityLabel asset variant='row' | 'grid' />" usage="Public is the only visibility that gets a filled, red treatment.">
              <div className="ds-row ds-wrap">
                <VisibilityLabel asset={stub('private')} />
                <VisibilityLabel asset={stub('people', ['ana', 'mark', 'jovana', 'luka'])} />
                <VisibilityLabel asset={stub('org')} />
                <VisibilityLabel asset={stub('public')} />
              </div>
            </Spec>
            <Spec name="PanelVisibility" source="<PanelVisibility asset onClick? />" usage="Larger, clickable variant used in the asset panel header to open Share.">
              <div className="ds-col">
                {VISIBILITIES.map((v) => (
                  <PanelVisibility key={v} asset={stub(v, ['ana', 'mark'])} onClick={() => {}} />
                ))}
              </div>
            </Spec>
          </div>
        </Section>

        <Section id="nav" title="Navigation">
          <div className="ds-grid">
            <Spec name="Sidebar nav item" source=".eg-nav · .is-active · .eg-label" usage="Active item uses brand tint; section labels are 12/16 muted.">
              <div className="ds-sidebar-sample">
                <button type="button" className="eg-nav"><IconEdit size={18} stroke={1.5} /><span>New chat</span></button>
                <button type="button" className="eg-nav is-active"><IconLibrary /><span>Library</span></button>
                <div className="eg-label">Tools</div>
                <button type="button" className="eg-nav"><IconTriangleSquareCircle size={18} stroke={1.5} /><span>GPTs</span><IconChevronDown size={16} stroke={1.5} className="chev" /></button>
              </div>
            </Spec>
            <Spec name="Tabs" source=".tabs > .tab.on + .tab-count" usage="Top-level split of a page (My assets / Shared with me).">
              <div className="tabs ds-tabs">
                <button type="button" className={`tab${tab === 'mine' ? ' on' : ''}`} onClick={() => setTab('mine')}>
                  My assets <span className="tab-count">12</span>
                </button>
                <button type="button" className={`tab${tab === 'shared' ? ' on' : ''}`} onClick={() => setTab('shared')}>
                  Shared with me <span className="tab-count">5</span>
                </button>
              </div>
            </Spec>
            <Spec name="User" source=".eg-user · .eg-avatar" usage="Bottom of sidebar. Avatar colours come from the person record.">
              <div className="eg-user">
                <span className="eg-avatar">RB</span>
                <span>
                  <b>Randy Bell</b>
                  <small>randy.bell@foundever.com</small>
                </span>
              </div>
            </Spec>
            <Spec name="Avatar stack" source="<AvatarStack ids max size />" usage="Max 3 faces, then +N. Overlap with a 2px surface ring.">
              <div className="ds-row">
                <AvatarStack ids={['ana', 'mark']} />
                <AvatarStack ids={['ana', 'mark', 'jovana', 'luka', 'sara']} />
              </div>
            </Spec>
          </div>
        </Section>

        <Section id="inputs" title="Inputs & filters">
          <div className="ds-grid">
            <Spec name="Search" source=".search + .search-kbd" usage="Brand ring on focus. Keyboard hint on the right, clear button once typed.">
              <label className="search ds-fill">
                <IconSearch size={16} stroke={1.5} />
                <input type="search" placeholder="Search assets and chats" />
                <span className="search-kbd">/</span>
              </label>
            </Spec>
            <Spec name="Text field" source=".field" usage="Dialogs and forms. 14/20 Inter, same focus ring as search.">
              <input className="field ds-fill" placeholder="Add people by name or email" />
            </Spec>
            <Spec name="Filter pill" source=".fpill · .fpill.on + .fpill-clear" usage="Inactive shows a chevron; active turns brand tint with an inline clear.">
              <div className="ds-row">
                <span className="fpill">
                  <button type="button" className="fpill-btn"><span className="fpill-name">Type:</span><span className="fpill-value">All</span><IconChevronDown size={14} stroke={1.5} /></button>
                </span>
                <span className="fpill on">
                  <button type="button" className="fpill-btn"><span className="fpill-name">Status:</span><span className="fpill-value">Published</span></button>
                  <button type="button" className="fpill-clear" aria-label="Clear"><IconX size={12} stroke={2} /></button>
                </span>
              </div>
            </Spec>
            <Spec name="Segmented control & sort" source=".seg > .seg-btn.on · .sort-btn" usage="Binary view switches. Sort is a quiet text button with a direction arrow.">
              <div className="ds-row">
                <button type="button" className="sort-btn">Last edited <IconArrowDown size={14} stroke={1.5} /></button>
                <span className="vdivider" />
                <div className="seg" role="radiogroup" aria-label="View">
                  <button type="button" role="radio" aria-checked={seg === 'list'} className={`seg-btn icon${seg === 'list' ? ' on' : ''}`} onClick={() => setSeg('list')} aria-label="List"><IconList size={16} stroke={1.5} /></button>
                  <button type="button" role="radio" aria-checked={seg === 'grid'} className={`seg-btn icon${seg === 'grid' ? ' on' : ''}`} onClick={() => setSeg('grid')} aria-label="Grid"><IconLayoutGrid size={16} stroke={1.5} /></button>
                </div>
              </div>
            </Spec>
            <Spec name="Composer" source=".eg-composer · .eg-chip · .eg-round" usage="The single entry point for creating. Max width 560px, 2xl radius, soft shadow." wide>
              <div className="eg-composer">
                <div className="ph">Ask EverGPT anything…</div>
                <div className="row">
                  <button type="button" className="eg-chip icon" aria-label="Attach"><IconPaperclip size={16} stroke={1.5} /></button>
                  <button type="button" className="eg-chip"><IconLibrary size={16} /> Library</button>
                  <button type="button" className="eg-round brand end" aria-label="Send"><IconArrowUp size={18} stroke={1.75} /></button>
                </div>
              </div>
            </Spec>
          </div>
        </Section>

        <Section id="overlays" title="Menus & overlays">
          <div className="ds-grid">
            <Spec name="Menu" source="<MenuButton items label align />" usage="Keyboard navigable, auto-flips near the viewport edge. Destructive item last, after a divider.">
              <MenuButton
                className="eg-btn secondary"
                label="Open sample menu"
                align="left"
                items={[
                  { label: 'Rename', icon: <IconPencil size={16} stroke={1.5} /> },
                  { label: 'Share', icon: <IconShare size={16} stroke={1.5} /> },
                  { label: 'Copy link', icon: <IconCopy size={16} stroke={1.5} /> },
                  { label: '', divider: true },
                  { label: 'Delete', icon: <IconTrash size={16} stroke={1.5} />, danger: true },
                ]}
              >
                Open menu <IconChevronDown size={16} stroke={1.5} />
              </MenuButton>
            </Spec>
            <Spec name="Tooltip" source="data-tip='…' data-tip-pos='right'" usage="Global layer — add the attribute, no component needed. Hover the button.">
              <button type="button" className="eg-btn secondary" data-tip="Copy link  ⌘C">Hover me</button>
            </Spec>
            <Spec name="Dialog" source="<Dialog> · .dialog-head / -body / -foot" usage="Title in Figtree 18/26. Primary action on the right, cancel ghost to its left." wide>
              <div className="dialog ds-dialog">
                <div className="dialog-head">
                  <div className="dialog-title">Share “Sales enablement page”</div>
                  <button type="button" className="icon-btn dialog-close" aria-label="Close"><IconX size={18} stroke={1.5} /></button>
                </div>
                <div className="dialog-body">
                  <div className="dialog-section-label">General access</div>
                  <VisibilityLadder value={vis} onChange={setVis} name="ds-ladder" />
                </div>
                <div className="dialog-foot">
                  <span className="flex1" />
                  <button type="button" className="eg-btn ghost">Cancel</button>
                  <button type="button" className="eg-btn primary">Save</button>
                </div>
              </div>
            </Spec>
          </div>
        </Section>

        <Section id="cards" title="Cards & rows">
          <div className="ds-grid">
            <Spec name="Asset card (chat)" source=".eg-asset · .eg-tile · .eg-kebab" usage="How an asset appears inside a chat answer. Click opens the side panel.">
              <div className="eg-asset ds-fill">
                <span className="eg-tile"><TypeIcon type="presentation" /></span>
                <div className="txt">
                  <div className="ttl">Q4 client review deck</div>
                  <div className="sub">Presentation · 8 slides</div>
                </div>
                <button type="button" className="eg-kebab" aria-label="More"><IconDots size={18} stroke={1.5} /></button>
              </div>
            </Spec>
            <Spec name="Library row" source=".eg-lhead / .eg-lrow" usage="Name · source chat · status · visibility · actions. Hover = sidebar surface." wide>
              <div className="ds-fill">
                <div className="eg-lhead"><span>Name</span><span>Status</span><span>Access</span><span>Edited</span><span /></div>
                <div className="eg-lrow">
                  <div className="main">
                    <span className="eg-tile"><TypeIcon type="webpage" /></span>
                    <div style={{ minWidth: 0 }}>
                      <div className="ttl">Sales enablement page</div>
                      <div className="sub">From <a href="#">Create webpage about sales</a></div>
                    </div>
                  </div>
                  <span><StatusBadge status="changes_pending" short /></span>
                  <span><VisibilityLabel asset={stub('public')} /></span>
                  <span>2h ago</span>
                  <button type="button" className="eg-kebab" aria-label="More"><IconDots size={18} stroke={1.5} /></button>
                </div>
              </div>
            </Spec>
          </div>
        </Section>

        <Section id="feedback" title="Feedback">
          <div className="ds-grid">
            <Spec name="Callout" source=".callout · .callout-title / -body" usage="Amber, inline. Explains consequences, not errors. Used for changes pending.">
              <div className="callout">
                <IconAlertTriangle size={16} stroke={1.75} />
                <div>
                  <div className="callout-title">Anyone with the link still sees the old version</div>
                  <div className="callout-body">You made 3 edits in chat since publishing. Update to push them live.</div>
                </div>
              </div>
            </Spec>
            <Spec name="Toast" source="dispatch({ type: 'PUSH_TOAST', toast })" usage="Bottom-centre, 4s, max two stacked. Offer Undo for reversible actions.">
              <div className="ds-col">
                <div className="toast ds-static">
                  <span>Link copied</span>
                  <button type="button" className="toast-action">Undo</button>
                </div>
                <button type="button" className="link-btn" onClick={toast}>Trigger a live toast</button>
              </div>
            </Spec>
            <Spec name="Empty state" source=".empty · .empty-tile / -title / -sub" usage="Icon tile, one-line title, helpful next step. Never a dead end." wide>
              <div className="empty ds-empty">
                <span className="empty-tile"><IconSearch size={22} stroke={1.5} /></span>
                <div className="empty-title">No assets match “roadmap”</div>
                <div className="empty-sub">Try a different word, or search in Shared with me</div>
                <button type="button" className="link-btn">Clear search</button>
              </div>
            </Spec>
          </div>
        </Section>

        <footer className="ds-footer">
          Questions or new patterns? Propose additions in the design channel before building one-offs. Tokens first, components second, screens last.
        </footer>
      </main>
    </div>
  );
}
