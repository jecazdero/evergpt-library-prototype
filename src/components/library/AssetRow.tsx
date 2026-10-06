import { IconDotsVertical, IconMessage } from '@tabler/icons-react';
import type { Asset } from '../../data/types';
import { personById } from '../../data/people';
import { useStore } from '../../store/context';
import { isMine, matchAsset, relDate } from '../../store/selectors';
import { MenuButton } from '../Menu';
import { PermissionBadge, StatusBadge } from '../StatusBadge';
import { TypeIcon } from '../icons';
import { VisibilityLabel } from '../VisibilityLabel';
import { useAssetMenu } from './assetMenu';
import { Highlight } from './Highlight';
import { RenameInput } from './RenameInput';

/** Small "· Matched in content" hint for rows not matched by title. */
export function MatchHint({ asset }: { asset: Asset }) {
  const { state } = useStore();
  if (!state.search.trim()) return null;
  const m = matchAsset(asset, state.search);
  if (m === 'content') return <span className="match-hint">· Matched in content</span>;
  if (m === 'chat') return <span className="match-hint">· Matched in source chat</span>;
  return null;
}

export function AssetMeta({ asset, pinChat }: { asset: Asset; pinChat?: boolean }) {
  const { actions } = useStore();
  const mine = isMine(asset);
  return (
    <div className="meta">
      <span className="meta-fixed">{relDate(asset.editedAt)}</span>
      <span className="meta-fixed">·</span>
      {!mine ? (
        <span className="meta-fixed">Shared by {personById(asset.ownerId).name}</span>
      ) : asset.sourceChatId ? (
        <button
          type="button"
          className="chat-link"
          data-pin={pinChat ? '4' : undefined}
          onClick={(e) => {
            e.stopPropagation();
            actions.openSourceChat(asset);
          }}
          data-tip="Open source chat"
        >
          <IconMessage size={12} stroke={1.5} aria-hidden="true" />
          <span className="ellipsis">{asset.sourceChatTitle}</span>
        </button>
      ) : (
        <span className="meta-fixed">Source chat deleted</span>
      )}
      <MatchHint asset={asset} />
    </div>
  );
}

export function AssetRow({ asset, index }: { asset: Asset; index: number }) {
  const { state, dispatch } = useStore();
  const menu = useAssetMenu();
  const selected = state.selectedId === asset.id && state.panelOpen;
  const renaming = state.renamingId === asset.id;

  return (
    <div
      role="row"
      aria-selected={selected}
      tabIndex={-1}
      data-id={asset.id}
      className={`lrow${selected ? ' is-selected' : ''}`}
      onClick={() => dispatch({ type: 'SELECT', id: asset.id, open: true })}
    >
      <div role="gridcell" className="lrow-name">
        <span className={`eg-tile${selected ? ' on-selected' : ''}`}>
          <TypeIcon type={asset.type} />
        </span>
        <div className="lrow-text">
          {renaming ? (
            <RenameInput id={asset.id} title={asset.title} />
          ) : (
            <button
              type="button"
              className="lrow-title"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'SELECT', id: asset.id, open: true });
              }}
            >
              <Highlight text={asset.title} query={state.search} />
            </button>
          )}
          <AssetMeta asset={asset} pinChat={index === 1} />
        </div>
      </div>
      <div role="gridcell" className="lrow-status" data-pin={index === 0 ? '3' : undefined}>
        <StatusBadge status={asset.status} />
        <PermissionBadge permission={asset.permission} />
      </div>
      <div role="gridcell" className="lrow-vis">
        <VisibilityLabel asset={asset} />
      </div>
      <div role="gridcell" className="lrow-kebab">
        <MenuButton className="eg-kebab" label={`More actions for ${asset.title}`} items={menu(asset)} tip="More actions">
          <IconDotsVertical size={18} stroke={1.5} aria-hidden="true" />
        </MenuButton>
      </div>
    </div>
  );
}
