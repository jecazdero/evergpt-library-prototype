import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { AssetRow } from './AssetRow';

export function AssetList({ assets }: { assets: Asset[] }) {
  const { state } = useStore();
  return (
    <div className={`list${state.tab === 'shared' ? ' list-shared' : ''}`} role="grid" aria-label="Assets">
      <div className="lhead" role="row">
        <span role="columnheader">Name</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Who can see it</span>
        <span role="columnheader" aria-label="Actions" />
      </div>
      <div className="lbody">
        {assets.map((a, i) => (
          <AssetRow key={a.id} asset={a} index={i} />
        ))}
      </div>
    </div>
  );
}
