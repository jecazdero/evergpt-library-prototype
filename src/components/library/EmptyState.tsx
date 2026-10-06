import { IconEdit, IconFolderOpen, IconSearch } from '@tabler/icons-react';
import { useStore } from '../../store/context';

export function NoResults({ query, filtered }: { query: string; filtered: boolean }) {
  const { state, dispatch } = useStore();
  const other = state.tab === 'mine' ? 'Shared with me' : 'My assets';
  return (
    <div className="empty">
      <span className="empty-tile">
        <IconSearch size={22} stroke={1.5} aria-hidden="true" />
      </span>
      <div className="empty-title">{query ? `No assets match "${query}"` : 'No assets match these filters'}</div>
      <div className="empty-sub">{query ? `Try a different word, or search in ${other}` : 'Try a different type or status'}</div>
      <button
        type="button"
        className="link-btn"
        onClick={() => {
          if (query) dispatch({ type: 'SET_SEARCH', search: '' });
          if (filtered || !query) {
            dispatch({ type: 'SET_TYPE_FILTER', value: 'all' });
            dispatch({ type: 'SET_STATUS_FILTER', value: 'all' });
          }
        }}
      >
        {query ? 'Clear search' : 'Clear filters'}
      </button>
    </div>
  );
}

const PROMPTS = ['Create a webpage about…', 'Draft a client report…', 'Build a 5-slide deck…'];

export function EmptyLibrary() {
  const { dispatch } = useStore();
  return (
    <div className="empty empty-lib">
      <span className="empty-tile">
        <IconFolderOpen size={22} stroke={1.5} aria-hidden="true" />
      </span>
      <div className="t-title">Assets you create in chats show up here</div>
      <div className="empty-sub">Webpages, reports and presentations land in your Library automatically, with a link back to the chat they came from.</div>
      <button type="button" className="eg-btn secondary" onClick={() => dispatch({ type: 'GO_HOME' })}>
        <IconEdit size={16} stroke={1.5} aria-hidden="true" />
        New chat
      </button>
      <div className="empty-chips">
        {PROMPTS.map((p) => (
          <button key={p} type="button" className="eg-chip" onClick={() => dispatch({ type: 'GO_HOME' })}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
