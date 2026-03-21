'use client';

import { useState, useEffect, useCallback } from 'react';
import { illustrationApi, GetIllustrationsParams, Illustration } from '@/lib/api/index';

interface UseIllustrationsOptions extends GetIllustrationsParams {
  autoFetch?: boolean;
}

interface UseIllustrationsReturn {
  illustrations: Illustration[];
  total: number;
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  fetchIllustrations: (params?: GetIllustrationsParams) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useIllustrations(options: UseIllustrationsOptions = {}): UseIllustrationsReturn {
  const { autoFetch = true, ...defaultParams } = options;

  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(defaultParams.page || 1);

  const fetchIllustrations = useCallback(
    async (params?: GetIllustrationsParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await illustrationApi.getIllustrations({
          ...defaultParams,
          ...params,
        });

        if (response.success) {
          setIllustrations(response.data.list);
          setTotal(response.data.total);
          setHasMore(response.data.hasMore);
          setCurrentPage(response.data.page);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取插画失败'));
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
      const response = await illustrationApi.getIllustrations({
        ...defaultParams,
        page: currentPage + 1,
      });

      if (response.success) {
        setIllustrations((prev) => [...prev, ...response.data.list]);
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
    await fetchIllustrations({ ...defaultParams, page: 1 });
  }, [fetchIllustrations, defaultParams]);

  useEffect(() => {
    if (autoFetch) {
      fetchIllustrations();
    }
  }, [autoFetch, fetchIllustrations]);

  return {
    illustrations,
    total,
    loading,
    error,
    hasMore,
    fetchIllustrations,
    loadMore,
    refresh,
  };
}
