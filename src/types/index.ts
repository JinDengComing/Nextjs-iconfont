export interface Icon {
  id: string;
  name: string;
  category: string;
  style: 'linear' | 'filled' | 'duotone' | 'hand-drawn';
  tags: string[];
  author: string;
  likes: number;
  downloads: number;
  svg: string;
  previewUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Illustration {
  id: string;
  name: string;
  category: string;
  tags: string[];
  author: string;
  likes: number;
  downloads: number;
  previewUrl: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'icon' | 'image' | 'video' | 'text';
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  path: string;
  createdAt?: string;
  updatedAt?: string;
}
