// API client for personal portfolio

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: any;
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body } = config;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`/api${endpoint}`, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  return data as ApiResponse<T>;
}

// API endpoints for portfolio
export const api = {
  // Personal info endpoints
  personalInfo: {
    get: () => request<any>('/personal-info'),
  },
  
  // Portfolio endpoints
  portfolio: {
    getList: (params?: { page?: number; pageSize?: number }) => 
      request<any>('/portfolio', { params }),
    getById: (id: string) => request<any>(`/portfolio/${id}`),
    create: (data: any) => request<any>('/portfolio', { method: 'POST', body: data }),
    update: (id: string, data: any) => request<any>(`/portfolio/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => request<any>(`/portfolio/${id}`, { method: 'DELETE' }),
  },
  
  // Upload endpoint
  upload: {
    image: (formData: FormData) => 
      request<any>('/upload/image', {
        method: 'POST',
        headers: {},
        body: formData,
      }),
  },
};
