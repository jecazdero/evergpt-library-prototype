import { useEffect } from 'react';
import { AnnotationPins } from './components/AnnotationPins';
import { ChatView } from './components/chat/ChatView';
import { HomeView } from './components/chat/HomeView';
import { DialogHost } from './components/dialogs/DialogHost';
import { DesignSystemPage } from './components/design/DesignSystemPage';
import { LibraryPage } from './components/library/LibraryPage';
import { Sidebar } from './components/Sidebar';
import { Toasts } from './components/Toast';
import { TooltipLayer } from './components/Tooltip';
import { useStore } from './store/context';

export function App() {
  const { state, dispatch } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT';
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_SIDEBAR' });
        return;
      }
      if (e.shiftKey && (e.key === 'R' || e.key === 'r') && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        dispatch({ type: 'RESET' });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dispatch]);

  return (
    <div className="eg app" key={state.epoch}>
      <Sidebar />
      <div className="app-content">
        {state.view === 'home' && <HomeView />}
        {state.view === 'chat' && <ChatView />}
        {state.view === 'library' && <LibraryPage />}
        {state.view === 'design' && <DesignSystemPage />}
      </div>
      <DialogHost />
      <Toasts />
      <TooltipLayer />
      <AnnotationPins />
      <div className="desktop-note" role="note">
        Best viewed on desktop (1280px or wider).
      </div>
    </div>
  );
}
