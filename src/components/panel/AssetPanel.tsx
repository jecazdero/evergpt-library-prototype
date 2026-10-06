import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { isMine, shortDate } from '../../store/selectors';
import { PermissionBadge, StatusBadge } from '../StatusBadge';
import { PanelVisibility } from '../VisibilityLabel';
import { ActionBar } from './ActionBar';
import { ChangesCallout } from './ChangesCallout';
import { Details } from './Details';
import { PanelHeader } from './PanelHeader';
import { Preview } from './Preview';

export function AssetPanel({ asset }: { asset: Asset }) {
  const { dispatch } = useStore();
  const mine = isMine(asset);
  const canShare = mine || asset.permission === 'editor';

  return (
    <aside className="panel" aria-label={`${asset.title} details`}>
      <PanelHeader asset={asset} />
      <div className="panel-summary">
        <div className="panel-titleblock">
          <h2 className="t-title panel-title">{asset.title}</h2>
          <div className="panel-state">
            <StatusBadge status={asset.status} />
            <PanelVisibility
              asset={asset}
              onClick={canShare ? () => dispatch({ type: 'OPEN_DIALOG', dialog: { kind: 'share', assetId: asset.id } }) : undefined}
            />
            <PermissionBadge permission={asset.permission} />
          </div>
          {asset.status === 'unpublished' && (
            <p className="panel-note">
              Taken down {shortDate(asset.unpublishedAt ?? asset.editedAt)}. Only you can see it.
            </p>
          )}
        </div>
        <ChangesCallout asset={asset} />
        <Details asset={asset} />
      </div>
      <Preview asset={asset} />
      <ActionBar asset={asset} />
    </aside>
  );
}
