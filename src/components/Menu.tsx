import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface MenuItem {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
  checked?: boolean;
  divider?: boolean;
}

interface MenuProps {
  anchor: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  align?: 'left' | 'right';
  label: string;
}

export function Menu({ anchor, open, onClose, items, align = 'right', label }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !anchor || !ref.current) return;
    const r = anchor.getBoundingClientRect();
    const m = ref.current.getBoundingClientRect();
    let top = r.bottom + 4;
    if (top + m.height > window.innerHeight - 8) top = Math.max(8, r.top - m.height - 4);
    let left = align === 'right' ? r.right - m.width : r.left;
    left = Math.max(8, Math.min(left, window.innerWidth - m.width - 8));
    setPos({ top, left });
  }, [open, anchor, align, items.length]);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const first = ref.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not([aria-disabled="true"])');
    first?.focus();
    const onDown = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node) || anchor?.contains(e.target as Node)) return;
      onClose();
    };
    const onScroll = (e: Event) => {
      if (ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('resize', onClose);
    document.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('resize', onClose);
      document.removeEventListener('scroll', onScroll, true);
    };
  }, [open, anchor, onClose]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const btns = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []);
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      btns[(i + 1) % btns.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      btns[(i - 1 + btns.length) % btns.length]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
      anchor?.focus();
    } else if (e.key === 'Tab') {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={ref}
      className="menu"
      role="menu"
      aria-label={label}
      style={pos ? { top: pos.top, left: pos.left } : { top: -9999, left: -9999 }}
      onKeyDown={onKeyDown}
    >
      {items.map((it, i) =>
        it.divider ? (
          <div key={`d${i}`} className="menu-divider" role="separator" />
        ) : (
          <button
            key={it.label}
            type="button"
            role="menuitem"
            className={`menu-item${it.danger ? ' danger' : ''}${it.checked ? ' checked' : ''}`}
            aria-disabled={it.disabled || undefined}
            onClick={(e) => {
              e.stopPropagation();
              if (it.disabled) return;
              onClose();
              it.onSelect?.();
            }}
          >
            {it.icon && <span className="menu-ico">{it.icon}</span>}
            <span className="menu-label">{it.label}</span>
            {it.checked && <span className="menu-check" aria-hidden="true">✓</span>}
          </button>
        ),
      )}
    </div>,
    document.body,
  );
}

/** A trigger button that owns a Menu. */
export function MenuButton({
  items,
  label,
  className,
  children,
  align,
  tip,
  pin,
}: {
  items: MenuItem[];
  label: string;
  className?: string;
  children: ReactNode;
  align?: 'left' | 'right';
  tip?: string;
  pin?: string;
}) {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button
        ref={btn}
        type="button"
        className={className}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        data-tip={open ? undefined : tip}
        data-pin={pin}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {children}
      </button>
      <Menu anchor={btn.current} open={open} onClose={() => setOpen(false)} items={items} align={align} label={label} />
    </>
  );
}
