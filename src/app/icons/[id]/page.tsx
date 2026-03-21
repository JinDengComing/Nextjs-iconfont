'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { iconApi } from '@/lib/api/index';
import { mockIcons } from '@/lib/data';

export default async function IconDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const iconId = use(params).id
  const res = await iconApi.getIconById(iconId);

  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState(24);

  if (!res?.success || !res?.data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">图标不存在</p>
          <Link
            href="/icons"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            返回图标库
          </Link>
        </div>
      </div>
    );
  }

  const icon = res?.data;

  const coloredSvg = icon.svg.replace(
    /stroke="currentColor"/g,
    `stroke="${selectedColor}"`
  );

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
                <Link href="/icons" className="text-sm font-medium text-black dark:text-white">
                  图标库
                </Link>
                <Link href="/illustrations" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
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
            <div className="flex items-center justify-center mb-8">
              <div
                className="transition-all"
                style={{ width: selectedSize * 2, height: selectedSize * 2 }}
                dangerouslySetInnerHTML={{ __html: coloredSvg }}
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  颜色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-black dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-2">
                  尺寸: {selectedSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="128"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                {icon?.name || '图标'}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                作者: {icon?.author || '未知'}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-red-500">❤️</span>
                <span className="text-black dark:text-white font-medium">
                  {icon.likes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500">⬇️</span>
                <span className="text-black dark:text-white font-medium">
                  {icon.downloads.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {icon.tags.map((tag) => (
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
                下载
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="px-4 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  SVG
                </button>
                <button className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  PNG
                </button>
                <button className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  React
                </button>
                <button className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  Vue
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                SVG 代码
              </h3>
              <div className="bg-zinc-900 rounded-xl p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{icon.svg}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
