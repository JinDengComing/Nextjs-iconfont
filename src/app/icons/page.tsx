'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { iconStyles } from '@/lib/data';
import { iconApi, GetIconsParams, GetIconsResponse } from '@/lib/api/index';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import type { Icon } from '@/types';

export default function IconsPage() {
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchIcons = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: GetIconsParams = {};
      if (selectedStyle !== 'all') {
        params.style = selectedStyle;
      }
      if (searchQuery) {
        params.keyword = searchQuery;
      }

      const res = await iconApi.getIcons(params);

      if (res.success) {
        setIcons(res.data.list);
        setTotal(res.data.total);
      } else {
        setError(res.message || '获取图标失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [selectedStyle, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIcons();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchIcons]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">图标库</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            在 {total.toLocaleString()} 个图标中搜索
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="请输入图标关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStyle('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedStyle === 'all'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
            >
              全部
            </button>
            {iconStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedStyle === style.id
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchIcons}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              重试
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {icons.map((icon) => (
                <Link
                  key={icon.id}
                  href={`/icons/${icon.id}`}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-4 hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-800 flex flex-col items-center group"
                >
                  <div
                    className="w-12 h-12 mb-2 text-zinc-800 dark:text-zinc-200 group-hover:scale-110 transition-transform"
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
                    {icon.name}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                    <span>❤️ {icon.likes.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>

            {icons.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400">没有找到匹配的图标</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
