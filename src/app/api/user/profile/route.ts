import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) {
    return authError;
  }

  const user = (request as any).user;

  return NextResponse.json({
    success: true,
    data: {
      id: user.userId,
      username: user.username,
      email: user.email,
    },
  });
}
