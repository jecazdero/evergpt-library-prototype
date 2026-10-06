import type { Asset } from '../../data/types';
import { Dialog } from '../Dialog';

const NOUN: Record<Asset['type'], string> = { webpage: 'page', presentation: 'presentation', report: 'report' };

export function ConfirmPublicDialog({ asset, onCancel, onConfirm }: { asset: Asset; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Dialog
      labelId="confirm-public-title"
      title={`Make this ${NOUN[asset.type]} public?`}
      onClose={onCancel}
      width={420}
      level={2}
      footer={
        <>
          <span className="flex1" />
          <button type="button" className="eg-btn secondary" onClick={onCancel} data-autofocus>
            Cancel
          </button>
          <button type="button" className="eg-btn danger" onClick={onConfirm}>
            Make public
          </button>
        </>
      }
    >
      <p className="dialog-text">
        Anyone on the internet with the link will be able to see it. Don't publish client data or internal-only information.
      </p>
    </Dialog>
  );
}
