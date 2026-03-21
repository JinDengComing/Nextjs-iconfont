import { NextRequest, NextResponse } from 'next/server';
import { getIconById, updateIcon, deleteIcon, incrementDownloads, incrementLikes, decrementLikes } from '@/lib/db/models/icons';
import { getCache, setCache, deleteCache, getIconDetailCacheKey, clearIconsCache } from '@/lib/cache';
import { authenticate } from '@/lib/auth';
import type { Icon } from '@/types';

const CACHE_TTL = 600; // 10分钟详情缓存

// 获取图标详情 - 公开接口，不需要登录
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cacheKey = getIconDetailCacheKey(id);

    // 尝试从缓存获取
    const cached = await getCache<Icon>(cacheKey);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
      });
    }

    const icon = await getIconById(id);

    if (!icon) {
      return NextResponse.json(
        {
          success: false,
          message: '图标不存在',
        },
        { status: 404 }
      );
    }

    // 设置缓存
    await setCache(cacheKey, icon, CACHE_TTL);

    return NextResponse.json({
      success: true,
      data: icon,
    });
  } catch (error) {
    console.error('Get icon error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取图标失败',
      },
      { status: 500 }
    );
  }
}

// 更新图标 - 需要登录
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    const success = await updateIcon(id, body);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: '图标不存在或无需更新',
        },
        { status: 404 }
      );
    }

    // 清除相关缓存
    await deleteCache(getIconDetailCacheKey(id));
    await clearIconsCache();

    return NextResponse.json({
      success: true,
      message: '图标更新成功',
    });
  } catch (error) {
    console.error('Update icon error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新图标失败',
      },
      { status: 500 }
    );
  }
}

// 删除图标 - 需要登录
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const success = await deleteIcon(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: '图标不存在',
        },
        { status: 404 }
      );
    }

    // 清除相关缓存
    await deleteCache(getIconDetailCacheKey(id));
    await clearIconsCache();

    return NextResponse.json({
      success: true,
      message: '图标删除成功',
    });
  } catch (error) {
    console.error('Delete icon error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除图标失败',
      },
      { status: 500 }
    );
  }
}

// 下载/点赞图标 - 需要登录
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const { action } = await request.json();

    if (action === 'download') {
      await incrementDownloads(id);
      // 清除详情缓存，因为下载数变了
      await deleteCache(getIconDetailCacheKey(id));
      return NextResponse.json({
        success: true,
        message: '下载成功',
      });
    }

    if (action === 'like') {
      await incrementLikes(id);
      await deleteCache(getIconDetailCacheKey(id));
      return NextResponse.json({
        success: true,
        message: '点赞成功',
      });
    }

    if (action === 'unlike') {
      await decrementLikes(id);
      await deleteCache(getIconDetailCacheKey(id));
      return NextResponse.json({
        success: true,
        message: '取消点赞成功',
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: '无效的操作',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Icon action error:', error);
    return NextResponse.json(
      {
        success: false,
        message: '操作失败',
      },
      { status: 500 }
    );
  }
}
