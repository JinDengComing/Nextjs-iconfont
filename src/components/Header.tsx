'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  const pathname = usePathname();

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors ${
      isActive
        ? 'text-black dark:text-white theme-blue:text-blue-900 theme-purple:text-purple-900 theme-green:text-green-900'
        : 'text-zinc-600 dark:text-zinc-400 theme-blue:text-blue-700 theme-purple:text-purple-700 theme-green:text-green-700 hover:text-black dark:hover:text-white theme-blue:hover:text-blue-900 theme-purple:hover:text-purple-900 theme-green:hover:text-green-900'
    }`;
  };

  return (
    <header className="bg-white dark:bg-black theme-blue:bg-blue-100 theme-purple:bg-purple-100 theme-green:bg-green-100 border-b border-zinc-200 dark:border-zinc-800 theme-blue:border-blue-200 theme-purple:border-purple-200 theme-green:border-green-200 sticky top-0 z-40">
      <div className="header container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-black dark:text-white theme-blue:text-blue-900 theme-purple:text-purple-900 theme-green:text-green-900">
              个人作品集
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={getNavLinkClass('/')}>
                首页
              </Link>
              <Link href="/portfolio" className={getNavLinkClass('/portfolio')}>
                作品集
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
