import { IconCopy, IconDots, IconDownload, IconPencil, IconTrash, IconWorldOff, IconX, IconEdit, IconHistory, IconMessage } from '@tabler/icons-react';
import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { isMine } from '../../store/selectors';
import { MenuButton, type MenuItem } from '../Menu';

const i = (I: typeof IconCopy) => <I size={16} stroke={1.5} />;

export function ActionBar({ asset }: { asset: Asset }) {
  const { state, dispatch, actions } = useStore();
  const mine = isMine(asset);
  const live = asset.status === 'published' || asset.status === 'changes_pending';
  const canShare = mine || asset.permission === 'editor';
  // At narrow panel widths the text buttons collapse to icons with tooltips.
  const compact = state.panelWidth < 400;
  const label = (text: string) => (compact ? null : text);

  // Earlier chats on this asset (newest first), so the user can pick one up again.
  const pastChats = state.chats.filter((c) => c.assetId === asset.id);
  const history: MenuItem[] = pastChats.map((c) => ({
    label: c.title,
    icon: i(IconMessage),
    onSelect: () => dispatch({ type: 'OPEN_CHAT', chatId: c.id }),
  }));

  const common: MenuItem[] = [
    { label: 'Duplicate', icon: i(IconCopy), onSelect: () => actions.duplicate(asset) },
    { label: 'Download', icon: i(IconDownload), onSelect: () => actions.download(asset) },
  ];
  const unpublish: MenuItem[] = live ? [{ label: 'Unpublish', icon: i(IconWorldOff), onSelect: () => actions.unpublish(asset.id) }] : [];
  const more: MenuItem[] = mine
    ? [
        ...common,
        { label: 'Rename', icon: i(IconPencil), onSelect: () => dispatch({ type: 'SET_RENAMING', id: asset.id }) },
        { divider: true, label: '' },
        ...unpublish,
        { label: 'Delete', icon: i(IconTrash), danger: true, onSelect: () => dispatch({ type: 'OPEN_DIALOG', dialog: { kind: 'delete', assetId: asset.id } }) },
      ]
    : [
        ...common,
        { divider: true, label: '' },
        ...(canShare ? unpublish : []),
        { label: 'Remove from my Library', icon: i(IconX), danger: true, onSelect: () => actions.removeShared(asset.id) },
      ];

  return (
    <div className="action-bar" data-pin="7">
      {canShare && (
        <span className="btn-group">
          <button
            type="button"
            className={`eg-btn secondary${compact ? ' icon-only' : ''}`}
            aria-label={compact ? 'Edit in new chat' : undefined}
            data-tip={compact ? 'Edit in new chat' : undefined}
            onClick={() => actions.editInNewChat(asset)}
          >
            <IconEdit size={16} stroke={1.75} aria-hidden="true" />
            {label('Edit in new chat')}
          </button>
          {history.length > 0 ? (
            <MenuButton className="eg-btn secondary icon-only" label="Continue a previous chat" tip="Chat history" items={history} align="left">
              <IconHistory size={16} stroke={1.75} aria-hidden="true" />
            </MenuButton>
          ) : (
            <button type="button" className="eg-btn secondary icon-only" aria-label="Chat history" aria-disabled="true" data-tip="No previous chats">
              <IconHistory size={16} stroke={1.75} aria-hidden="true" />
            </button>
          )}
        </span>
      )}
      <span className="flex1" />
      <MenuButton className="icon-btn" label="More actions" tip="More" items={more}>
        <IconDots size={18} stroke={1.5} aria-hidden="true" />
      </MenuButton>
    </div>
  );
}
