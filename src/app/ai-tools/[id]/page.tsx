'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { aiTools } from '@/lib/data';

export default function AIToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const tool = aiTools.find((t) => t.id === use(params)?.id);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');

  if (!tool) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">工具不存在</p>
          <Link
            href="/ai-tools"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            返回AI工具
          </Link>
        </div>
      </div>
    );
  }

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setResult('AI处理结果将在这里显示...');
      setIsProcessing(false);
    }, 2000);
  };

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
                <Link href="/ai-tools" className="text-sm font-medium text-black dark:text-white">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{tool.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                {tool.name}
              </h1>
              {tool.isNew && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  新功能
                </span>
              )}
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">{tool.description}</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
          <div className="mb-6">
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              输入
            </label>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="请输入内容..."
              rows={6}
              className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleProcess}
            disabled={isProcessing || !inputValue}
            className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? '处理中...' : '开始处理'}
          </button>

          {result && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                结果
              </label>
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <p className="text-black dark:text-white">{result}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            使用说明
          </h3>
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>1. 在输入框中输入您想要处理的内容</li>
              <li>2. 点击"开始处理"按钮</li>
              <li>3. 等待AI处理完成</li>
              <li>4. 查看并下载处理结果</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
