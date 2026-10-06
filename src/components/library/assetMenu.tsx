import {
  IconCopy,
  IconDownload,
  IconEye,
  IconLink,
  IconMessage,
  IconPencil,
  IconTrash,
  IconUsers,
  IconWorldOff,
  IconX,
  IconEdit,
} from '@tabler/icons-react';
import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { isMine } from '../../store/selectors';
import type { MenuItem } from '../Menu';

const i = (I: typeof IconCopy) => <I size={16} stroke={1.5} />;

export function useAssetMenu() {
  const { dispatch, actions } = useStore();

  return (a: Asset, opts: { includeOpen?: boolean } = {}): MenuItem[] => {
    const open: MenuItem[] =
      opts.includeOpen === false ? [] : [{ label: 'Open', icon: i(IconEye), onSelect: () => dispatch({ type: 'SELECT', id: a.id, open: true }) }];

    const live = a.status === 'published' || a.status === 'changes_pending';

    if (!isMine(a)) {
      const editor = a.permission === 'editor';
      return [
        ...open,
        editor
          ? { label: 'Edit in new chat', icon: i(IconEdit), onSelect: () => actions.editInNewChat(a) }
          : { label: 'Duplicate and edit', icon: i(IconEdit), onSelect: () => actions.duplicateAndEdit(a) },
        { label: 'Copy link', icon: i(IconLink), onSelect: () => actions.copyLink(a) },
        { divider: true, label: '' },
        ...(editor && live ? [{ label: 'Unpublish', icon: i(IconWorldOff), onSelect: () => actions.unpublish(a.id) }] : []),
        { label: 'Remove from my Library', icon: i(IconX), danger: true, onSelect: () => actions.removeShared(a.id) },
      ];
    }

    return [
      ...open,
      {
        label: 'Open source chat',
        icon: i(IconMessage),
        disabled: !a.sourceChatId,
        onSelect: () => actions.openSourceChat(a),
      },
      { label: 'Share', icon: i(IconUsers), onSelect: () => dispatch({ type: 'OPEN_DIALOG', dialog: { kind: 'share', assetId: a.id } }) },
      { label: 'Copy link', icon: i(IconLink), onSelect: () => actions.copyLink(a) },
      { label: 'Duplicate', icon: i(IconCopy), onSelect: () => actions.duplicate(a) },
      { label: 'Download', icon: i(IconDownload), onSelect: () => actions.download(a) },
      { label: 'Rename', icon: i(IconPencil), onSelect: () => dispatch({ type: 'SET_RENAMING', id: a.id }) },
      { divider: true, label: '' },
      ...(live ? [{ label: 'Unpublish', icon: i(IconWorldOff), onSelect: () => actions.unpublish(a.id) }] : []),
      {
        label: 'Delete',
        icon: i(IconTrash),
        danger: true,
        onSelect: () => dispatch({ type: 'OPEN_DIALOG', dialog: { kind: 'delete', assetId: a.id } }),
      },
    ];
  };
}
