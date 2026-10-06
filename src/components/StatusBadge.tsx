import type { Permission, Status } from '../data/types';

const LONG: Record<Status, string> = {
  draft: 'Draft',
  published: 'Published',
  changes_pending: 'Published · changes pending',
  unpublished: 'Unpublished',
};

const SHORT: Record<Status, string> = {
  draft: 'Draft',
  published: 'Published',
  changes_pending: 'Changes pending',
  unpublished: 'Unpublished',
};

export function StatusBadge({ status, short = false }: { status: Status; short?: boolean }) {
  const dot = status === 'published' || status === 'changes_pending';
  return (
    <span className={`st-badge st-${status}`}>
      {dot && <span className="st-dot" aria-hidden="true" />}
      {short || LONG[status] === SHORT[status] ? (
        SHORT[status]
      ) : (
        <>
          {/* the short label takes over when the list gets narrow (see app.css) */}
          <span className="st-long">{LONG[status]}</span>
          <span className="st-short">{SHORT[status]}</span>
        </>
      )}
    </span>
  );
}

export function PermissionBadge({ permission }: { permission: Permission }) {
  if (permission === 'owner') return null;
  return <span className="st-badge st-perm">{permission === 'editor' ? 'Editor' : 'Viewer'}</span>;
}
