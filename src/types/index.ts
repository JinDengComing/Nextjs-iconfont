// Personal portfolio types

// Personal information
export interface PersonalInfo {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  order: number;
}

// Work experience
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  skills: string[];
  order: number;
}

// Education
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
}

// Portfolio project
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  content: string; // Rich text content
  category: string;
  tags: string[];
  coverImage: string;
  images: ProjectImage[];
  demoUrl: string | null;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  alt: string;
  order: number;
}

// API response types
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
