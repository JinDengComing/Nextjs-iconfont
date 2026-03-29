'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 当 pathname 变化时，显示 loading
    setIsLoading(true);

    // 使用 requestAnimationFrame 确保在渲染完成后隐藏 loading
    const handleComplete = () => {
      setIsLoading(false);
    };

    // 延迟一点时间来确保页面已经渲染
    const timer = setTimeout(handleComplete, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center gap-4">
        {/* 旋转的圆圈动画 */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        
        {/* 加载文字 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">
            页面加载中
          </p>
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
