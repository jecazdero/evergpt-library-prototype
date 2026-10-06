import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import type { Asset } from '../../data/types';
import { personById } from '../../data/people';
import { useStore } from '../../store/context';
import { isMine, matchAsset, relDate } from '../../store/selectors';
import { Dialog } from '../Dialog';
import { TypeIcon } from '../icons';
import { Highlight } from '../library/Highlight';
import { StatusBadge } from '../StatusBadge';

/** "Import from Library" picker opened from the composer's Attach menu. */
export function LibraryPickerDialog({ onPick, onClose }: { onPick: (a: Asset) => void; onClose: () => void }) {
  const { state } = useStore();
  const [q, setQ] = useState('');
  const assets = (state.emptyLibrary ? state.assets.filter((a) => !isMine(a)) : state.assets)
    .filter((a) => matchAsset(a, q) !== null)
    .sort((x, y) => y.editedAt.localeCompare(x.editedAt));

  return (
    <Dialog labelId="lib-pick-title" title="Import from Library" onClose={onClose} width={560} closable>
      <label className="search lib-pick-search">
        <IconSearch size={16} stroke={1.5} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search by name, content or chat"
          aria-label="Search Library"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          data-autofocus
        />
      </label>
      {assets.length === 0 ? (
        <p className="dialog-text lib-pick-empty">No assets match "{q}".</p>
      ) : (
        <ul className="lib-pick-list" aria-label="Library assets">
          {assets.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                className="lib-pick-row"
                onClick={() => {
                  onPick(a);
                  onClose();
                }}
              >
                <span className="eg-tile">
                  <TypeIcon type={a.type} />
                </span>
                <span className="lib-pick-txt">
                  <span className="lib-pick-title">
                    <Highlight text={a.title} query={q} />
                  </span>
                  <span className="lib-pick-meta">
                    {relDate(a.editedAt)} · {isMine(a) ? 'My asset' : `Shared by ${personById(a.ownerId).name}`}
                  </span>
                </span>
                <StatusBadge status={a.status} short />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Dialog>
  );
}
