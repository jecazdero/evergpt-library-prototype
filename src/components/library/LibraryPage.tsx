import { IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/context';
import type { Tab } from '../../store/reducer';
import { tabCount, visibleAssets } from '../../store/selectors';
import { AssetPanel } from '../panel/AssetPanel';
import { ResizeHandle } from '../panel/ResizeHandle';
import { AssetGrid } from './AssetGrid';
import { AssetList } from './AssetList';
import { EmptyLibrary, NoResults } from './EmptyState';
import { Toolbar } from './Toolbar';

const isTyping = (el: EventTarget | null) => {
  const t = el as HTMLElement | null;
  return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
};

function SearchBox() {
  const { state, dispatch } = useStore();
  const [value, setValue] = useState(state.search);
  const ref = useRef<HTMLInputElement>(null);

  // keep in sync when search is cleared from elsewhere
  useEffect(() => setValue(state.search), [state.search]);

  useEffect(() => {
    if (value === state.search) return;
    const t = window.setTimeout(() => dispatch({ type: 'SET_SEARCH', search: value }), 120);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <label className="search" data-pin="2">
      <IconSearch size={16} stroke={1.5} aria-hidden="true" />
      <input
        ref={ref}
        id="library-search"
        type="search"
        value={value}
        placeholder="Search assets by name, content or source chat"
        aria-label="Search assets by name, content or source chat"
        autoComplete="off"
        onChange={(e) => setValue(e.target.value)}
      />
      {value ? (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          data-tip="Clear search"
          onClick={() => {
            setValue('');
            dispatch({ type: 'SET_SEARCH', search: '' });
            ref.current?.focus();
          }}
        >
          <IconX size={14} stroke={1.5} aria-hidden="true" />
        </button>
      ) : (
        <kbd className="search-kbd" aria-hidden="true">
          /
        </kbd>
      )}
    </label>
  );
}

function Tabs() {
  const { state, dispatch } = useStore();
  const tabs: { key: Tab; label: string }[] = [
    { key: 'mine', label: 'My assets' },
    { key: 'shared', label: 'Shared with me' },
  ];
  return (
    <div className="tabs" role="tablist" aria-label="Library sections">
      {tabs.map((t) => {
        const on = state.tab === t.key;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={on}
            className={`tab${on ? ' on' : ''}`}
            onClick={() => dispatch({ type: 'SET_TAB', tab: t.key })}
          >
            {t.label}
            <span className="tab-count">{tabCount(state, t.key)}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LibraryPage() {
  const { state, dispatch } = useStore();
  const assets = visibleAssets(state);
  const panelAsset = state.panelOpen ? state.assets.find((a) => a.id === state.selectedId) : undefined;
  const filtered = state.typeFilter !== 'all' || state.statusFilter !== 'all';
  const ref = useRef({ state, assets });
  ref.current = { state, assets };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { state: s, assets: list } = ref.current;
      if (s.dialog || document.querySelector('.menu, .popover')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const typing = isTyping(e.target);
      const inSearch = (e.target as HTMLElement)?.id === 'library-search';

      if (e.key === '/' && !typing) {
        e.preventDefault();
        document.getElementById('library-search')?.focus();
        return;
      }
      if (e.key === 'Escape' && (!typing || inSearch)) {
        if (s.panelOpen) {
          e.preventDefault();
          dispatch({ type: 'CLOSE_PANEL' });
          const row = document.querySelector<HTMLElement>(`[data-id="${s.selectedId}"]`);
          if (!inSearch) row?.focus();
        } else if (s.search) {
          e.preventDefault();
          dispatch({ type: 'SET_SEARCH', search: '' });
        }
        return;
      }
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && (!typing || inSearch) && list.length) {
        e.preventDefault();
        const i = list.findIndex((a) => a.id === s.selectedId);
        const next = e.key === 'ArrowDown' ? Math.min(list.length - 1, i + 1) : Math.max(0, i === -1 ? 0 : i - 1);
        const id = list[next].id;
        dispatch({ type: 'SELECT', id });
        const el = document.querySelector<HTMLElement>(`[data-id="${id}"]`);
        el?.scrollIntoView({ block: 'nearest' });
        if (!inSearch) el?.focus({ preventScroll: true });
        return;
      }
      if (e.key === 'Enter' && s.selectedId && (inSearch || (e.target as HTMLElement)?.getAttribute('role') === 'row')) {
        e.preventDefault();
        dispatch({ type: 'SELECT', id: s.selectedId, open: true });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dispatch]);

  const mineEmpty = state.tab === 'mine' && state.emptyLibrary;

  return (
    <div className="library">
      <main className="lib-main" aria-label="Library">
        <header className="lib-header">
          <h1 className="t-title">Library</h1>
          <p className="lib-sub">Everything you made in EverGPT chats, in one place</p>
        </header>
        <div className="lib-search-row">
          <SearchBox />
        </div>
        <Tabs />
        {mineEmpty ? (
          <EmptyLibrary />
        ) : (
          <>
            <Toolbar />
            <div className={`lib-scroll${state.layout === 'grid' ? ' is-grid' : ''}`}>
              {assets.length === 0 ? (
                <NoResults query={state.search.trim()} filtered={filtered} />
              ) : state.layout === 'list' ? (
                <AssetList assets={assets} />
              ) : (
                <AssetGrid assets={assets} />
              )}
            </div>
          </>
        )}
      </main>
      {panelAsset && (
        <div className="panel-wrap" style={{ width: state.panelWidth, ['--panel-w' as string]: `${state.panelWidth}px` }}>
          <ResizeHandle />
          <AssetPanel key={panelAsset.id} asset={panelAsset} />
        </div>
      )}
    </div>
  );
}
