import { NextRequest, NextResponse } from 'next/server';
import dbService from '@/lib/db/service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const { projects, total } = await dbService.getPortfolioProjects(page, pageSize);

    return NextResponse.json({
      success: true,
      data: {
        list: projects,
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      },
    });
  } catch (error) {
    console.error('Get portfolio projects error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取作品集失败',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.description || !body.content || !body.coverImage) {
      return NextResponse.json(
        {
          success: false,
          message: '缺少必填字段',
        },
        { status: 400 }
      );
    }

    const newProject = await dbService.createPortfolioProject(body);

    return NextResponse.json(
      {
        success: true,
        data: newProject,
        message: '作品集创建成功',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create portfolio project error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建作品集失败',
      },
      { status: 500 }
    );
  }
}
