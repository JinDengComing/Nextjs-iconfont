import { query, execute } from '../config';
import type { Icon } from '@/types';

interface IconRow {
  id: string;
  name: string;
  category: string;
  style: Icon['style'];
  tags: string;
  svg: string;
  author: string;
  likes: number;
  downloads: number;
  created_at: Date;
  updated_at: Date;
}

function rowToIcon(row: IconRow): Icon {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    style: row.style,
    tags: JSON.parse(row.tags || '[]'),
    svg: row.svg,
    author: row.author,
    likes: row.likes,
    downloads: row.downloads,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export interface GetIconsParams {
  page?: number;
  pageSize?: number;
  style?: string;
  category?: string;
  keyword?: string;
}

export interface GetIconsResult {
  list: Icon[];
  total: number;
}

export async function getIcons(params: GetIconsParams): Promise<GetIconsResult> {
  const { page = 1, pageSize = 20, style, category, keyword } = params;
  const offset = (page - 1) * pageSize;

  let whereClause = 'WHERE 1=1';
  const queryParams: (string | number)[] = [];

  if (style && style !== 'all') {
    whereClause += ' AND style = ?';
    queryParams.push(style);
  }

  if (category) {
    whereClause += ' AND category = ?';
    queryParams.push(category);
  }

  if (keyword) {
    whereClause += ' AND (name LIKE ? OR JSON_SEARCH(tags, "one", ?) IS NOT NULL)';
    queryParams.push(`%${keyword}%`, keyword);
  }

  // 获取总数
  const countResult = await query<{ total: number }>(
    `SELECT COUNT(*) as total FROM icons ${whereClause}`,
    queryParams
  );
  const total = countResult[0]?.total || 0;

  // 获取列表
  const rows = await query<IconRow>(
    `SELECT * FROM icons ${whereClause} ORDER BY downloads DESC LIMIT ? OFFSET ?`,
    [...queryParams, pageSize, offset]
  );

  return {
    list: rows.map(rowToIcon),
    total,
  };
}

export async function getIconById(id: string): Promise<Icon | null> {
  const rows = await query<IconRow>(
    'SELECT * FROM icons WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rowToIcon(rows[0]);
}

export async function createIcon(data: Omit<Icon, 'id' | 'createdAt' | 'updatedAt'>): Promise<Icon> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await execute(
    `INSERT INTO icons (id, name, category, style, tags, svg, author, likes, downloads, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.category,
      data.style,
      JSON.stringify(data.tags),
      data.svg,
      data.author,
      data.likes || 0,
      data.downloads || 0,
      now,
      now,
    ]
  );

  return {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateIcon(id: string, data: Partial<Icon>): Promise<boolean> {
  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.category !== undefined) {
    updates.push('category = ?');
    values.push(data.category);
  }
  if (data.style !== undefined) {
    updates.push('style = ?');
    values.push(data.style);
  }
  if (data.tags !== undefined) {
    updates.push('tags = ?');
    values.push(JSON.stringify(data.tags));
  }
  if (data.svg !== undefined) {
    updates.push('svg = ?');
    values.push(data.svg);
  }
  if (data.likes !== undefined) {
    updates.push('likes = ?');
    values.push(data.likes);
  }
  if (data.downloads !== undefined) {
    updates.push('downloads = ?');
    values.push(data.downloads);
  }

  if (updates.length === 0) {
    return false;
  }

  values.push(id);

  const result = await execute(
    `UPDATE icons SET ${updates.join(', ')} WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
}

export async function deleteIcon(id: string): Promise<boolean> {
  const result = await execute(
    'DELETE FROM icons WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}

export async function incrementDownloads(id: string): Promise<void> {
  await execute(
    'UPDATE icons SET downloads = downloads + 1 WHERE id = ?',
    [id]
  );
}

export async function incrementLikes(id: string): Promise<void> {
  await execute(
    'UPDATE icons SET likes = likes + 1 WHERE id = ?',
    [id]
  );
}

export async function decrementLikes(id: string): Promise<void> {
  await execute(
    'UPDATE icons SET likes = GREATEST(likes - 1, 0) WHERE id = ?',
    [id]
  );
}
