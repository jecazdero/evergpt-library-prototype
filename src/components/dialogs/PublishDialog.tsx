import { useState } from 'react';
import type { Asset, Visibility } from '../../data/types';
import { useStore } from '../../store/context';
import { Dialog } from '../Dialog';
import { ConfirmPublicDialog } from './ConfirmPublicDialog';
import { VisibilityLadder } from './VisibilityLadder';

export function PublishDialog({ asset }: { asset: Asset }) {
  const { dispatch, actions } = useStore();
  const [vis, setVis] = useState<Visibility>('org');
  const [confirming, setConfirming] = useState(false);
  const close = () => dispatch({ type: 'CLOSE_DIALOG' });
  const people = asset.sharedWith.filter((id) => id !== asset.ownerId).length;
  const verb = asset.status === 'unpublished' ? 'Republish' : 'Publish';

  const doPublish = () => {
    close();
    actions.publish(asset.id, vis);
  };

  return (
    <>
      <Dialog
        labelId="publish-title"
        title={`${verb} "${asset.title}"`}
        onClose={close}
        footer={
          <>
            <span className="flex1" />
            <button type="button" className="eg-btn secondary" onClick={close}>
              Cancel
            </button>
            <button type="button" className="eg-btn primary" onClick={() => (vis === 'public' ? setConfirming(true) : doPublish())}>
              {verb}
            </button>
          </>
        }
      >
        <p className="dialog-text">Choose who can see the published version. You can change this later.</p>
        <div className="dialog-section-label">Who can see it</div>
        <VisibilityLadder
          name="publish-vis"
          value={vis}
          onChange={setVis}
          peopleHelp={people ? `The ${people} ${people === 1 ? 'person' : 'people'} it's shared with` : 'Add people from Share first'}
        />
      </Dialog>
      {confirming && (
        <ConfirmPublicDialog
          asset={asset}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            doPublish();
          }}
        />
      )}
    </>
  );
}
