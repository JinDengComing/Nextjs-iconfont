import { api } from '../api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserParams {
  username?: string;
  avatar?: string;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export interface MaterialCollection {
  id: string;
  name: string;
  type: 'icon' | 'illustration';
  items: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  icons: string[];
  illustrations: string[];
  createdAt: string;
  updatedAt: string;
}

export const userApi = {
  login: (params: LoginParams) =>
    api.post<LoginResponse>('/auth/login', params),

  register: (params: RegisterParams) =>
    api.post<LoginResponse>('/auth/register', params),

  logout: () =>
    api.post<void>('/auth/logout'),

  getCurrentUser: () =>
    api.get<User>('/user/me'),

  updateProfile: (data: UpdateUserParams) =>
    api.put<User>('/user/me', data),

  changePassword: (data: ChangePasswordParams) =>
    api.post<void>('/user/change-password', data),

  getMyIcons: (params?: { page?: number; pageSize?: number }) =>
    api.get<{ list: string[]; total: number }>('/user/icons', params),

  getMyIllustrations: (params?: { page?: number; pageSize?: number }) =>
    api.get<{ list: string[]; total: number }>('/user/illustrations', params),

  addIconToCollection: (iconId: string) =>
    api.post<void>('/user/icons', { iconId }),

  removeIconFromCollection: (iconId: string) =>
    api.delete<void>(`/user/icons/${iconId}`),

  addIllustrationToCollection: (illustrationId: string) =>
    api.post<void>('/user/illustrations', { illustrationId }),

  removeIllustrationFromCollection: (illustrationId: string) =>
    api.delete<void>(`/user/illustrations/${illustrationId}`),

  getProjects: () =>
    api.get<Project[]>('/user/projects'),

  getProjectById: (id: string) =>
    api.get<Project>(`/user/projects/${id}`),

  createProject: (data: { name: string; description?: string }) =>
    api.post<Project>('/user/projects', data),

  updateProject: (id: string, data: { name?: string; description?: string }) =>
    api.put<Project>(`/user/projects/${id}`, data),

  deleteProject: (id: string) =>
    api.delete<void>(`/user/projects/${id}`),

  addIconToProject: (projectId: string, iconId: string) =>
    api.post<void>(`/user/projects/${projectId}/icons`, { iconId }),

  removeIconFromProject: (projectId: string, iconId: string) =>
    api.delete<void>(`/user/projects/${projectId}/icons/${iconId}`),

  addIllustrationToProject: (projectId: string, illustrationId: string) =>
    api.post<void>(`/user/projects/${projectId}/illustrations`, { illustrationId }),

  removeIllustrationFromProject: (projectId: string, illustrationId: string) =>
    api.delete<void>(`/user/projects/${projectId}/illustrations/${illustrationId}`),
};
