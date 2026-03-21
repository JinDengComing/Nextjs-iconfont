'use client';

import { use } from 'react'
import Link from 'next/link';
import { mockIllustrations } from '@/lib/data';

export default function IllustrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const illustration = mockIllustrations.find((i) => i.id === use(params)?.id);

  if (!illustration) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">插画不存在</p>
          <Link
            href="/illustrations"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            返回插画库
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-black dark:text-white">
                iconfont
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                  首页
                </Link>
                <Link href="/icons" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                  图标库
                </Link>
                <Link href="/illustrations" className="text-sm font-medium text-black dark:text-white">
                  插画库
                </Link>
                <Link href="/ai-tools" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                  AI工具
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/my-materials" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                我的素材
              </Link>
              <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
            <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-6">
              <span className="text-8xl">🖼️</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                下载原图
              </button>
              <button className="flex-1 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                收藏
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                {illustration.name}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                作者: {illustration.author}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-red-500">❤️</span>
                <span className="text-black dark:text-white font-medium">
                  {illustration.likes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">⬇️</span>
                <span className="text-black dark:text-white font-medium">
                  {illustration.downloads.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                分类
              </h3>
              <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">
                {illustration.category}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {illustration.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                下载格式
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  SVG
                </button>
                <button className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  PNG
                </button>
                <button className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  JPG
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
