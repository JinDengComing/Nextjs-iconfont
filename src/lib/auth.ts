import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import type { JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function authenticate(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const user = authenticate(request);

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: '未授权，请先登录',
      },
      { status: 401 }
    );
  }

  return null;
}
