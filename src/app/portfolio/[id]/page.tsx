'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PortfolioProject } from '@/types';
import { ArrowLeft, ExternalLink, Github as GithubIcon, Upload, Plus, Trash2 } from 'lucide-react';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; // 或者旧库的 css

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>加载编辑器中...</p>
});


export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);
  const [demoUrl, setDemoUrl] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.portfolio.getById(id!);
      if (response.success && response.data) {
        setProject(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setContent(response.data.content);
        setCategory(response.data.category);
        setTags(response.data.tags);
        setCoverImage(response.data.coverImage);
        setImages(response.data.images.map((img: any) => ({ url: img.url, alt: img.alt })));
        setDemoUrl(response.data.demoUrl);
        setSourceUrl(response.data.sourceUrl);
      } else {
        setError('项目不存在');
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, isCover = false) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.upload.image(formData);
      if (response.success && response.data?.url) {
        if (isCover) {
          setCoverImage(response.data.url);
        } else {
          setImages(prev => [...prev, { url: response.data.url, alt: file.name }]);
        }
      }
    } catch (err) {
      console.error('上传失败:', err);
    }
  };

  const handleSave = async () => {
    try {
      const projectData = {
        title,
        description,
        content,
        category,
        tags,
        coverImage,
        images: images.map((img, index) => ({ ...img, order: index })),
        demoUrl,
        sourceUrl,
      };

      const response = await api.portfolio.update(id!, projectData);
      if (response.success) {
        setProject(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('保存失败:', err);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '项目不存在'}</p>
          <button
            onClick={() => router.push('/portfolio')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回作品集
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
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/portfolio')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
          </div>
          <p className="text-xl text-blue-100">
            {project.description}
          </p>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {isEditing ? (
            <div className="space-y-8">
              {/* Cover Image */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">封面图片</label>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-27 bg-gray-200 rounded-lg overflow-hidden">
                    {coverImage ? (
                      <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        上传封面
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && e.target.files[0] && handleImageUpload(e.target.files[0], true)}
                    className="px-4 py-2 border border-gray-200 text-slate-400 rounded-lg"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">项目名称</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">项目描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">项目内容</label>
                <ReactQuill
                  value={content || ''}
                  onChange={setContent}
                  className="border border-gray-200 text-slate-400 rounded-lg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">分类</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="输入标签并按回车添加"
                    className="flex-1 px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    添加
                  </button>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">项目图片</label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {images?.length > 0 && images.map((img, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 text-slate-400 hover:border-blue-500 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && e.target.files[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600">
                      <Upload size={24} />
                      <span>添加图片</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">在线演示链接</label>
                  <input
                    type="url"
                    value={demoUrl || ''}
                    onChange={(e) => setDemoUrl(e.target.value || null)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">源代码链接</label>
                  <input
                    type="url"
                    value={sourceUrl || ''}
                    onChange={(e) => setSourceUrl(e.target.value || null)}
                    placeholder="https://github.com/username/repo"
                    className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProject();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Cover Image */}
              <div className="rounded-lg overflow-hidden shadow-lg">
                {project.coverImage && <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-96 object-cover"
                />}
              </div>

              {/* Project Info */}
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {project.category}
                </span>
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Project Content */}
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
              </div>

              {/* Project Images */}
              {project.images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-bold mb-6">项目图片</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.images.map((img, index) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-4 mt-8">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    源代码
                    <GithubIcon size={18} />
                  </a>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  编辑项目
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
            <p className="text-gray-400 mb-6">
              最后更新: {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
            </p>
            <a
              href="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回作品集
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
