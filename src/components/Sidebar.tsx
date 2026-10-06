import {
  IconChevronDown,
  IconEdit,
  IconFolderOpen,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMapPin,
  IconPalette,
  IconRefresh,
  IconTriangleSquareCircle,
} from '@tabler/icons-react';
import { useStore } from '../store/context';
import { IconLibrary } from './icons';
import { MenuButton } from './Menu';

export function Sidebar() {
  const { state, dispatch } = useStore();
  const chats = state.chats.filter((c) => c.inSidebar);
  const collapsed = state.sidebarCollapsed;
  /** Tooltips only matter when labels are hidden. */
  const tip = (label: string) => (collapsed ? label : undefined);

  return (
    <nav className={`eg-sidebar sidebar${collapsed ? ' is-collapsed' : ''}`} aria-label="EverGPT">
      <div className="sidebar-top">
        {!collapsed && (
          <span className="eg-logo" aria-label="EverGPT">
            <span className="ever">Ever</span>
            <span className="gpt">GPT</span>
          </span>
        )}
        <button
          type="button"
          className="sidebar-toggle"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          data-tip={collapsed ? 'Expand sidebar  ⌘\\' : 'Collapse sidebar  ⌘\\'}
          data-tip-pos="right"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        >
          {collapsed ? (
            <IconLayoutSidebarLeftExpand size={18} stroke={1.5} aria-hidden="true" />
          ) : (
            <IconLayoutSidebarLeftCollapse size={18} stroke={1.5} aria-hidden="true" />
          )}
        </button>
      </div>
      <button
        type="button"
        className="eg-nav"
        aria-label={collapsed ? 'New chat' : undefined}
        data-tip={tip('New chat')}
        data-tip-pos="right"
        onClick={() => dispatch({ type: 'GO_HOME' })}
      >
        <IconEdit size={18} stroke={1.5} aria-hidden="true" />
        <span className="nav-label">New chat</span>
      </button>
      <button
        type="button"
        className={`eg-nav${state.view === 'library' ? ' is-active' : ''}`}
        aria-current={state.view === 'library' ? 'page' : undefined}
        aria-label={collapsed ? 'Library' : undefined}
        data-tip={tip('Library')}
        data-tip-pos="right"
        onClick={() => dispatch({ type: 'GO_LIBRARY' })}
        data-pin="1"
      >
        <IconLibrary />
        <span className="nav-label">Library</span>
      </button>
      {collapsed ? <div className="sidebar-sep" /> : <div className="eg-label">Tools</div>}
      <button
        type="button"
        className="eg-nav"
        aria-label={collapsed ? 'GPTs' : undefined}
        data-tip={collapsed ? 'GPTs' : 'Not part of this prototype'}
        data-tip-pos="right"
      >
        <IconTriangleSquareCircle size={18} stroke={1.5} aria-hidden="true" />
        <span className="nav-label">GPTs</span>
        {!collapsed && <IconChevronDown size={16} stroke={1.5} className="chev" aria-hidden="true" />}
      </button>
      {!collapsed && (
        <>
          <div className="eg-label">Chats</div>
          <div className="sidebar-chats">
            {chats.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`eg-nav chat-row${state.view === 'chat' && state.chatId === c.id ? ' is-active' : ''}`}
                onClick={() => dispatch({ type: 'OPEN_CHAT', chatId: c.id })}
              >
                <span className="ellipsis">{c.title}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <div className="sidebar-spacer" />
      <button
        type="button"
        className={`eg-nav${state.view === 'design' ? ' is-active' : ''}`}
        aria-current={state.view === 'design' ? 'page' : undefined}
        aria-label={collapsed ? 'Design System' : undefined}
        data-tip={tip('Design System')}
        data-tip-pos="right"
        onClick={() => dispatch({ type: 'GO_DESIGN' })}
      >
        <IconPalette size={18} stroke={1.5} aria-hidden="true" />
        <span className="nav-label">Design System</span>
      </button>
      <MenuButton
        className="eg-user user-btn"
        label="Demo menu"
        align="left"
        tip={collapsed ? 'Randy Bell · Demo menu' : 'Demo menu'}
        items={[
          { label: 'Reset demo', icon: <IconRefresh size={16} stroke={1.5} />, onSelect: () => dispatch({ type: 'RESET' }) },
          { label: 'Show empty Library', icon: <IconFolderOpen size={16} stroke={1.5} />, onSelect: () => dispatch({ type: 'SET_EMPTY_LIBRARY', value: true }) },
          {
            label: state.showPins ? 'Hide annotation pins' : 'Show annotation pins',
            icon: <IconMapPin size={16} stroke={1.5} />,
            onSelect: () => dispatch({ type: 'TOGGLE_PINS' }),
          },
        ]}
      >
        <span className="eg-avatar">RB</span>
        {!collapsed && (
          <span className="user-text">
            <b>Randy Bell</b>
            <small>randy.bell@foundever.com</small>
          </span>
        )}
      </MenuButton>
    </nav>
  );
}
