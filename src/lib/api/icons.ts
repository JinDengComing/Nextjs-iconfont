import { api } from '../api';
import type { Icon } from '@/types';

export interface GetIconsParams {
  page?: number;
  pageSize?: number;
  style?: string;
  category?: string;
  keyword?: string;
  sortBy?: 'likes' | 'downloads' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetIconsResponse {
  list: Icon[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CreateIconParams {
  name: string;
  category: string;
  style: Icon['style'];
  tags: string[];
  svg: string;
}

export interface UpdateIconParams {
  name?: string;
  category?: string;
  style?: Icon['style'];
  tags?: string[];
  svg?: string;
}

export const iconApi = {
  getIcons: (params?: GetIconsParams) =>
    api.get<GetIconsResponse>('/icons', params as Record<string, string | number | boolean | undefined>),

  getIconById: (id: string) =>
    api.get<Icon>(`/icons/${id}`),

  createIcon: (data: CreateIconParams) =>
    api.post<Icon>('/icons', data),

  updateIcon: (id: string, data: UpdateIconParams) =>
    api.put<Icon>(`/icons/${id}`, data),

  deleteIcon: (id: string) =>
    api.delete<void>(`/icons/${id}`),

  likeIcon: (id: string) =>
    api.post<{ likes: number }>(`/icons/${id}/like`),

  unlikeIcon: (id: string) =>
    api.post<{ likes: number }>(`/icons/${id}/unlike`),

  downloadIcon: (id: string, format: 'svg' | 'png' | 'react' | 'vue') =>
    api.get<{ url: string; code?: string }>(`/icons/${id}/download`, { format }),

  getIconCategories: () =>
    api.get<{ id: string; name: string; count: number }[]>('/icons/categories'),

  getIconStyles: () =>
    api.get<{ id: string; name: string; count: number }[]>('/icons/styles'),

  batchDownload: (ids: string[], format: 'svg' | 'png') =>
    api.post<{ url: string }>('/icons/batch-download', { ids, format }),

  searchIcons: (keyword: string, params?: Omit<GetIconsParams, 'keyword'>) =>
    api.get<GetIconsResponse>('/icons/search', { keyword, ...params }),
};
