import { IconDotsVertical } from '@tabler/icons-react';
import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { MenuButton } from '../Menu';
import { PermissionBadge, StatusBadge } from '../StatusBadge';
import { TypeIcon } from '../icons';
import { VisibilityLabel } from '../VisibilityLabel';
import { AssetPreview } from '../previews/AssetPreview';
import { useAssetMenu } from './assetMenu';
import { AssetMeta } from './AssetRow';
import { Highlight } from './Highlight';
import { RenameInput } from './RenameInput';

export function AssetCardTile({ asset, index }: { asset: Asset; index: number }) {
  const { state, dispatch } = useStore();
  const menu = useAssetMenu();
  const selected = state.selectedId === asset.id && state.panelOpen;
  const renaming = state.renamingId === asset.id;
  return (
    <div
      className={`gcard${selected ? ' is-selected' : ''}`}
      data-id={asset.id}
      onClick={() => dispatch({ type: 'SELECT', id: asset.id, open: true })}
    >
      <div className="gthumb">
        <div className={`gthumb-page gthumb-${asset.previewKind}`}>
          <AssetPreview asset={asset} />
        </div>
      </div>
      <div className="gbody">
        <div className="gtitle-row">
          <TypeIcon type={asset.type} size={16} />
          {renaming ? (
            <RenameInput id={asset.id} title={asset.title} />
          ) : (
            <button
              type="button"
              className="gtitle"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'SELECT', id: asset.id, open: true });
              }}
            >
              <Highlight text={asset.title} query={state.search} />
            </button>
          )}
          <MenuButton className="eg-kebab gkebab" label={`More actions for ${asset.title}`} items={menu(asset)} tip="More actions">
            <IconDotsVertical size={16} stroke={1.5} aria-hidden="true" />
          </MenuButton>
        </div>
        <AssetMeta asset={asset} pinChat={index === 1} />
        <div className="gstate" data-pin={index === 0 ? '3' : undefined}>
          <StatusBadge status={asset.status} short />
          <PermissionBadge permission={asset.permission} />
          <VisibilityLabel asset={asset} variant="grid" />
        </div>
      </div>
    </div>
  );
}

export function AssetGrid({ assets }: { assets: Asset[] }) {
  return (
    <div className="grid" aria-label="Assets">
      {assets.map((a, i) => (
        <AssetCardTile key={a.id} asset={a} index={i} />
      ))}
    </div>
  );
}
