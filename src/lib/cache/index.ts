import { getRedis } from '@/lib/redis/config';

const DEFAULT_TTL = 300; // 5分钟默认缓存时间

interface CacheOptions {
  ttl?: number; // 缓存时间（秒）
  key?: string; // 自定义缓存key
}

/**
 * 获取缓存
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redis = getRedis();
    const data = await redis.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * 设置缓存
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  try {
    const redis = getRedis();
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttl, serialized);
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * 删除缓存
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = getRedis();
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

/**
 * 删除匹配的缓存（使用通配符）
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const redis = getRedis();
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Cache delete pattern error:', error);
  }
}

/**
 * 缓存装饰器 - 自动缓存函数结果
 */
export function withCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: CacheOptions = {}
): T {
  const { ttl = DEFAULT_TTL, key: customKey } = options;

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // 生成缓存key
    const cacheKey = customKey || `${fn.name}:${JSON.stringify(args)}`;

    // 尝试从缓存获取
    const cached = await getCache<ReturnType<T>>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // 执行原函数
    const result = await fn(...args);

    // 设置缓存
    await setCache(cacheKey, result, ttl);

    return result as ReturnType<T>;
  }) as T;
}

/**
 * 生成图标列表缓存key
 */
export function getIconsCacheKey(params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join(':');
  return `icons:list:${sortedParams}`;
}

/**
 * 生成图标详情缓存key
 */
export function getIconDetailCacheKey(id: string): string {
  return `icons:detail:${id}`;
}

/**
 * 生成插画列表缓存key
 */
export function getIllustrationsCacheKey(params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join(':');
  return `illustrations:list:${sortedParams}`;
}

/**
 * 生成插画详情缓存key
 */
export function getIllustrationDetailCacheKey(id: string): string {
  return `illustrations:detail:${id}`;
}

/**
 * 清除图标相关缓存
 */
export async function clearIconsCache(): Promise<void> {
  await deleteCachePattern('icons:*');
}

/**
 * 清除插画相关缓存
 */
export async function clearIllustrationsCache(): Promise<void> {
  await deleteCachePattern('illustrations:*');
}
