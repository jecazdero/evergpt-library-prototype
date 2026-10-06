export type AssetType = 'webpage' | 'presentation' | 'report';
export type Status = 'draft' | 'published' | 'changes_pending' | 'unpublished';
export type Visibility = 'private' | 'people' | 'org' | 'public';
export type Permission = 'owner' | 'editor' | 'viewer';
export type SharePermission = 'viewer' | 'editor';
export type PreviewKind = 'sales' | 'deck' | 'report' | 'faq' | 'story';

export interface Person {
  id: string;
  name: string;
  initials: string;
  email: string;
  color: string;
}

export interface Asset {
  id: string;
  title: string;
  type: AssetType;
  status: Status;
  visibility: Visibility;
  /** person ids the asset is shared with directly */
  sharedWith: string[];
  sharePerms: Record<string, SharePermission>;
  ownerId: string;
  permission: Permission;
  /** null => "Source chat deleted" */
  sourceChatId: string | null;
  sourceChatTitle: string;
  createdAt: string;
  editedAt: string;
  livePublishedAt?: string;
  unpublishedAt?: string;
  editsSincePublish?: number;
  keywords: string[];
  previewKind: PreviewKind;
  /** short subtitle used in previews */
  blurb: string;
}

export interface Chat {
  id: string;
  title: string;
  prompt: string;
  assetId: string | null;
  inSidebar: boolean;
}
