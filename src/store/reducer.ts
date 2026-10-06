import type { Asset, AssetType, Chat, Status } from '../data/types';
import { SEED_ASSETS } from '../data/assets';
import { SEED_CHATS } from '../data/chats';

export const PANEL_DEFAULT = 520;
export const PANEL_MIN = 320;

export type View = 'home' | 'chat' | 'library' | 'design';
export type Tab = 'mine' | 'shared';
export type SortKey = 'edited' | 'name' | 'created';
export type Layout = 'list' | 'grid';

export interface Toast {
  id: number;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  actionTip?: string;
}

export type DialogState =
  | null
  | { kind: 'share'; assetId: string }
  | { kind: 'publish'; assetId: string }
  | { kind: 'delete'; assetId: string };

export interface State {
  view: View;
  chatId: string | null;
  chatPanelOpen: boolean;
  assets: Asset[];
  chats: Chat[];
  tab: Tab;
  search: string;
  typeFilter: AssetType | 'all';
  statusFilter: Status | 'all';
  sort: SortKey;
  layout: Layout;
  selectedId: string | null;
  panelOpen: boolean;
  renamingId: string | null;
  dialog: DialogState;
  toasts: Toast[];
  emptyLibrary: boolean;
  showPins: boolean;
  sidebarCollapsed: boolean;
  panelWidth: number;
  /** bumps on reset so components with local state remount */
  epoch: number;
}

export const initialState = (epoch = 0): State => ({
  view: 'home',
  chatId: null,
  chatPanelOpen: true,
  assets: SEED_ASSETS.map((a) => ({ ...a, sharedWith: [...a.sharedWith], sharePerms: { ...a.sharePerms } })),
  chats: SEED_CHATS.map((c) => ({ ...c })),
  tab: 'mine',
  search: '',
  typeFilter: 'all',
  statusFilter: 'all',
  sort: 'edited',
  layout: 'list',
  selectedId: null,
  panelOpen: false,
  renamingId: null,
  dialog: null,
  toasts: [],
  emptyLibrary: false,
  showPins: false,
  sidebarCollapsed: false,
  panelWidth: PANEL_DEFAULT,
  epoch,
});

export type Action =
  | { type: 'GO_HOME' }
  | { type: 'GO_LIBRARY'; selectId?: string; tab?: Tab }
  | { type: 'OPEN_CHAT'; chatId: string }
  | { type: 'GO_DESIGN' }
  | { type: 'SET_CHAT_PANEL'; open: boolean }
  | { type: 'ADD_CHAT'; chat: Chat }
  | { type: 'SET_TAB'; tab: Tab }
  | { type: 'SET_SEARCH'; search: string }
  | { type: 'SET_TYPE_FILTER'; value: AssetType | 'all' }
  | { type: 'SET_STATUS_FILTER'; value: Status | 'all' }
  | { type: 'SET_SORT'; value: SortKey }
  | { type: 'SET_LAYOUT'; value: Layout }
  | { type: 'SELECT'; id: string | null; open?: boolean }
  | { type: 'CLOSE_PANEL' }
  | { type: 'PATCH_ASSET'; id: string; patch: Partial<Asset> }
  | { type: 'INSERT_ASSET'; asset: Asset; index?: number }
  | { type: 'REMOVE_ASSET'; id: string }
  | { type: 'SET_RENAMING'; id: string | null }
  | { type: 'OPEN_DIALOG'; dialog: DialogState }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'PUSH_TOAST'; toast: Toast }
  | { type: 'DISMISS_TOAST'; id: number }
  | { type: 'SET_EMPTY_LIBRARY'; value: boolean }
  | { type: 'TOGGLE_PINS' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_PANEL_WIDTH'; width: number }
  | { type: 'RESET' };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GO_HOME':
      return { ...state, view: 'home', chatId: null };
    case 'GO_LIBRARY':
      return {
        ...state,
        view: 'library',
        chatId: null,
        tab: action.tab ?? state.tab,
        selectedId: action.selectId ?? state.selectedId,
        panelOpen: action.selectId ? true : state.panelOpen,
      };
    case 'GO_DESIGN':
      return { ...state, view: 'design', chatId: null };
    case 'OPEN_CHAT':
      return { ...state, view: 'chat', chatId: action.chatId, chatPanelOpen: true };
    case 'SET_CHAT_PANEL':
      return { ...state, chatPanelOpen: action.open };
    case 'ADD_CHAT':
      return { ...state, chats: [action.chat, ...state.chats] };
    case 'SET_TAB':
      return { ...state, tab: action.tab, selectedId: null, panelOpen: false };
    case 'SET_SEARCH':
      return { ...state, search: action.search };
    case 'SET_TYPE_FILTER':
      return { ...state, typeFilter: action.value };
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.value };
    case 'SET_SORT':
      return { ...state, sort: action.value };
    case 'SET_LAYOUT':
      return { ...state, layout: action.value };
    case 'SELECT':
      return { ...state, selectedId: action.id, panelOpen: action.open ?? state.panelOpen };
    case 'CLOSE_PANEL':
      return { ...state, panelOpen: false };
    case 'PATCH_ASSET':
      return { ...state, assets: state.assets.map((a) => (a.id === action.id ? { ...a, ...action.patch } : a)) };
    case 'INSERT_ASSET': {
      const assets = state.assets.filter((a) => a.id !== action.asset.id);
      const i = action.index ?? 0;
      assets.splice(Math.min(i, assets.length), 0, action.asset);
      return { ...state, assets };
    }
    case 'REMOVE_ASSET':
      return {
        ...state,
        assets: state.assets.filter((a) => a.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        panelOpen: state.selectedId === action.id ? false : state.panelOpen,
      };
    case 'SET_RENAMING':
      return { ...state, renamingId: action.id };
    case 'OPEN_DIALOG':
      return { ...state, dialog: action.dialog };
    case 'CLOSE_DIALOG':
      return { ...state, dialog: null };
    case 'PUSH_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast].slice(-2) };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'SET_EMPTY_LIBRARY':
      return { ...state, emptyLibrary: action.value, view: 'library', tab: 'mine', selectedId: null, panelOpen: false, search: '' };
    case 'TOGGLE_PINS':
      return { ...state, showPins: !state.showPins };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_PANEL_WIDTH':
      return { ...state, panelWidth: action.width };
    case 'RESET':
      return initialState(state.epoch + 1);
    default:
      return state;
  }
}
