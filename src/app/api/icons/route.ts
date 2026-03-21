import { NextRequest, NextResponse } from 'next/server';
import { getIcons, createIcon } from '@/lib/db/models/icons';
import { getCache, setCache, getIconsCacheKey, clearIconsCache } from '@/lib/cache';
import { authenticate } from '@/lib/auth';
import type { Icon } from '@/types';

const CACHE_TTL = 300; // 5分钟缓存

// 获取图标列表 - 公开接口，不需要登录
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const style = searchParams.get('style') || undefined;
    const category = searchParams.get('category') || undefined;
    const keyword = searchParams.get('keyword') || undefined;

    const params = { page, pageSize, style, category, keyword };

    // 生成缓存key
    const cacheKey = getIconsCacheKey(params);

    // 尝试从缓存获取
    const cached = await getCache<{ list: Icon[]; total: number; page: number; pageSize: number; hasMore: boolean }>(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
      });
    }

    // 从数据库查询
    const result = await getIcons(params);

    const response = {
      list: result.list,
      total: result.total,
      page,
      pageSize,
      hasMore: page * pageSize < result.total,
    };

    // 设置缓存
    await setCache(cacheKey, response, CACHE_TTL);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Get icons error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取图标列表失败',
      },
      { status: 500 }
    );
  }
}

// 创建图标 - 需要登录
export async function POST(request: NextRequest) {
  try {
    // 校验 token
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

    const body = await request.json();

    // 验证必填字段
    if (!body.name || !body.category || !body.svg) {
      return NextResponse.json(
        {
          success: false,
          message: '缺少必填字段：name, category, svg',
        },
        { status: 400 }
      );
    }

    const newIcon = await createIcon({
      name: body.name,
      category: body.category,
      style: body.style || 'linear',
      tags: body.tags || [],
      svg: body.svg,
      author: body.author || user.username, // 使用登录用户的用户名
      likes: 0,
      downloads: 0,
    });

    // 清除列表缓存
    await clearIconsCache();

    return NextResponse.json({
      success: true,
      data: newIcon,
      message: '图标创建成功',
    }, { status: 201 });
  } catch (error) {
    console.error('Create icon error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建图标失败',
      },
      { status: 500 }
    );
  }
}
