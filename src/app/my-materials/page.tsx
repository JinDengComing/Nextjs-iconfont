'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockIcons, mockIllustrations } from '@/lib/data';

export default function MyMaterialsPage() {
  const [activeTab, setActiveTab] = useState<'icons' | 'illustrations' | 'projects'>('icons');

  const tabs = [
    { id: 'icons' as const, name: '我的图标', count: mockIcons.length },
    { id: 'illustrations' as const, name: '我的插画', count: mockIllustrations.length },
    { id: 'projects' as const, name: '我的项目', count: 3 },
  ];

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
                <Link href="/illustrations" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                  插画库
                </Link>
                <Link href="/ai-tools" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
                  AI工具
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/my-materials" className="text-sm font-medium text-black dark:text-white">
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
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4">我的素材</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            管理您的收藏、项目和创作记录
          </p>
        </div>

        <div className="mb-8">
          <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-black dark:border-white text-black dark:text-white'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'icons' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                收藏的图标
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  批量下载
                </button>
                <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  创建项目
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {mockIcons.map((icon) => (
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
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'illustrations' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                收藏的插画
              </h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                  批量下载
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockIllustrations.map((illustration) => (
                <Link
                  key={illustration.id}
                  href={`/illustrations/${illustration.id}`}
                  className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-800 group"
                >
                  <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-4xl">🖼️</span>
                  </div>
                  <div className="p-4">
                    <div className="font-medium text-black dark:text-white mb-1">
                      {illustration.name}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {illustration.author}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                我的项目
              </h2>
              <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                新建项目
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: '1', name: '移动端APP设计', icons: 24, illustrations: 12, updatedAt: '2026-03-19' },
                { id: '2', name: '网站图标库', icons: 156, illustrations: 8, updatedAt: '2026-03-18' },
                { id: '3', name: '品牌设计', icons: 48, illustrations: 24, updatedAt: '2026-03-15' },
              ].map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-semibold text-black dark:text-white mb-3">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    <span>🎨 {project.icons} 图标</span>
                    <span>🖼️ {project.illustrations} 插画</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      更新于 {project.updatedAt}
                    </span>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      查看详情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
