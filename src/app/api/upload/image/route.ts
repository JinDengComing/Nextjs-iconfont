import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import ossClient from '@/lib/oss/config';
import dbService from '@/lib/db/service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string; // 可选，用于更新数据库

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: '请选择文件',
        },
        { status: 400 }
      );
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: '只支持 JPEG、PNG、GIF、WebP 格式的图片',
        },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}${file.name.substring(file.name.lastIndexOf('.'))}`;
    const ossPath = `avatars/${fileName}`; // OSS存储路径

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      // 上传到OSS
      await ossClient.put(ossPath, buffer);

      // 生成OSS访问URL
      const ossUrl = ossClient.signatureUrl(ossPath, {
        expires: 3600 * 24 * 365, // 1年有效期
      });

      // 如果提供了userId，更新数据库中的头像字段
      if (userId) {
        try {
          const personalInfoList = await dbService.getPersonalInfo();
          if (personalInfoList && personalInfoList.length > 0) {
            const personalInfo = personalInfoList[0];
            await dbService.createPersonalInfo({
              ...personalInfo,
              avatar: ossUrl,
            });
          }
        } catch (dbError) {
          console.error('数据库更新个人头像失败:', dbError);
          // 数据库更新失败不影响上传结果
        }
      }

      return NextResponse.json({
        success: true,
        data: { url: ossUrl },
        message: '文件上传成功',
      });
    } catch (ossError) {
      console.error('OSS upload error:', ossError);

      // OSS上传失败，尝试本地保存
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, fileName);
      writeFileSync(filePath, buffer);

      // 生成本地访问 URL
      const fileUrl = `/uploads/${fileName}`;

      // 如果提供了userId，更新数据库中的头像字段
      if (userId) {
        try {
          const personalInfoList = await dbService.getPersonalInfo();
          if (personalInfoList && personalInfoList.length > 0) {
            const personalInfo = personalInfoList[0];
            await dbService.createPersonalInfo({
              ...personalInfo,
              avatar: fileUrl,
            });
          }
        } catch (dbError) {
          console.error('Update database error:', dbError);
        }
      }

      return NextResponse.json({
        success: true,
        data: { url: fileUrl },
        message: 'OSS上传失败，已保存到本地',
      });
    }
  } catch (error) {
    console.error('Upload image error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '文件上传失败',
      },
      { status: 500 }
    );
  }
}
