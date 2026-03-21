-- 创建数据库
CREATE DATABASE IF NOT EXISTS iconfont CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE iconfont;

-- 图标表
CREATE TABLE IF NOT EXISTS icons (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  style ENUM('linear', 'filled', 'duotone', 'hand-drawn') NOT NULL DEFAULT 'linear',
  tags JSON,
  svg TEXT NOT NULL,
  author VARCHAR(100) NOT NULL DEFAULT 'iconfont官方',
  likes INT UNSIGNED NOT NULL DEFAULT 0,
  downloads INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_style (style),
  INDEX idx_likes (likes),
  INDEX idx_downloads (downloads),
  FULLTEXT INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插画表
CREATE TABLE IF NOT EXISTS illustrations (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags JSON,
  preview_url VARCHAR(500) NOT NULL,
  file_url VARCHAR(500),
  author VARCHAR(100) NOT NULL DEFAULT 'iconfont官方',
  likes INT UNSIGNED NOT NULL DEFAULT 0,
  downloads INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_likes (likes),
  INDEX idx_downloads (downloads),
  FULLTEXT INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI工具表
CREATE TABLE IF NOT EXISTS ai_tools (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  category ENUM('icon', 'image', 'video', 'text') NOT NULL,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户收藏图标表
CREATE TABLE IF NOT EXISTS user_favorite_icons (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  icon_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_icon (user_id, icon_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户收藏插画表
CREATE TABLE IF NOT EXISTS user_favorite_illustrations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  illustration_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_illustration (user_id, illustration_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (illustration_id) REFERENCES illustrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 项目图标关联表
CREATE TABLE IF NOT EXISTS project_icons (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  icon_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_project_icon (project_id, icon_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 项目插画关联表
CREATE TABLE IF NOT EXISTS project_illustrations (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL,
  illustration_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_project_illustration (project_id, illustration_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (illustration_id) REFERENCES illustrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例数据
INSERT INTO icons (id, name, category, style, tags, svg, author, likes, downloads) VALUES
('1', 'home', '基础图标', 'linear', '["home", "house", "building"]', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', 'iconfont官方', 374097, 500000),
('2', 'user', '基础图标', 'linear', '["user", "person", "avatar"]', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', 'iconfont官方', 351986, 450000),
('3', 'settings', '基础图标', 'linear', '["settings", "gear", "config"]', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', 'iconfont官方', 491589, 600000)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO illustrations (id, name, category, tags, preview_url, author, likes, downloads) VALUES
('1', '室内简约场景', '室内设计', '["室内", "简约", "生活"]', '/illustrations/room.jpg', '汀雪楼', 196665, 250000),
('2', '海滩日落', '自然风景', '["海滩", "日落", "大海"]', '/illustrations/beach.jpg', 'XIA夏夏夏', 35, 100),
('3', '清新拱门', '建筑', '["拱门", "海边", "清新"]', '/illustrations/arch.jpg', 'XIA夏夏夏', 35, 80)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO ai_tools (id, name, description, icon, category, is_new) VALUES
('1', 'AI生成图标', '一键生成精美图标', '🎨', 'icon', TRUE),
('2', '魔法卡片', '智能生成卡片设计', '🃏', 'image', TRUE),
('3', '智能抠图', '快速精准抠图', '✂️', 'image', TRUE),
('4', '尺寸魔方', '智能调整图片尺寸', '📐', 'image', TRUE),
('5', '高清放大', '无损放大图片', '🔍', 'image', TRUE),
('6', 'AI消除', '智能移除图片元素', '🧹', 'image', TRUE),
('7', 'AI替换', '智能替换图片元素', '🔄', 'image', TRUE),
('8', 'AI证件照', '智能生成证件照', '📷', 'image', TRUE),
('9', '商品图', 'AI生成商品图', '📦', 'image', TRUE),
('10', '服饰图', 'AI生成服饰图', '👔', 'image', TRUE),
('11', '智能试衣', '虚拟试穿效果', '👗', 'image', TRUE),
('12', '解说视频', 'AI生成视频解说', '🎬', 'video', TRUE),
('13', '标题文案', 'AI生成标题文案', '✍️', 'text', TRUE),
('14', '导购文案', 'AI生成导购文案', '🛒', 'text', TRUE)
ON DUPLICATE KEY UPDATE id=id;
