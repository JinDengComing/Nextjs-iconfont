import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '$2b$10$RmKnSGSUk4k1Xzr6twaCBOvj6ZvhpxRBNICxZR7i4bavqCrsr0A72',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: '邮箱和密码不能为空',
        },
        { status: 400 }
      );
    }

    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: '邮箱或密码错误',
        },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: '邮箱或密码错误',
        },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      message: '登录成功',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '登录失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
