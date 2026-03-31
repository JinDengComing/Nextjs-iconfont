'use client';

import { useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';

interface OSSUploaderProps {
  onUpload: (url: string, isCover?: boolean) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
  userId?: string;
  multiple?: boolean;//是否支持多选
}

export default function OSSUploader({
  onUpload,
  onError,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false,
  className = '',
  userId,
  multiple = false,
}: OSSUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.match(accept)) {
      onError?.('文件类型不支持');
      return;
    }

    // 检查文件大小
    if (file.size > maxSize) {
      onError?.(`文件大小超过限制 (最大 ${maxSize / 1024 / 1024}MB)`);
      return;
    }

    try {
      setIsUploading(true);

      // 创建预览
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', file);
      if (userId) {
        formData.append('userId', userId);
      }

      // 调用上传API
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '上传失败');
      }

      // 获取上传后的文件URL
      const ossUrl = result.data.url;

      onUpload(ossUrl);
    } catch (error) {
      onError?.('上传失败，请重试');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className={`${className}`}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        className="hidden"
        id="oss-uploader"
      />
      <label
        htmlFor="oss-uploader"
        className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">上传中...</span>
          </div>
        ) : preview && !multiple ? (
          <div className="relative w-full max-w-xs">
            <img
              src={preview}
              alt="预览"
              className="w-full h-auto rounded-lg"
            />
            <button
              type="button"
              onClick={clearPreview}
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">点击重新上传</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-300 mb-2" />
            <span className="hidden md:inline-block text-sm text-gray-600 dark:text-gray-200">点击上传文件</span>
            <span className="hidden md:inline-block text-xs text-gray-500 dark:text-gray-200 mt-1">支持 {accept}，最大 {maxSize / 1024 / 1024}MB</span>
          </div>
        )}
      </label>
    </div>
  );
}
