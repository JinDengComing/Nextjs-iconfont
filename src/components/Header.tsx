'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from './ThemeSwitcher';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return cn(
      'text-sm font-medium transition-colors',
      isActive
        ? 'text-black dark:text-white'
        : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
    );
  };

  return (
    <header className={cn('bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40')}>
      <div className="header container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className={cn('text-2xl font-bold text-black dark:text-white')}>
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
