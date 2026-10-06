import { IconCheck, IconDotsVertical } from '@tabler/icons-react';
import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { isMine, relDateLong } from '../../store/selectors';
import { useAssetMenu } from '../library/assetMenu';
import { MenuButton } from '../Menu';
import { StatusBadge } from '../StatusBadge';
import { TypeIcon } from '../icons';

const SUB: Record<Asset['status'], string> = {
  draft: 'Draft',
  published: 'Published',
  changes_pending: 'Published · changes pending',
  unpublished: 'Unpublished',
};

/** The in-chat asset card, now showing the real status instead of "Not published / Draft". */
export function AssetCard({ asset }: { asset: Asset }) {
  const { state, dispatch } = useStore();
  const menu = useAssetMenu();
  const items = menu(asset, { includeOpen: false }).filter((i) => i.label !== 'Open source chat');
  return (
    <div className="chat-asset">
      <div
        className={`eg-asset chat-asset-card${state.chatPanelOpen ? ' is-open' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => dispatch({ type: 'SET_CHAT_PANEL', open: true })}
        onKeyDown={(e) => e.key === 'Enter' && dispatch({ type: 'SET_CHAT_PANEL', open: true })}
      >
        <span className="eg-tile">
          <TypeIcon type={asset.type} />
        </span>
        <div className="txt">
          <div className="ttl">{asset.title}</div>
          <div className="sub">
            {SUB[asset.status]} · {relDateLong(asset.editedAt).toLowerCase()}
          </div>
        </div>
        <StatusBadge status={asset.status} short />
        {isMine(asset) && (
          <span onClick={(e) => e.stopPropagation()}>
            <MenuButton className="eg-kebab" label={`More actions for ${asset.title}`} items={items} tip="More actions">
              <IconDotsVertical size={18} stroke={1.5} aria-hidden="true" />
            </MenuButton>
          </span>
        )}
      </div>
      <div className="saved-note">
        <IconCheck size={14} stroke={2} aria-hidden="true" />
        Saved to Library ·
        <button
          type="button"
          className="link-btn"
          onClick={() => dispatch({ type: 'GO_LIBRARY', selectId: asset.id, tab: isMine(asset) ? 'mine' : 'shared' })}
        >
          View
        </button>
      </div>
    </div>
  );
}
