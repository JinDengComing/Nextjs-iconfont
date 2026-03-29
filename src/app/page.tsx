'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PersonalInfo, WorkExperience, Education, PortfolioProject } from '@/types';
import { MapPin, Mail, Phone, Globe, Linkedin, Github, Twitter, Instagram, Edit } from 'lucide-react';
import OSSUploader from '@/components/OSSUploader';

export default function Home() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  const [projectList, setProjectList] = useState<PortfolioProject[]>([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAvatarUploader, setShowAvatarUploader] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const handleAvatarUpload = async (url: string) => {
    try {
      setAvatarUploading(true);
      // 这里应该调用API更新个人信息中的头像URL
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新本地状态
      if (personalInfo) {
        const updatedInfo = { ...personalInfo, avatar: url };
        setPersonalInfo(updatedInfo);
      }

      setShowAvatarUploader(false);
    } catch (err) {
      setError('更新头像失败');
      console.error('Avatar update error:', err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarError = (errorMsg: string) => {
    setError(errorMsg);
  };

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const response = await api.personalInfo.get();
        const ProjectRes = await api.portfolio.getList({ page: 1, pageSize: 3 })
        if (response.success) {
          setPersonalInfo(response.data?.personalInfo || null);
          setShowAvatarUploader(response.data?.personalInfo?.avatar ? false : true)
          setWorkExperience(response.data?.workExperience || []);
          setEducation(response.data?.education || []);

          if (ProjectRes.success) {
            setProjectList(ProjectRes?.data?.list)
          }
        } else {
          setError('获取个人信息失败');
        }
      } catch (err) {
        setError('服务器出了小差，请等下再试试咯~');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

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
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-8 md:mb-0">
              {showAvatarUploader ? (
                <div className="w-48 h-48 mx-auto">
                  <OSSUploader
                    onUpload={handleAvatarUpload}
                    onError={handleAvatarError}
                    accept="image/*"
                    maxSize={5 * 1024 * 1024}
                    disabled={avatarUploading}
                    userId={personalInfo?.id}
                  />
                </div>
              ) : (
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                  <img
                    src={personalInfo?.avatar || '/placeholder-avatar.png'}
                    alt={personalInfo?.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setShowAvatarUploader(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                    title="更改头像"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{personalInfo?.name || 'Your Name'}</h1>
              <p className="text-xl md:text-2xl mb-6">{personalInfo?.title || 'Your Title'}</p>
              <p className="mb-8 text-blue-100 max-w-2xl">
                {personalInfo?.bio || 'Welcome to my personal portfolio website. Here you can learn more about my work experience, education, and projects.'}
              </p>
              <div className="flex flex-wrap gap-4">
                {personalInfo?.email && (
                  <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 text-white hover:text-blue-100">
                    <Mail size={18} />
                    <span>{personalInfo.email}</span>
                  </a>
                )}
                {personalInfo?.phone && (
                  <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-2 text-white hover:text-blue-100">
                    <Phone size={18} />
                    <span>{personalInfo.phone}</span>
                  </a>
                )}
                {personalInfo?.location && (
                  <div className="flex items-center gap-2 text-white">
                    <MapPin size={18} />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo?.website && (
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white hover:text-blue-100">
                    <Globe size={18} />
                    <span>{personalInfo.website}</span>
                  </a>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                {personalInfo?.socialLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    {link.platform === 'linkedin' && <Linkedin size={20} />}
                    {link.platform === 'github' && <Github size={20} />}
                    {link.platform === 'twitter' && <Twitter size={20} />}
                    {link.platform === 'instagram' && <Instagram size={20} />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">工作履历</h2>
          <div className="space-y-8">
            {workExperience.length > 0 ? (
              workExperience.map((exp) => (
                <div key={exp.id} className="flex flex-col md:flex-row gap-6  border-b-indigo-500">
                  <div className="md:w-1/4">
                    <div className="bg-blue-100 rounded-lg p-4">
                      <p className="font-semibold text-blue-700">{exp.company}</p>
                      {
                        exp.startDate &&
                        <p className="text-sm text-gray-600">
                          {new Date(exp.startDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })} -
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) : '至今'}
                        </p>
                      }
                    </div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{exp.position}</h3>
                    <p className="text-gray-600 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">暂无工作履历数据</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Portfolio Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">作品集</h2>
            <a
              href="/portfolio"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看全部
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {
              projectList?.length > 0 &&
              projectList.map((_: PortfolioProject) => (
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow" key={_?.id}>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">{_.coverImage || '项目预览图'}</p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{_.title}</h3>
                    <p className="text-gray-600 mb-4">{_.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {_.tags?.length > 0 &&
                        _.tags.map((tag: string) => (
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">{tag}</span>
                        ))
                      }
                      {/* <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">前端</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">React</span> */}
                    </div>
                    <a
                      href="/portfolio/1"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      查看详情 →
                    </a>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">教育背景</h2>
          <div className="space-y-8">
            {education.length > 0 ? (
              education.map((edu) => (
                <div key={edu.id} className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <div className="bg-green-100 rounded-lg p-4">
                      <p className="font-semibold text-green-700">{edu.institution}</p>
                      {edu.startDate && <p className="text-sm text-gray-600">
                        {new Date(edu.startDate).toLocaleDateString('zh-CN', { year: 'numeric' })} -
                        {new Date(edu.endDate).toLocaleDateString('zh-CN', { year: 'numeric' })}
                      </p>}
                      {
                        edu.degree && <p className="text-sm text-gray-600">{edu.degree}</p>
                      }
                    </div>
                  </div>
                  {/* <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree} </h3>
                    <p className="text-gray-600">{edu.description}</p>
                  </div> */}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">暂无教育背景数据</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">{personalInfo?.name || 'Your Name'}</h3>
              <p className="text-gray-400">{personalInfo?.title || 'Your Title'}</p>
            </div>
            <div className="flex gap-4">
              {personalInfo?.socialLinks?.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {link.platform === 'linkedin' && <Linkedin size={20} />}
                  {link.platform === 'github' && <Github size={20} />}
                  {link.platform === 'twitter' && <Twitter size={20} />}
                  {link.platform === 'instagram' && <Instagram size={20} />}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {personalInfo?.name || 'Your Name'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
