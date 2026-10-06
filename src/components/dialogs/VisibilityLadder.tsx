import { IconBuilding, IconLock, IconUsers, IconWorld } from '@tabler/icons-react';
import type { Visibility } from '../../data/types';
import { VIS_ORDER } from '../../store/selectors';

const OPTIONS: Record<Visibility, { label: string; help: string; icon: React.ReactNode }> = {
  private: { label: 'Only you', help: 'Only you can open it', icon: <IconLock size={18} stroke={1.5} /> },
  people: { label: 'Specific people', help: 'Only people added above', icon: <IconUsers size={18} stroke={1.5} /> },
  org: { label: 'Anyone at Foundever', help: 'Any employee with the link, after sign-in', icon: <IconBuilding size={18} stroke={1.5} /> },
  public: { label: 'Public on the web', help: 'Anyone on the internet with the link', icon: <IconWorld size={18} stroke={1.5} /> },
};

export function VisibilityLadder({
  value,
  onChange,
  name,
  peopleHelp,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
  name: string;
  peopleHelp?: string;
}) {
  return (
    <div className="ladder" role="radiogroup" aria-label="General access">
      {VIS_ORDER.map((v) => {
        const o = OPTIONS[v];
        const on = value === v;
        return (
          <label key={v} className={`ladder-opt${on ? ' on' : ''}${v === 'public' ? ' is-public' : ''}`}>
            <input type="radio" name={name} value={v} checked={on} onChange={() => onChange(v)} />
            <span className="ladder-ico" aria-hidden="true">
              {o.icon}
            </span>
            <span className="ladder-text">
              <span className="ladder-label">{o.label}</span>
              <span className="ladder-help">{v === 'people' && peopleHelp ? peopleHelp : o.help}</span>
            </span>
            <span className="ladder-radio" aria-hidden="true" />
          </label>
        );
      })}
    </div>
  );
}
