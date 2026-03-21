'use client';

import { useState } from 'react';
import Link from 'next/link';
import { aiTools } from '@/lib/data';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function AIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = aiTools.filter((tool) => {
    return selectedCategory === 'all' || tool.category === selectedCategory;
  });

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'icon', name: '图标' },
    { id: 'image', name: '图片' },
    { id: 'video', name: '视频' },
    { id: 'text', name: '文案' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
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
                <Link href="/illustrations" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                  插画库
                </Link>
                <Link href="/ai-tools" className="text-sm font-medium text-black dark:text-white">
                  AI工具
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">AI工具</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            智能AI工具，助力高效创作
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/ai-tools/${tool.id}`}
              className="bg-white dark:bg-zinc-900 rounded-xl p-6 hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-800 relative group"
            >
              {tool.isNew && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  新
                </span>
              )}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <div className="font-medium text-black dark:text-white mb-2">
                {tool.name}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                {tool.description}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
