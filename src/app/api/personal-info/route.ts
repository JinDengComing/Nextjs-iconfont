import { NextRequest, NextResponse } from 'next/server';
import dbService from '@/lib/db/service';

export async function GET(request: NextRequest) {
  try {
    const [personalInfo] = await dbService.getPersonalInfo();
    const workExperience = await dbService.getWorkExperience();
    const education = await dbService.getEducation();

    return NextResponse.json({
      success: true,
      data: {
        personalInfo,
        workExperience,
        education,
      },
    });
  } catch (error) {
    console.error('Get personal info error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取个人信息失败',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.personalInfo) {
      await dbService.createPersonalInfo(body.personalInfo);
    }
    
    if (body.workExperience) {
      for (const exp of body.workExperience) {
        await dbService.createWorkExperience(exp);
      }
    }
    
    if (body.education) {
      for (const edu of body.education) {
        await dbService.createEducation(edu);
      }
    }

    return NextResponse.json({
      success: true,
      message: '个人信息保存成功',
    });
  } catch (error) {
    console.error('Save personal info error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '保存个人信息失败',
      },
      { status: 500 }
    );
  }
}
