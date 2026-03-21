import { api } from '../api';
import type { Illustration } from '@/types';

export interface GetIllustrationsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  keyword?: string;
  sortBy?: 'likes' | 'downloads' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface GetIllustrationsResponse {
  list: Illustration[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CreateIllustrationParams {
  name: string;
  category: string;
  tags: string[];
  previewUrl: string;
  fileUrl?: string;
}

export interface UpdateIllustrationParams {
  name?: string;
  category?: string;
  tags?: string[];
  previewUrl?: string;
  fileUrl?: string;
}

export const illustrationApi = {
  getIllustrations: (params?: GetIllustrationsParams) =>
    api.get<GetIllustrationsResponse>('/illustrations', params as Record<string, string | number | boolean | undefined>),

  getIllustrationById: (id: string) =>
    api.get<Illustration>(`/illustrations/${id}`),

  createIllustration: (data: CreateIllustrationParams) =>
    api.post<Illustration>('/illustrations', data),

  updateIllustration: (id: string, data: UpdateIllustrationParams) =>
    api.put<Illustration>(`/illustrations/${id}`, data),

  deleteIllustration: (id: string) =>
    api.delete<void>(`/illustrations/${id}`),

  likeIllustration: (id: string) =>
    api.post<{ likes: number }>(`/illustrations/${id}/like`),

  unlikeIllustration: (id: string) =>
    api.post<{ likes: number }>(`/illustrations/${id}/unlike`),

  downloadIllustration: (id: string, format: 'svg' | 'png' | 'jpg') =>
    api.get<{ url: string }>(`/illustrations/${id}/download`, { format }),

  getIllustrationCategories: () =>
    api.get<{ id: string; name: string; count: number }[]>('/illustrations/categories'),

  searchIllustrations: (keyword: string, params?: Omit<GetIllustrationsParams, 'keyword'>) =>
    api.get<GetIllustrationsResponse>('/illustrations/search', { keyword, ...params }),
};
