import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/context';

export function RenameInput({ id, title }: { id: string; title: string }) {
  const { dispatch, actions } = useStore();
  const [value, setValue] = useState(title);
  const ref = useRef<HTMLInputElement>(null);
  const done = useRef(false);
  const finish = (save: boolean) => {
    if (done.current) return;
    done.current = true;
    if (save) actions.rename(id, value);
    else dispatch({ type: 'SET_RENAMING', id: null });
  };
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <input
      ref={ref}
      className="rename-input"
      value={value}
      aria-label="Asset name"
      onChange={(e) => setValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === 'Enter') finish(true);
        if (e.key === 'Escape') finish(false);
      }}
      onBlur={() => finish(true)}
    />
  );
}
