import type { Asset, AssetType, Status, Visibility } from '../data/types';
import { ME } from '../data/people';
import { TODAY } from '../data/assets';
import type { State, Tab } from './reducer';

const DAY = 86400000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dayIndex = (iso: string) => {
  const d = new Date(iso);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
};

export const daysAgo = (iso: string) => dayIndex(TODAY) - dayIndex(iso);

export const shortDate = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

/** "Today", "1d ago" … "5d ago", otherwise "Sep 28". */
export const relDate = (iso: string) => {
  const n = daysAgo(iso);
  if (n <= 0) return 'Today';
  if (n <= 5) return `${n}d ago`;
  return shortDate(iso);
};

/** Long form for the panel: "2 days ago". */
export const relDateLong = (iso: string) => {
  const n = daysAgo(iso);
  if (n <= 0) return 'Today';
  if (n === 1) return 'Yesterday';
  if (n <= 5) return `${n} days ago`;
  return shortDate(iso);
};

export const isMine = (a: Asset) => a.ownerId === ME;

export const TYPE_LABEL: Record<AssetType, string> = {
  webpage: 'Webpage',
  presentation: 'Presentation',
  report: 'Report',
};

export const TYPE_PLURAL: Record<AssetType, string> = {
  webpage: 'Webpages',
  presentation: 'Presentations',
  report: 'Reports',
};

export const STATUS_LABEL: Record<Status, string> = {
  draft: 'Draft',
  published: 'Published',
  changes_pending: 'Changes pending',
  unpublished: 'Unpublished',
};

export const VIS_ORDER: Visibility[] = ['private', 'people', 'org', 'public'];
export const visRank = (v: Visibility) => VIS_ORDER.indexOf(v);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const fakeUrl = (a: Asset) => `https://ever.foundever.com/p/${slugify(a.title).replace(/-page$/, '')}`;

export type MatchKind = 'title' | 'content' | 'chat' | null;

export function matchAsset(a: Asset, q: string): MatchKind {
  const s = q.trim().toLowerCase();
  if (!s) return 'title';
  if (a.title.toLowerCase().includes(s)) return 'title';
  if (a.keywords.some((k) => k.toLowerCase().includes(s))) return 'content';
  if (a.sourceChatId && a.sourceChatTitle.toLowerCase().includes(s)) return 'chat';
  return null;
}

const inTab = (a: Asset, tab: Tab) => (tab === 'mine' ? isMine(a) : !isMine(a));

export function tabAssets(state: State, tab: Tab): Asset[] {
  if (tab === 'mine' && state.emptyLibrary) return [];
  return state.assets.filter((a) => inTab(a, tab));
}

export function visibleAssets(state: State): Asset[] {
  const list = tabAssets(state, state.tab).filter(
    (a) =>
      matchAsset(a, state.search) !== null &&
      (state.typeFilter === 'all' || a.type === state.typeFilter) &&
      (state.statusFilter === 'all' || a.status === state.statusFilter),
  );
  const sorted = [...list];
  if (state.sort === 'edited') sorted.sort((x, y) => y.editedAt.localeCompare(x.editedAt));
  if (state.sort === 'created') sorted.sort((x, y) => y.createdAt.localeCompare(x.createdAt));
  if (state.sort === 'name') sorted.sort((x, y) => x.title.localeCompare(y.title));
  return sorted;
}

export function tabCount(state: State, tab: Tab): number {
  return tabAssets(state, tab).filter((a) => matchAsset(a, state.search) !== null).length;
}
