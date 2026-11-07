/**
 * 领域模型类型定义 —— 服务端与前端共用。
 * 前后端均从此文件派生类型，保证契约一致。
 */

export type Visibility = 'public' | 'private';
export type PostStatus = 'published' | 'archived';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  bio: string;
  createdAt: string;
}

export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: string;
  deviceVendor: string;
  ua: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
  label?: string;
  address?: string;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  kind: 'image' | 'video' | 'audio' | 'file';
}

export interface PostStats {
  likes: number;
  favorites: number;
  shares: number;
  comments: number;
}

/** 前端注入的 MDC 组件配置项（用于在正文里声明自定义组件所需选项） */
export interface MdcOptions {
  /** 组件名，如 `::alert` */
  name: string;
  /** 注入到组件的 props */
  props: Record<string, string | number | boolean>;
}

export interface Post {
  id: string;
  authorId: string;
  author?: User;
  /** Markdown 原文 */
  content: string;
  /** 纯文本摘要，用于搜索与列表预览 */
  plainText: string;
  /** MDC 自定义组件配置（由编辑器写入，渲染时注入到组件 props） */
  mdcOptions: MdcOptions[];
  tags: string[];
  visibility: Visibility;
  status: PostStatus;
  archivedAt: string | null;
  location: GeoPoint | null;
  attachments: Attachment[];
  device: DeviceInfo | null;
  stats: PostStats;
  liked: boolean;
  favorited: boolean;
  searchTokens: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostQuery {
  /** 空数组表示「全部可见内容」（公开 + 自己可见的私密） */
  authorIds?: string[];
  viewerId?: string;
  visibility?: Visibility | 'all';
  status?: PostStatus;
  tags?: string[];
  keyword?: string;
  from?: string;
  to?: string;
  hasLocation?: boolean;
  bbox?: { minLat: number; minLng: number; maxLat: number; maxLng: number };
  likedBy?: string;
  favoritedBy?: string;
  sort?: 'latest' | 'oldest' | 'popular' | 'liked';
  page?: number;
  pageSize?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SavedView {
  id: string;
  ownerId: string;
  name: string;
  icon: string;
  description: string;
  /** 视图对应的筛选条件 */
  filters: ViewFilters;
  builtIn: boolean;
  order: number;
  createdAt: string;
}

export interface ViewFilters {
  keyword?: string;
  tags?: string[];
  visibility?: Visibility | 'all';
  status?: PostStatus;
  hasLocation?: boolean;
  from?: string;
  to?: string;
  sort?: PostQuery['sort'];
}

export interface Draft {
  id: string;
  ownerId: string;
  key: string;
  content: string;
  tags: string[];
  attachments: Attachment[];
  updatedAt: string;
}

export interface ShareLink {
  id: string;
  postId: string;
  token: string;
  creatorId: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  ownerId: string;
  url: string;
  filename: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  kind: Attachment['kind'];
  createdAt: string;
}

export interface TagInfo {
  name: string;
  count: number;
  /** 最近使用时间 */
  lastUsedAt: string;
}

export interface DashboardStats {
  total: number;
  published: number;
  archived: number;
  privateCount: number;
  withLocation: number;
  totalLikes: number;
  totalFavorites: number;
  totalShares: number;
  tagCount: number;
  mediaCount: number;
}

/** 日历视图数据 */
export interface CalendarCell {
  date: string;
  count: number;
}

/** 地图视图数据点 */
export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  title: string;
  excerpt: string;
  tags: string[];
  createdAt: string;
}

/** 统一响应包装 */
export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}
