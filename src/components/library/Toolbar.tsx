import { IconArrowDown, IconChevronDown, IconLayoutGrid, IconList, IconX } from '@tabler/icons-react';
import type { AssetType, Status } from '../../data/types';
import { useStore } from '../../store/context';
import type { SortKey } from '../../store/reducer';
import { STATUS_LABEL, TYPE_PLURAL } from '../../store/selectors';
import { MenuButton } from '../Menu';

const TYPES: AssetType[] = ['webpage', 'presentation', 'report'];
const STATUSES: Status[] = ['draft', 'published', 'changes_pending', 'unpublished'];
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'edited', label: 'Last edited' },
  { key: 'name', label: 'Name A–Z' },
  { key: 'created', label: 'Created' },
];

function FilterPill({
  name,
  value,
  on,
  items,
  onClear,
}: {
  name: string;
  value: string;
  on: boolean;
  items: { label: string; checked: boolean; onSelect: () => void }[];
  onClear: () => void;
}) {
  return (
    <span className={`fpill${on ? ' on' : ''}`}>
      <MenuButton className="fpill-btn" label={`${name}: ${value}`} items={items} align="left">
        <span className="fpill-name">{name}:</span>
        <span className="fpill-value">{value}</span>
        {!on && <IconChevronDown size={14} stroke={1.5} aria-hidden="true" />}
      </MenuButton>
      {on && (
        <button type="button" className="fpill-clear" aria-label={`Clear ${name} filter`} data-tip="Clear filter" onClick={onClear}>
          <IconX size={12} stroke={2} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}

export function Toolbar() {
  const { state, dispatch } = useStore();
  const typeValue = state.typeFilter === 'all' ? 'All' : TYPE_PLURAL[state.typeFilter];
  const statusValue = state.statusFilter === 'all' ? 'All' : STATUS_LABEL[state.statusFilter];
  const sortLabel = SORTS.find((s) => s.key === state.sort)!.label;

  return (
    <div className="filters">
      <FilterPill
        name="Type"
        value={typeValue}
        on={state.typeFilter !== 'all'}
        onClear={() => dispatch({ type: 'SET_TYPE_FILTER', value: 'all' })}
        items={[
          { label: 'All', checked: state.typeFilter === 'all', onSelect: () => dispatch({ type: 'SET_TYPE_FILTER', value: 'all' }) },
          ...TYPES.map((t) => ({
            label: TYPE_PLURAL[t],
            checked: state.typeFilter === t,
            onSelect: () => dispatch({ type: 'SET_TYPE_FILTER', value: t }),
          })),
        ]}
      />
      <FilterPill
        name="Status"
        value={statusValue}
        on={state.statusFilter !== 'all'}
        onClear={() => dispatch({ type: 'SET_STATUS_FILTER', value: 'all' })}
        items={[
          { label: 'All', checked: state.statusFilter === 'all', onSelect: () => dispatch({ type: 'SET_STATUS_FILTER', value: 'all' }) },
          ...STATUSES.map((s) => ({
            label: STATUS_LABEL[s],
            checked: state.statusFilter === s,
            onSelect: () => dispatch({ type: 'SET_STATUS_FILTER', value: s }),
          })),
        ]}
      />
      <span className="flex1" />
      <MenuButton
        className="sort-btn"
        label={`Sort by ${sortLabel}`}
        items={SORTS.map((s) => ({ label: s.label, checked: state.sort === s.key, onSelect: () => dispatch({ type: 'SET_SORT', value: s.key }) }))}
      >
        {sortLabel}
        <IconArrowDown size={14} stroke={1.5} aria-hidden="true" />
      </MenuButton>
      <span className="vdivider" />
      <div className="seg seg-view" role="radiogroup" aria-label="View">
        <button
          type="button"
          role="radio"
          aria-checked={state.layout === 'list'}
          aria-label="List view"
          data-tip="List view"
          className={`seg-btn icon${state.layout === 'list' ? ' on' : ''}`}
          onClick={() => dispatch({ type: 'SET_LAYOUT', value: 'list' })}
        >
          <IconList size={16} stroke={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={state.layout === 'grid'}
          aria-label="Grid view"
          data-tip="Grid view"
          className={`seg-btn icon${state.layout === 'grid' ? ' on' : ''}`}
          onClick={() => dispatch({ type: 'SET_LAYOUT', value: 'grid' })}
        >
          <IconLayoutGrid size={16} stroke={1.5} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
