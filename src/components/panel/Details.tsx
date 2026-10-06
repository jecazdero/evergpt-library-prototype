import { IconMessage } from '@tabler/icons-react';
import type { Asset } from '../../data/types';
import { personById } from '../../data/people';
import { CHAT_FULL_TITLE } from '../../data/chats';
import { useStore } from '../../store/context';
import { isMine, relDateLong, shortDate, TYPE_LABEL } from '../../store/selectors';

export function Details({ asset }: { asset: Asset }) {
  const { actions } = useStore();
  const mine = isMine(asset);
  const live = asset.status === 'published' || asset.status === 'changes_pending';
  const owner = personById(asset.ownerId);

  return (
    <dl className="details">
      <div>
        <dt>Type</dt>
        <dd>{TYPE_LABEL[asset.type]}</dd>
      </div>
      <div>
        <dt>Owner</dt>
        <dd>{mine ? 'You (Randy Bell)' : owner.name}</dd>
      </div>
      {!mine && (
        <div>
          <dt>Your access</dt>
          <dd>{asset.permission === 'editor' ? 'Editor · can edit and share' : 'Viewer · can view and duplicate'}</dd>
        </div>
      )}
      <div>
        <dt>Source chat</dt>
        <dd>
          {!mine ? (
            <span className="muted">Private to {owner.name.split(' ')[0]}</span>
          ) : asset.sourceChatId ? (
            <button type="button" className="chat-link strong" onClick={() => actions.openSourceChat(asset)}>
              <IconMessage size={12} stroke={1.5} aria-hidden="true" />
              {CHAT_FULL_TITLE[asset.sourceChatId] ?? asset.sourceChatTitle}
            </button>
          ) : (
            <span className="muted">Source chat deleted</span>
          )}
        </dd>
      </div>
      <div>
        <dt>Last edited</dt>
        <dd>
          {relDateLong(asset.editedAt)}
          {live && asset.livePublishedAt && ` · Live version ${shortDate(asset.livePublishedAt)}`}
        </dd>
      </div>
    </dl>
  );
}
