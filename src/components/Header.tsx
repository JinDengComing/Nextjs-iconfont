'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { User, LogOut } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const { user, isAuthenticated, showLoginModal, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-black theme-blue:bg-blue-100 theme-purple:bg-purple-100 theme-green:bg-green-100 border-b border-zinc-200 dark:border-zinc-800 theme-blue:border-blue-200 theme-purple:border-purple-200 theme-green:border-green-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-black dark:text-white theme-blue:text-blue-900 theme-purple:text-purple-900 theme-green:text-green-900">
              iconfont
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-black dark:text-white theme-blue:text-blue-900 theme-purple:text-purple-900 theme-green:text-green-900 hover:text-zinc-600 dark:hover:text-zinc-400 theme-blue:hover:text-blue-700 theme-purple:hover:text-purple-700 theme-green:hover:text-green-700">
                首页
              </Link>
              <Link href="/icons" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 theme-blue:text-blue-700 theme-purple:text-purple-700 theme-green:text-green-700 hover:text-black dark:hover:text-white theme-blue:hover:text-blue-900 theme-purple:hover:text-purple-900 theme-green:hover:text-green-900">
                图标库
              </Link>
              <Link href="/illustrations" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 theme-blue:text-blue-700 theme-purple:text-purple-700 theme-green:text-green-700 hover:text-black dark:hover:text-white theme-blue:hover:text-blue-900 theme-purple:hover:text-purple-900 theme-green:hover:text-green-900">
                插画库
              </Link>
              <Link href="/ai-tools" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 theme-blue:text-blue-700 theme-purple:text-purple-700 theme-green:text-green-700 hover:text-black dark:hover:text-white theme-blue:hover:text-blue-900 theme-purple:hover:text-purple-900 theme-green:hover:text-green-900">
                AI工具
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/my-materials" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 theme-blue:text-blue-700 theme-purple:text-purple-700 theme-green:text-green-700 hover:text-black dark:hover:text-white theme-blue:hover:text-blue-900 theme-purple:hover:text-purple-900 theme-green:hover:text-green-900">
                  我的素材
                </Link>
                <div className="flex items-center gap-2">
                  <User size={20} className="text-zinc-600 dark:text-zinc-400" />
                  <span className="text-sm font-medium text-black dark:text-white theme-blue:text-blue-900 theme-purple:text-purple-900 theme-green:text-green-900">
                    {user?.username}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 theme-blue:text-blue-700 theme-purple:text-purple-700 theme-green:text-green-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span>退出</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/my-materials" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 theme-blue:text-blue-700 theme-purple:text-purple-700 theme-green:text-green-700 hover:text-black dark:hover:text-white theme-blue:hover:text-blue-900 theme-purple:hover:text-purple-900 theme-green:hover:text-green-900">
                  我的素材
                </Link>
                <button
                  onClick={showLoginModal}
                  className="px-4 py-2 bg-black dark:bg-white theme-blue:bg-blue-600 theme-purple:bg-purple-600 theme-green:bg-green-600 text-white dark:text-black text-sm font-medium rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 theme-blue:hover:bg-blue-700 theme-purple:hover:bg-purple-700 theme-green:hover:bg-green-700 transition-colors"
                >
                  登录
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
