import { useStore } from '../../store/context';
import { DeleteDialog } from './DeleteDialog';
import { PublishDialog } from './PublishDialog';
import { ShareDialog } from './ShareDialog';

export function DialogHost() {
  const { state } = useStore();
  const d = state.dialog;
  if (!d) return null;
  const asset = state.assets.find((a) => a.id === d.assetId);
  if (!asset) return null;
  if (d.kind === 'share') return <ShareDialog key={asset.id} asset={asset} />;
  if (d.kind === 'publish') return <PublishDialog key={asset.id} asset={asset} />;
  return <DeleteDialog asset={asset} />;
}
