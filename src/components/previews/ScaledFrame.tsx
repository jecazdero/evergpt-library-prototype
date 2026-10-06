import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Renders children at a fixed design width and scales them down to fit the container width,
 * so previews are real, crisp DOM rather than images.
 */
export function ScaledFrame({ width, children, className }: { width: number; children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const s = o.clientWidth / width;
      setScale(s);
      setH(i.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={outer} className={`scaled ${className ?? ''}`} style={{ height: h || undefined }} aria-hidden="true">
      <div
        ref={inner}
        className="scaled-inner"
        style={{ width, transform: `scale(${scale})`, visibility: scale ? 'visible' : 'hidden' }}
      >
        {children}
      </div>
    </div>
  );
}
