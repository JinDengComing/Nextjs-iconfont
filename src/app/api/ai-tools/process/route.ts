import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, input, options } = body;

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    setTimeout(() => {
      console.log(`Task ${taskId} completed for tool ${toolId}`);
    }, 2000);

    return NextResponse.json({
      success: true,
      data: {
        taskId,
        status: 'processing',
        progress: 0,
        message: '任务已创建，正在处理中...',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: '处理失败',
        code: 500,
      },
      { status: 500 }
    );
  }
}
