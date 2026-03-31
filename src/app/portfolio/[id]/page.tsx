'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OSSUploader from '@/components/OSSUploader';
import ImageModal from '@/components/ImageModal';
import { api } from '@/lib/api';
import { PortfolioProject } from '@/types';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { useVerification } from '@/components/VerificationContext';
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
  const { theme } = useTheme();
  const { verifyPassword } = useVerification();
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
  const [password, setPassword] = useState('');



  // Image modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

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

  const handleImageUpload = async (url: string, isCover = false) => {
    try {
      // 验证密码
      const isVerified = await verifyPassword();
      if (!isVerified) {
        return;
      }
      
      if (isCover) {
        setCoverImage(url);
      } else {
        setImages(prev => [...prev, { url, alt: '' }]);
      }
    } catch (err) {
      console.error('上传失败:', err);
    }
  };

  const handleRemoveCoverImage = async () => {
    // 验证密码
    const isVerified = await verifyPassword();
    if (!isVerified) {
      return;
    }
    setCoverImage('');
  };

  const handleRemoveImage = async (index: number) => {
    // 验证密码
    const isVerified = await verifyPassword();
    if (!isVerified) {
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageError = (error: string) => {
    setError(error);
  };

  const handleSave = async () => {
    try {
      // 验证密码
      const isVerified = await verifyPassword();
      if (!isVerified) {
        return;
      }
      
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
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
    <div className={cn('min-h-screen bg-background text-foreground')} style={{
      background: theme === 'light' ? '#ffffff' : '#0a0a0a',
      color: theme === 'light' ? '#171717' : '#ededed'
    }}>
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
      <section className={cn('py-16 bg-background')} style={{ background: theme === 'light' ? '#ffffff' : '#0a0a0a' }}>
        <div className="container mx-auto px-4">
          {isEditing ? (
            <div className="space-y-8">
              {/* Cover Image */}
              <div>
                <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>封面图片</label>
                <div className="flex items-center  justify-center gap-4">
                  <div className="w-48 rounded-lg overflow-hidden relative">
                    {coverImage ? (
                      <>
                        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <button
                          onClick={handleRemoveCoverImage}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors text-white"
                          title="删除封面图片"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {/* 上传封面 */}
                        {/* <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && e.target.files[0] && handleImageUpload(e.target.files[0], true)}
                          className="w-full h-full absolute top-0 left-0 px-4 py-2 border border-gray-200 text-slate-400 rounded-lg opacity-0"
                        /> */}
                        <OSSUploader
                          onUpload={(url) => handleImageUpload(url, true)}
                          onError={handleImageError}
                          accept="image/*"
                          maxSize={5 * 1024 * 1024}
                        />
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Title */}
              <div>
                <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>项目名称</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>项目描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>项目内容</label>
                <ReactQuill
                  value={content || ''}
                  onChange={setContent}
                  className="border border-gray-200 text-slate-400 rounded-lg"
                />
              </div>

              {/* Category */}
              <div>
                <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>分类</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className={cn('flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full')}
                      style={{ color: theme === 'light' ? 'var(--foreground)' : '#ededed', background: theme === 'light' ? '#f5f5f5' : '#222222' }}
                    >
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
                <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>项目图片</label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {images?.length > 0 && images.map((img, index) => (
                    <div key={index} className="relative">
                      <div className={cn('aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden')}>
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                  <div className={cn('aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 text-slate-400 hover:border-blue-500 cursor-pointer')}>
                    {/* <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && e.target.files[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                      id="image-upload"
                    /> */}
                    <div id="image-upload">
                      <OSSUploader
                        onUpload={(url) => handleImageUpload(url)}
                        onError={handleImageError}
                        accept="image/*"
                        maxSize={5 * 1024 * 1024}
                        multiple={true}
                      />
                    </div>
                    {/* 
                    <label htmlFor="image-upload" className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600">
                      <Upload size={24} />
                      <span>添加图片</span>
                    </label> */}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>在线演示链接</label>
                  <input
                    type="url"
                    value={demoUrl || ''}
                    onChange={(e) => setDemoUrl(e.target.value || null)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-200 text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className={cn('block text-gray-700 dark:text-gray-300 mb-2 font-medium')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>源代码链接</label>
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
                  className={cn('px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors')}
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchProject();
                  }}
                  className={cn('px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors')}
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Cover Image */}
              <div className={cn('rounded-lg overflow-hidden shadow-lg cursor-pointer')}
                onClick={() => {
                  if (project.coverImage) {
                    setCurrentImageUrl(project.coverImage);
                    setIsImageModalOpen(true);
                  }
                }}
              >
                {project.coverImage && <img
                  src={project.coverImage}
                  alt={project.title}
                  className={cn('w-full h-96 object-cover hover:opacity-90 transition-opacity')}
                />}
              </div>

              {/* Project Info */}
              <div className="flex flex-wrap items-end gap-4 mb-8">
                <span className={cn('px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium')}>
                  {project.category}
                </span>
                {project.tags.map((tag, index) => (
                  <span key={index} className={cn('h-6 items-end px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300')}>
                    {tag}
                  </span>
                )
                )}
              </div>

              {/* Project Content */}
              <div className={cn('prose max-w-none text-gray-500 dark:text-gray-400')} style={{ color: theme === 'light' ? '#171717' : '#ededed' }}>
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
              </div>

              {/* Project Images */}
              {project.images.length > 0 && (
                <div className="mt-12">
                  <h3 className={cn('text-2xl font-bold text-foreground mb-6')}>项目图片</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.images.map((img, index) => (
                      <div key={index} className={cn('rounded-lg overflow-hidden shadow-md cursor-pointer')}
                        onClick={() => {
                          setCurrentImageUrl(img.url);
                          setIsImageModalOpen(true);
                        }}
                      >
                        <img
                          src={img.url}
                          alt={img.alt}
                          className={cn('w-full h-64 object-cover hover:opacity-90 transition-opacity')}
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
                    className={cn('flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors')}
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
                    className={cn('flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors')}
                  >
                    源代码
                    <GithubIcon size={18} />
                  </a>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className={cn('flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors')}
                >
                  编辑项目
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={cn('bg-gray-900 text-white py-12')}>
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

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={currentImageUrl}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
}
