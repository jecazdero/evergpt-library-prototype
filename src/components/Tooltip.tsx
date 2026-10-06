import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/** One global tooltip for every element with a data-tip attribute (hover or keyboard focus). */
export function TooltipLayer() {
  const [tip, setTip] = useState<{ text: string; x: number; y: number; pos: 'above' | 'below' | 'right' } | null>(null);

  useEffect(() => {
    let current: HTMLElement | null = null;
    let timer = 0;
    const show = (el: HTMLElement) => {
      const text = el.getAttribute('data-tip');
      if (!text) return;
      const r = el.getBoundingClientRect();
      if (el.getAttribute('data-tip-pos') === 'right') {
        setTip({ text, x: r.right + 8, y: r.top + r.height / 2, pos: 'right' });
        return;
      }
      const below = r.top < 44;
      setTip({ text, x: r.left + r.width / 2, y: below ? r.bottom + 6 : r.top - 6, pos: below ? 'below' : 'above' });
    };
    const over = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.('[data-tip]') as HTMLElement | null;
      if (el === current) return;
      current = el;
      window.clearTimeout(timer);
      if (!el) {
        setTip(null);
        return;
      }
      setTip(null);
      timer = window.setTimeout(() => show(el), e.type === 'focusin' ? 0 : 350);
    };
    const hide = () => {
      current = null;
      window.clearTimeout(timer);
      setTip(null);
    };
    document.addEventListener('mouseover', over);
    document.addEventListener('focusin', over);
    document.addEventListener('mousedown', hide);
    document.addEventListener('scroll', hide, true);
    return () => {
      document.removeEventListener('mouseover', over);
      document.removeEventListener('focusin', over);
      document.removeEventListener('mousedown', hide);
      document.removeEventListener('scroll', hide, true);
    };
  }, []);

  if (!tip) return null;
  return createPortal(
    <div
      className={`tooltip${tip.pos === 'above' ? '' : ` ${tip.pos}`}`}
      role="tooltip"
      style={{ left: tip.pos === 'right' ? tip.x : Math.max(8, Math.min(tip.x, window.innerWidth - 8)), top: tip.y }}
    >
      {tip.text}
    </div>,
    document.body,
  );
}
