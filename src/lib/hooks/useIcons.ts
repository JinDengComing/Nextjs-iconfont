'use client';

import { useState, useEffect, useCallback } from 'react';
import { iconApi, GetIconsParams, GetIconsResponse, Icon } from '@/lib/api/index';

interface UseIconsOptions extends GetIconsParams {
  autoFetch?: boolean;
}

interface UseIconsReturn {
  icons: Icon[];
  total: number;
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  fetchIcons: (params?: GetIconsParams) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useIcons(options: UseIconsOptions = {}): UseIconsReturn {
  const { autoFetch = true, ...defaultParams } = options;

  const [icons, setIcons] = useState<Icon[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(defaultParams.page || 1);

  const fetchIcons = useCallback(
    async (params?: GetIconsParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await iconApi.getIcons({
          ...defaultParams,
          ...params,
        });

        if (response.success) {
          setIcons(response.data.list);
          setTotal(response.data.total);
          setHasMore(response.data.hasMore);
          setCurrentPage(response.data.page);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取图标失败'));
      } finally {
        setLoading(false);
      }
    },
    [defaultParams]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await iconApi.getIcons({
        ...defaultParams,
        page: currentPage + 1,
      });

      if (response.success) {
        setIcons((prev) => [...prev, ...response.data.list]);
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
        setCurrentPage(response.data.page);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载更多失败'));
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, currentPage, defaultParams]);

  const refresh = useCallback(async () => {
    setCurrentPage(1);
    await fetchIcons({ ...defaultParams, page: 1 });
  }, [fetchIcons, defaultParams]);

  useEffect(() => {
    if (autoFetch) {
      fetchIcons();
    }
  }, [autoFetch, fetchIcons]);

  return {
    icons,
    total,
    loading,
    error,
    hasMore,
    fetchIcons,
    loadMore,
    refresh,
  };
}
