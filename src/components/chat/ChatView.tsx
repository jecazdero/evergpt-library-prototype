import type { Asset, Chat } from '../../data/types';
import { useStore } from '../../store/context';
import { TYPE_LABEL } from '../../store/selectors';
import { PanelHeader } from '../panel/PanelHeader';
import { AssetPreview } from '../previews/AssetPreview';
import { AssetCard } from './AssetCard';
import { Composer, Footnote } from './Composer';
import { ResizeHandle } from '../panel/ResizeHandle';

function Answer({ chat, asset }: { chat: Chat; asset: Asset | undefined }) {
  if (chat.id === 'chat-sales') {
    return (
      <div className="eg-answer">
        <h4>Want to push it even further?</h4>
        <p>I can:</p>
        <ul>
          <li>Add animated counters on the stat cards</li>
          <li>Drop in a Mermaid diagram for the sales process flow</li>
          <li>Create a dark executive version of the same page</li>
          <li>Build a client-specific variant for a live pitch</li>
        </ul>
      </div>
    );
  }
  if (chat.id.startsWith('chat-new')) {
    return (
      <div className="eg-answer">
        <p>I've opened {asset ? `"${asset.title}"` : 'the asset'} in a new chat. Tell me what you'd like to change and I'll update it.</p>
      </div>
    );
  }
  if (chat.id.startsWith('chat-ref')) {
    return (
      <div className="eg-answer">
        <p>
          I've pulled {asset ? `"${asset.title}"` : 'the asset'} from your Library into this chat, so I'll work from its latest
          version. Tell me if you'd rather start from the live version instead.
        </p>
      </div>
    );
  }
  const noun = asset ? TYPE_LABEL[asset.type].toLowerCase() : 'asset';
  return (
    <div className="eg-answer">
      <h4>Your {noun} is ready</h4>
      <p>A few ways I can take it further:</p>
      <ul>
        <li>Tighten the copy for an executive audience</li>
        <li>Add a chart that summarises the key numbers</li>
        <li>Translate it for another region</li>
      </ul>
    </div>
  );
}

export function ChatView() {
  const { state, dispatch } = useStore();
  const chat = state.chats.find((c) => c.id === state.chatId);
  if (!chat) return null;
  const asset = state.assets.find((a) => a.id === chat.assetId);
  const panel = state.chatPanelOpen && asset;

  return (
    <div className="chat">
      <main className="chat-main" aria-label={chat.title}>
        <div className="chat-scroll">
          <div className="chat-col">
            <div className="msg-user">
              <span className="eg-bubble">{chat.prompt}</span>
            </div>
            {asset ? (
              <AssetCard asset={asset} />
            ) : (
              <div className="saved-note">This chat's asset was deleted from the Library.</div>
            )}
            <Answer chat={chat} asset={asset} />
          </div>
        </div>
        <div className="chat-composer">
          <Composer />
          <Footnote />
        </div>
      </main>
      {panel && (
        <aside
          className="chat-panel"
          aria-label={`${asset.title} preview`}
          style={{ width: state.panelWidth }}
        >
          <ResizeHandle />
          <PanelHeader asset={asset} label={asset.title} showState onClose={() => dispatch({ type: 'SET_CHAT_PANEL', open: false })} />
          <div className="chat-panel-body">
            <AssetPreview asset={asset} />
          </div>
        </aside>
      )}
    </div>
  );
}
