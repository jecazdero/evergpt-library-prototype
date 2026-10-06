import { IconLink, IconX } from '@tabler/icons-react';
import { useMemo, useRef, useState } from 'react';
import type { Asset, SharePermission, Visibility } from '../../data/types';
import { ME, PEOPLE, personById } from '../../data/people';
import { useStore } from '../../store/context';
import { visRank } from '../../store/selectors';
import { Dialog } from '../Dialog';
import { ConfirmPublicDialog } from './ConfirmPublicDialog';
import { VisibilityLadder } from './VisibilityLadder';

function PersonAvatar({ id, size = 32 }: { id: string; size?: number }) {
  const p = personById(id);
  return (
    <span className="avatar-sm" style={{ background: p.color, width: size, height: size, fontSize: size > 24 ? 11 : 8, borderWidth: 0 }}>
      {p.initials}
    </span>
  );
}

export function ShareDialog({ asset }: { asset: Asset }) {
  const { dispatch, actions } = useStore();
  const initial = useMemo(() => {
    const p: Record<string, SharePermission> = {};
    asset.sharedWith.forEach((id) => {
      if (id !== ME && id !== asset.ownerId) p[id] = asset.sharePerms[id] ?? 'viewer';
    });
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [perms, setPerms] = useState<Record<string, SharePermission>>(initial);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [pendingPublic, setPendingPublic] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const close = () => dispatch({ type: 'CLOSE_DIALOG' });

  const suggestions = query.trim()
    ? PEOPLE.filter(
        (p) =>
          p.id !== ME &&
          p.id !== asset.ownerId &&
          !(p.id in perms) &&
          (p.name.toLowerCase().includes(query.trim().toLowerCase()) || p.email.toLowerCase().includes(query.trim().toLowerCase())),
      )
    : [];

  const add = (id: string) => {
    setPerms((p) => ({ ...p, [id]: 'viewer' }));
    setQuery('');
    setActive(0);
    input.current?.focus();
  };

  const changeAccess = (v: Visibility) => {
    if (v === asset.visibility) return;
    if (v === 'public' && visRank(v) > visRank(asset.visibility)) {
      setPendingPublic(true);
      return;
    }
    actions.setVisibility(asset.id, v);
  };

  const done = () => {
    const ids = Object.keys(perms);
    const added = ids.filter((id) => !(id in initial));
    const keepMe: Record<string, SharePermission> =
      asset.ownerId !== ME && asset.sharedWith.includes(ME) ? { [ME]: asset.sharePerms[ME] ?? 'viewer' } : {};
    const changed = ids.length !== Object.keys(initial).length || ids.some((id) => initial[id] !== perms[id]);
    if (changed) actions.sharePeople(asset.id, { ...keepMe, ...perms }, added);
    if (asset.visibility === 'private' && ids.length) actions.setVisibility(asset.id, 'people');
    close();
  };

  const listId = 'share-suggestions';

  return (
    <>
      <Dialog
        labelId="share-title"
        title={`Share "${asset.title}"`}
        onClose={done}
        closable
        footer={
          <>
            <button type="button" className="eg-btn secondary" onClick={() => actions.copyLink(asset)}>
              <IconLink size={16} stroke={1.75} aria-hidden="true" />
              Copy link
            </button>
            <span className="flex1" />
            <button type="button" className="eg-btn primary" onClick={done}>
              Done
            </button>
          </>
        }
      >
        <div className="dialog-section-label">People</div>
        <div className="combo">
          <input
            ref={input}
            data-autofocus
            className="field"
            placeholder="Add people by name or email"
            aria-label="Add people by name or email"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls={listId}
            aria-activedescendant={suggestions[active] ? `sugg-${suggestions[active].id}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (!suggestions.length) return;
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => (a + 1) % suggestions.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => (a - 1 + suggestions.length) % suggestions.length);
              } else if (e.key === 'Enter') {
                e.preventDefault();
                add(suggestions[active].id);
              } else if (e.key === 'Escape') {
                e.stopPropagation();
                setQuery('');
              }
            }}
          />
          {suggestions.length > 0 && (
            <ul className="combo-list" role="listbox" id={listId}>
              {suggestions.map((p, i) => (
                <li
                  key={p.id}
                  id={`sugg-${p.id}`}
                  role="option"
                  aria-selected={i === active}
                  className={`combo-opt${i === active ? ' on' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    add(p.id);
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  <PersonAvatar id={p.id} size={24} />
                  <span className="person-text">
                    <span className="person-name">{p.name}</span>
                    <span className="person-email">{p.email}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ul className="people-list">
          <li className="person-row">
            <PersonAvatar id={asset.ownerId} />
            <span className="person-text">
              <span className="person-name">
                {personById(asset.ownerId).name}
                {asset.ownerId === ME && ' (you)'}
              </span>
              <span className="person-email">{personById(asset.ownerId).email}</span>
            </span>
            <span className="person-role">Owner</span>
          </li>
          {Object.keys(perms).map((id) => {
            const p = personById(id);
            return (
              <li key={id} className="person-row">
                <PersonAvatar id={id} />
                <span className="person-text">
                  <span className="person-name">{p.name}</span>
                  <span className="person-email">{p.email}</span>
                </span>
                <select
                  className="perm-select"
                  aria-label={`Permission for ${p.name}`}
                  value={perms[id]}
                  onChange={(e) => setPerms((x) => ({ ...x, [id]: e.target.value as SharePermission }))}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  type="button"
                  className="eg-kebab"
                  aria-label={`Remove ${p.name}`}
                  data-tip="Remove"
                  onClick={() =>
                    setPerms((x) => {
                      const n = { ...x };
                      delete n[id];
                      return n;
                    })
                  }
                >
                  <IconX size={16} stroke={1.5} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="dialog-section-label">General access</div>
        <VisibilityLadder name="share-vis" value={asset.visibility} onChange={changeAccess} />
      </Dialog>
      {pendingPublic && (
        <ConfirmPublicDialog
          asset={asset}
          onCancel={() => setPendingPublic(false)}
          onConfirm={() => {
            setPendingPublic(false);
            actions.setVisibility(asset.id, 'public');
          }}
        />
      )}
    </>
  );
}
