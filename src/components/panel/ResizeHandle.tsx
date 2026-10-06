import { useRef, useState } from 'react';
import { useStore } from '../../store/context';
import { PANEL_DEFAULT, PANEL_MIN } from '../../store/reducer';

/** Keep at least this much room for the list next to the panel. */
const MAIN_MIN = 420;
const STEP = 16;

const maxWidth = (wrap: HTMLElement | null) => {
  const total = wrap?.parentElement?.getBoundingClientRect().width ?? window.innerWidth;
  return Math.max(PANEL_MIN, Math.min(960, total - MAIN_MIN));
};

/** Drag handle on the panel's left edge. Drag, arrow keys, or double-click to reset. */
export function ResizeHandle() {
  const { state, dispatch } = useStore();
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, w: 0 });

  const wrap = () => ref.current?.parentElement ?? null;
  const set = (w: number) => {
    const clamped = Math.round(Math.max(PANEL_MIN, Math.min(maxWidth(wrap()), w)));
    dispatch({ type: 'SET_PANEL_WIDTH', width: clamped });
  };

  return (
    <div
      ref={ref}
      className={`panel-resize${dragging ? ' is-dragging' : ''}`}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
      aria-valuenow={state.panelWidth}
      aria-valuemin={PANEL_MIN}
      aria-valuemax={maxWidth(wrap())}
      tabIndex={0}
      data-tip={dragging ? undefined : 'Drag to resize · double-click to reset'}
      data-tip-pos="right"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        start.current = { x: e.clientX, w: state.panelWidth };
        setDragging(true);
        document.body.classList.add('is-resizing');
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        // the panel is on the right, so dragging left makes it wider
        set(start.current.w + (start.current.x - e.clientX));
      }}
      onPointerUp={(e) => {
        if (!dragging) return;
        e.currentTarget.releasePointerCapture(e.pointerId);
        setDragging(false);
        document.body.classList.remove('is-resizing');
      }}
      onLostPointerCapture={() => {
        setDragging(false);
        document.body.classList.remove('is-resizing');
      }}
      onDoubleClick={() => set(PANEL_DEFAULT)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          set(state.panelWidth + STEP);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          set(state.panelWidth - STEP);
        } else if (e.key === 'Home') {
          e.preventDefault();
          set(PANEL_DEFAULT);
        }
      }}
    />
  );
}
