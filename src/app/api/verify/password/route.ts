import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // 从环境变量中读取正确的密码
    const expectedPassword = process.env.VERIFICATION_PASSWORD;
    
    if (!expectedPassword) {
      return NextResponse.json(
        { success: false, message: '服务器未配置验证密码' },
        { status: 500 }
      );
    }
    
    const isVerified = password === expectedPassword;
    
    return NextResponse.json({
      success: true,
      data: { isVerified },
      message: isVerified ? '密码正确' : '密码错误'
    });
  } catch (error) {
    console.error('密码验证错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}
