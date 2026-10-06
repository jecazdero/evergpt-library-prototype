import {
  IconDeviceDesktop,
  IconFileText,
  IconWorld,
  type IconProps,
} from '@tabler/icons-react';
import type { AssetType } from '../data/types';

/** Library nav icon from Figma (rect with header row and left column). */
export function IconLibrary({ size = 18, stroke = 1.5 }: { size?: number; stroke?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16M9 9v11" />
    </svg>
  );
}

const TYPE_ICON: Record<AssetType, React.ComponentType<IconProps>> = {
  webpage: IconWorld,
  presentation: IconDeviceDesktop,
  report: IconFileText,
};

export function TypeIcon({ type, size = 18 }: { type: AssetType; size?: number }) {
  const I = TYPE_ICON[type];
  return <I size={size} stroke={1.5} aria-hidden="true" />;
}
