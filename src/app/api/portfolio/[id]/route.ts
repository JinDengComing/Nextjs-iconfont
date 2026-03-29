import { NextRequest, NextResponse } from 'next/server';
import dbService from '@/lib/db/service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await dbService.getPortfolioProjectById(id);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: '项目不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get portfolio project error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取项目详情失败',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedProject = await dbService.updatePortfolioProject(id, body);

    if (!updatedProject) {
      return NextResponse.json(
        {
          success: false,
          message: '项目不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: '项目更新成功',
    });
  } catch (error) {
    console.error('Update portfolio project error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新项目失败',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await dbService.deletePortfolioProject(id);

    if (result.affected === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '项目不存在',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '项目删除成功',
    });
  } catch (error) {
    console.error('Delete portfolio project error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除项目失败',
      },
      { status: 500 }
    );
  }
}
