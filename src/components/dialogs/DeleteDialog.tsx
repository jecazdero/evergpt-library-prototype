import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { Dialog } from '../Dialog';

export function DeleteDialog({ asset }: { asset: Asset }) {
  const { dispatch, actions } = useStore();
  const close = () => dispatch({ type: 'CLOSE_DIALOG' });
  return (
    <Dialog
      labelId="delete-title"
      title={`Delete "${asset.title}"?`}
      onClose={close}
      width={420}
      footer={
        <>
          <span className="flex1" />
          <button type="button" className="eg-btn secondary" onClick={close} data-autofocus>
            Cancel
          </button>
          <button
            type="button"
            className="eg-btn danger"
            onClick={() => {
              close();
              actions.remove(asset.id);
            }}
          >
            Delete
          </button>
        </>
      }
    >
      <p className="dialog-text">This removes the asset and its published link. The source chat is not affected.</p>
    </Dialog>
  );
}
