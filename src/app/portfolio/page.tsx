'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PortfolioProject } from '@/types';
import { ArrowRight, ExternalLink, Github as GithubIcon } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.portfolio.getList({ page, pageSize: 10 });
        if (response.success) {
          if (page === 1) {
            setProjects(response.data?.list || []);
          } else {
            setProjects(prev => [...prev, ...(response.data?.list || [])]);
          }
          setHasMore(response.data?.hasMore || false);
        } else {
          setError('获取作品集失败');
        }
      } catch (err) {
        setError('网络错误');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">我的作品集</h1>
          <p className="text-xl text-blue-100">
            这里展示了我完成的一些项目，包括前端、后端和全栈开发作品
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {projects.length > 0 ? (
            <div className="space-y-12">
              {projects.map((project) => (
                <div key={project.id} className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/5">
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                      {project.coverImage && <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />}
                    </div>
                  </div>
                  <div className="md:w-3/5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {project.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h2>
                    <p className="text-gray-600 mb-6">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href={`/portfolio/${project.id}`}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        查看详情
                        <ArrowRight size={18} />
                      </a>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          在线演示
                          <ExternalLink size={18} />
                        </a>
                      )}
                      {project.sourceUrl && (
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          源代码
                          <GithubIcon size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={loading}
                  >
                    {loading ? '加载中...' : '加载更多'}
                  </button>
                </div>
              )}

              {!hasMore && projects.length > 0 && (
                <div className="text-center mt-12">
                  <p className="text-gray-500">没有更多项目了</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-gray-600 text-xl mb-6">暂无作品集数据</p>
              <a
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                返回首页
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">我的作品集</h3>
            <p className="text-gray-400 mb-6">
              感谢您查看我的作品，如有合作意向，请联系我
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回首页
            </a>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} 我的作品集. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
