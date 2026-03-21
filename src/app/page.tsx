'use client';

import Link from 'next/link';
import { iconCategories, aiTools, mockIcons, mockIllustrations } from '@/lib/data';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black theme-blue:bg-blue-50 theme-purple:bg-purple-50 theme-green:bg-green-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">从素材到AI工具，轻松做设计</h2>
            <p className="text-lg mb-6 opacity-90">海量精美素材，智能AI工具，助力从灵想到实现</p>
            <div className="flex gap-4">
              <Link href="/icons" className="px-6 py-3 bg-white text-blue-600 font-medium rounded-full hover:bg-zinc-100 transition-colors">
                开始探索
              </Link>
              <Link href="/ai-tools" className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors">
                AI工具
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h3 className="text-xl font-bold text-black dark:text-white mb-6">素材库</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {iconCategories.map((category) => (
              <Link
                key={category.id}
                href={category.path}
                className="bg-white dark:bg-zinc-900 rounded-xl p-6 hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-800"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <div className="font-medium text-black dark:text-white mb-1">{category.name}</div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {category.count.toLocaleString()} 个素材
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black dark:text-white">AI工具</h3>
            <Link href="/ai-tools" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              查看全部
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {aiTools.slice(0, 7).map((tool) => (
              <Link
                key={tool.id}
                href={`/ai-tools/${tool.id}`}
                className="bg-white dark:bg-zinc-900 rounded-xl p-4 hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-800 relative"
              >
                {tool.isNew && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    新
                  </span>
                )}
                <div className="text-3xl mb-2">{tool.icon}</div>
                <div className="font-medium text-black dark:text-white text-sm mb-1">{tool.name}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                  {tool.description}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black dark:text-white">热门图标</h3>
            <Link href="/icons" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              查看全部
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {mockIcons.slice(0, 8).map((icon) => (
              <Link
                key={icon.id}
                href={`/icons/${icon.id}`}
                className="bg-white dark:bg-zinc-900 rounded-xl p-4 hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-800 flex flex-col items-center"
              >
                <div
                  className="w-12 h-12 mb-2 text-zinc-800 dark:text-zinc-200"
                  dangerouslySetInnerHTML={{ __html: icon.svg }}
                />
                <div className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
                  {icon.name}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black dark:text-white">热门插画</h3>
            <Link href="/illustrations" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              查看全部
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockIllustrations.map((illustration) => (
              <Link
                key={illustration.id}
                href={`/illustrations/${illustration.id}`}
                className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-zinc-200 dark:border-zinc-800"
              >
                <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <span className="text-4xl">🖼️</span>
                </div>
                <div className="p-4">
                  <div className="font-medium text-black dark:text-white mb-1">
                    {illustration.name}
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {illustration.author}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>❤️ {illustration.likes.toLocaleString()}</span>
                    <span>⬇️ {illustration.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>© 2026 iconfont. 让设计更简单</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
