import { query, execute } from '../config';
import type { Illustration } from '@/types';

interface IllustrationRow {
  id: string;
  name: string;
  category: string;
  tags: string;
  preview_url: string;
  file_url: string | null;
  author: string;
  likes: number;
  downloads: number;
  created_at: Date;
  updated_at: Date;
}

export function rowToIllustration(row: IllustrationRow): Illustration {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    tags: JSON.parse(row.tags || '[]'),
    previewUrl: row.preview_url,
    fileUrl: row.file_url || undefined,
    author: row.author,
    likes: row.likes,
    downloads: row.downloads,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export interface GetIllustrationsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  keyword?: string;
}

export interface GetIllustrationsResult {
  list: Illustration[];
  total: number;
}

export async function getIllustrations(params: GetIllustrationsParams): Promise<GetIllustrationsResult> {
  const { page = 1, pageSize = 20, category, keyword } = params;
  const offset = (page - 1) * pageSize;

  let whereClause = 'WHERE 1=1';
  const queryParams: (string | number)[] = [];

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
    `SELECT COUNT(*) as total FROM illustrations ${whereClause}`,
    queryParams
  );
  const total = countResult[0]?.total || 0;

  // 获取列表
  const rows = await query<IllustrationRow>(
    `SELECT * FROM illustrations ${whereClause} ORDER BY downloads DESC LIMIT ? OFFSET ?`,
    [...queryParams, pageSize, offset]
  );

  return {
    list: rows.map(rowToIllustration),
    total,
  };
}

export async function getIllustrationById(id: string): Promise<Illustration | null> {
  const rows = await query<IllustrationRow>(
    'SELECT * FROM illustrations WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rowToIllustration(rows[0]);
}

export async function createIllustration(data: Omit<Illustration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Illustration> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await execute(
    `INSERT INTO illustrations (id, name, category, tags, preview_url, file_url, author, likes, downloads, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.category,
      JSON.stringify(data.tags),
      data.previewUrl,
      data.fileUrl || null,
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

export async function updateIllustration(id: string, data: Partial<Illustration>): Promise<boolean> {
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
  if (data.tags !== undefined) {
    updates.push('tags = ?');
    values.push(JSON.stringify(data.tags));
  }
  if (data.previewUrl !== undefined) {
    updates.push('preview_url = ?');
    values.push(data.previewUrl);
  }
  if (data.fileUrl !== undefined) {
    updates.push('file_url = ?');
    values.push(data.fileUrl || null);
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
    `UPDATE illustrations SET ${updates.join(', ')} WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
}

export async function deleteIllustration(id: string): Promise<boolean> {
  const result = await execute(
    'DELETE FROM illustrations WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}

export async function incrementDownloads(id: string): Promise<void> {
  await execute(
    'UPDATE illustrations SET downloads = downloads + 1 WHERE id = ?',
    [id]
  );
}

export async function incrementLikes(id: string): Promise<void> {
  await execute(
    'UPDATE illustrations SET likes = likes + 1 WHERE id = ?',
    [id]
  );
}

export async function decrementLikes(id: string): Promise<void> {
  await execute(
    'UPDATE illustrations SET likes = GREATEST(likes - 1, 0) WHERE id = ?',
    [id]
  );
}
