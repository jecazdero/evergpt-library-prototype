import {
  IconChevronDown,
  IconFileText,
  IconMicrophone,
  IconPaperclip,
  IconPhoto,
  IconSend2,
  IconSparkles,
  IconWorld,
  IconX,
} from '@tabler/icons-react';
import { forwardRef, useState } from 'react';
import type { Asset } from '../../data/types';
import { useStore } from '../../store/context';
import { TYPE_LABEL } from '../../store/selectors';
import { LibraryPickerDialog } from '../dialogs/LibraryPickerDialog';
import { IconLibrary, TypeIcon } from '../icons';
import { MenuButton, type MenuItem } from '../Menu';

const MODELS = ['Cortex', 'Cortex Fast', 'Claude Sonnet', 'GPT-5', 'Gemini Pro', 'Mistral Large'];
/** Remembered across composers so the pick survives moving between home and chats. */
let lastModel = MODELS[0];

interface ComposerProps {
  /** Library asset the next message will be about. Uncontrolled when omitted. */
  reference?: Asset | null;
  onReferenceChange?: (a: Asset | null) => void;
  value?: string;
  onValueChange?: (v: string) => void;
}

export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { reference: controlledRef, onReferenceChange, value: controlled, onValueChange },
  ref,
) {
  const { actions } = useStore();
  const [local, setLocal] = useState('');
  const value = controlled ?? local;
  const setValue = onValueChange ?? setLocal;
  const [localRef, setLocalRef] = useState<Asset | null>(null);
  const reference = controlledRef !== undefined ? controlledRef : localRef;
  const setReference = onReferenceChange ?? setLocalRef;
  const [picking, setPicking] = useState(false);
  const [model, setModel] = useState(lastModel);
  const modelItems: MenuItem[] = MODELS.map((m) => ({
    label: m,
    checked: m === model,
    onSelect: () => {
      lastModel = m;
      setModel(m);
    },
  }));
  const notInPrototype = () => actions.toast({ text: 'File upload is not part of this prototype' });
  const attachItems: MenuItem[] = [
    { label: 'Upload image', icon: <IconPhoto size={16} stroke={1.5} />, onSelect: notInPrototype },
    { label: 'Document', icon: <IconFileText size={16} stroke={1.5} />, onSelect: notInPrototype },
    { label: '', divider: true },
    { label: 'Import from Library', icon: <IconLibrary size={16} />, onSelect: () => setPicking(true) },
  ];
  const send = () => {
    const text = value.trim();
    if (reference) {
      actions.startChatWithAsset(reference, text || `Continue working on "${reference.title}"`);
      return;
    }
    if (!text) return;
    setValue('');
    actions.toast({ text: 'Chat is not live in this prototype' });
  };
  const placeholder = reference ? `Ask about this ${TYPE_LABEL[reference.type].toLowerCase()}, or say what to change` : 'Ask me anything';
  return (
    <div className="composer-wrap">
      <MenuButton className="composer-model" label={`Model: ${model}`} tip="Model" items={modelItems} align="right">
        <IconSparkles size={13} stroke={1.5} aria-hidden="true" />
        {model}
        <IconChevronDown size={13} stroke={1.5} aria-hidden="true" />
      </MenuButton>
      <form
        className="eg-composer composer"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        {reference && (
          <div className="composer-ref">
            <span className="composer-ref-icon">
              <TypeIcon type={reference.type} size={14} />
            </span>
            <span className="composer-ref-text">
              <span className="composer-ref-label">From Library</span>
              <span className="composer-ref-title">{reference.title}</span>
            </span>
            <button
              type="button"
              className="composer-ref-x"
              aria-label={`Remove ${reference.title}`}
              data-tip="Remove"
              onClick={() => setReference(null)}
            >
              <IconX size={14} stroke={1.75} aria-hidden="true" />
            </button>
          </div>
        )}
        <textarea
          ref={ref}
          className="composer-input"
          rows={2}
          placeholder={placeholder}
          aria-label={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <div className="row">
          <MenuButton className="eg-chip icon" label="Attach" tip="Attach" items={attachItems} align="left">
            <IconPaperclip size={16} stroke={1.5} aria-hidden="true" />
          </MenuButton>
          <button type="button" className="eg-chip">
            <IconWorld size={16} stroke={1.5} aria-hidden="true" />
            Search
          </button>
          <button
            type="button"
            className="eg-round neutral end"
            aria-label="Voice input"
            data-tip="Voice input"
            onClick={() => actions.toast({ text: 'Voice input is not part of this prototype' })}
          >
            <IconMicrophone size={18} stroke={1.5} aria-hidden="true" />
          </button>
          <button
            type="submit"
            className="eg-round brand"
            aria-label={reference ? 'Start chat' : 'Send'}
            data-tip={reference ? 'Start chat' : 'Send'}
            disabled={!reference && !value.trim()}
          >
            <IconSend2 size={18} stroke={1.5} aria-hidden="true" />
          </button>
        </div>
        {picking && (
          <LibraryPickerDialog
            onPick={(a) => {
              setReference(a);
              if (typeof ref === 'object') ref?.current?.focus();
            }}
            onClose={() => setPicking(false)}
          />
        )}
      </form>
    </div>
  );
});

export function Footnote() {
  return (
    <p className="eg-foot">
      Ensure your questions follow Foundever's security terms for a safe, productive workspace.
      <br />
      EverGPT may make mistakes, so double-check important information.
    </p>
  );
}
