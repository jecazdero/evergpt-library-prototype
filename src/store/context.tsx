import { createContext, useContext, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from 'react';
import { initialState, reducer, type Action, type State, type Toast } from './reducer';
import type { Asset, SharePermission, Visibility } from '../data/types';
import { TODAY } from '../data/assets';
import { personById } from '../data/people';
import { fakeUrl, slugify, visRank } from './selectors';

interface Ctx {
  state: State;
  dispatch: Dispatch<Action>;
  actions: ReturnType<typeof makeActions>;
}

const StoreContext = createContext<Ctx | null>(null);

let toastSeq = 1;
let assetSeq = 1;

const VIS_TOAST: Record<Visibility, string> = {
  private: 'Now visible to you only',
  people: 'Now visible to people you added only',
  org: 'Now visible to Foundever only',
  public: 'Now public on the web',
};

const PUBLISH_TOAST: Record<Visibility, string> = {
  private: 'Published · only you can open it',
  people: 'Published to the people you added',
  org: 'Published to Foundever',
  public: 'Published on the web',
};

const EXT: Record<Asset['type'], string> = { webpage: 'html', presentation: 'pptx', report: 'pdf' };

function makeActions(get: () => State, dispatch: Dispatch<Action>) {
  const find = (id: string) => get().assets.find((a) => a.id === id);

  const toast = (t: Omit<Toast, 'id'>) => dispatch({ type: 'PUSH_TOAST', toast: { ...t, id: toastSeq++ } });

  const restore = (prev: Asset) => {
    const exists = find(prev.id);
    if (exists) dispatch({ type: 'PATCH_ASSET', id: prev.id, patch: prev });
  };

  const copyLink = (a: Asset) => {
    const url = fakeUrl(a);
    try {
      void navigator.clipboard?.writeText(url).catch(() => undefined);
    } catch {
      /* clipboard not available — the toast is enough for the demo */
    }
    toast({ text: 'Link copied' });
  };

  const duplicate = (a: Asset, opts?: { silent?: boolean }) => {
    const id = `copy-${assetSeq++}-${a.id}`;
    const copy: Asset = {
      ...a,
      id,
      title: `Copy of ${a.title}`,
      status: 'draft',
      visibility: 'private',
      sharedWith: [],
      sharePerms: {},
      ownerId: 'randy',
      permission: 'owner',
      createdAt: TODAY,
      editedAt: TODAY,
      livePublishedAt: undefined,
      unpublishedAt: undefined,
      editsSincePublish: undefined,
    };
    dispatch({ type: 'INSERT_ASSET', asset: copy, index: 0 });
    if (!opts?.silent) toast({ text: 'Duplicated' });
    return copy;
  };

  /** Opens a fresh chat seeded with the asset. */
  const editInNewChat = (a: Asset) => {
    const chatId = `chat-new-${assetSeq++}`;
    dispatch({
      type: 'ADD_CHAT',
      chat: { id: chatId, title: `Edit: ${a.title}`, prompt: `Continue editing "${a.title}"`, assetId: a.id, inSidebar: true },
    });
    dispatch({ type: 'OPEN_CHAT', chatId });
  };

  return {
    toast,
    copyLink,
    duplicate,
    editInNewChat,

    /** Starts a new chat from the home composer with a Library asset as its reference. */
    startChatWithAsset(a: Asset, prompt: string) {
      const chatId = `chat-ref-${assetSeq++}`;
      const title = prompt.length > 40 ? `${prompt.slice(0, 40).trimEnd()}…` : prompt;
      dispatch({ type: 'ADD_CHAT', chat: { id: chatId, title, prompt, assetId: a.id, inSidebar: true } });
      dispatch({ type: 'OPEN_CHAT', chatId });
    },

    openSourceChat(a: Asset) {
      if (a.sourceChatId) dispatch({ type: 'OPEN_CHAT', chatId: a.sourceChatId });
      else editInNewChat(a);
    },

    duplicateAndEdit(a: Asset) {
      const copy = duplicate(a, { silent: true });
      toast({ text: `Copied to My assets` });
      editInNewChat(copy);
    },

    updateLive(id: string) {
      dispatch({
        type: 'PATCH_ASSET',
        id,
        patch: { status: 'published', livePublishedAt: TODAY, editsSincePublish: 0 },
      });
      toast({ text: 'Live version updated', actionLabel: 'View live', actionTip: 'Opens the public page' });
    },

    publish(id: string, visibility: Visibility) {
      const a = find(id);
      if (!a) return;
      dispatch({
        type: 'PATCH_ASSET',
        id,
        patch: { status: 'published', visibility, livePublishedAt: TODAY, editsSincePublish: 0, unpublishedAt: undefined },
      });
      toast({ text: PUBLISH_TOAST[visibility] });
    },

    unpublish(id: string) {
      const prev = find(id);
      if (!prev) return;
      dispatch({ type: 'PATCH_ASSET', id, patch: { status: 'unpublished', unpublishedAt: TODAY, visibility: 'private' } });
      toast({ text: `Unpublished "${prev.title}"`, actionLabel: 'Undo', onAction: () => restore(prev) });
    },

    /** Moving down the ladder is one click with undo. Moving up is confirmed by the caller. */
    setVisibility(id: string, v: Visibility) {
      const prev = find(id);
      if (!prev || prev.visibility === v) return;
      dispatch({ type: 'PATCH_ASSET', id, patch: { visibility: v } });
      if (visRank(v) < visRank(prev.visibility)) {
        toast({ text: VIS_TOAST[v], actionLabel: 'Undo', onAction: () => restore(prev) });
      } else {
        toast({ text: VIS_TOAST[v] });
      }
    },

    sharePeople(id: string, perms: Record<string, SharePermission>, added: string[]) {
      const a = find(id);
      if (!a) return;
      const sharedWith = Object.keys(perms);
      dispatch({ type: 'PATCH_ASSET', id, patch: { sharedWith, sharePerms: perms } });
      if (added.length) {
        const names = added.map((p) => personById(p).name);
        const text = names.length === 1 ? `Shared with ${names[0]}` : `Shared with ${names.length} people`;
        toast({ text });
      }
    },

    rename(id: string, title: string) {
      const t = title.trim();
      if (t) dispatch({ type: 'PATCH_ASSET', id, patch: { title: t } });
      dispatch({ type: 'SET_RENAMING', id: null });
    },

    remove(id: string) {
      const s = get();
      const index = s.assets.findIndex((a) => a.id === id);
      const prev = s.assets[index];
      if (!prev) return;
      dispatch({ type: 'REMOVE_ASSET', id });
      toast({
        text: 'Deleted',
        actionLabel: 'Undo',
        onAction: () => dispatch({ type: 'INSERT_ASSET', asset: prev, index }),
      });
    },

    removeShared(id: string) {
      const s = get();
      const index = s.assets.findIndex((a) => a.id === id);
      const prev = s.assets[index];
      if (!prev) return;
      dispatch({ type: 'REMOVE_ASSET', id });
      toast({
        text: 'Removed from your Library',
        actionLabel: 'Undo',
        onAction: () => dispatch({ type: 'INSERT_ASSET', asset: prev, index }),
      });
    },

    download(a: Asset) {
      toast({ text: `Downloading ${slugify(a.title)}.${EXT[a.type]}` });
    },
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState());
  const ref = useRef(state);
  ref.current = state;
  const actions = useMemo(() => makeActions(() => ref.current, dispatch), []);
  const value = useMemo(() => ({ state, dispatch, actions }), [state, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore outside provider');
  return ctx;
}
