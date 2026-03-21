# Docker 部署指南

## 项目结构

```
.
├── Dockerfile              # Next.js 应用镜像配置
├── docker-compose.yml      # 服务编排配置
├── nginx.conf             # Nginx 反向代理配置
├── .dockerignore          # Docker 构建忽略文件
├── .next/                 # 本地构建产物（需要上传）
│   ├── standalone/        # 独立运行时（包含所有依赖）
│   └── static/            # 静态资源
└── src/
    └── lib/
        └── db/
            └── schema.sql  # 数据库初始化脚本
```

## 服务组成

| 服务 | 端口 | 说明 |
|------|------|------|
| app | 3000 | Next.js 应用 |
| mysql | 3306 | MySQL 数据库 |
| redis | 6379 | Redis 缓存 |
| nginx | 80/443 | 反向代理 |

## 部署步骤

### 1. 本地构建应用

在本地机器上执行：

```bash
# 安装依赖
npm install

# 构建生产版本（standalone 模式）
npm run build

# 构建完成后会生成 .next 目录，包含 standalone 子目录
```

### 2. 准备部署文件

需要上传到服务器的文件：

```bash
# 必须上传的文件
- Dockerfile
- docker-compose.yml
- nginx.conf
- .next/standalone/   # 独立运行时（包含所有依赖，重要！）
- .next/static/       # 静态资源
- public/             # 静态资源目录
- src/lib/db/schema.sql  # 数据库初始化脚本

# 可选上传
- .dockerignore
```

### 3. 上传到服务器

```bash
# 方式1：使用 scp 上传整个项目
scp -r nextjs-example user@server:/path/to/deploy

# 方式2：只上传必要文件（推荐）
cd nextjs-example
tar -czf deploy.tar.gz \
  Dockerfile docker-compose.yml nginx.conf \
  .next/standalone .next/static public \
  src/lib/db/schema.sql

scp deploy.tar.gz user@server:/path/to/deploy

# 在服务器上解压
ssh user@server
cd /path/to/deploy
tar -xzf deploy.tar.gz
```

### 4. 配置环境变量

在服务器上创建 `.env` 文件：

```bash
cd /path/to/deploy/nextjs-example

# 创建 .env 文件
cat > .env << EOF
# 数据库配置
DB_PASSWORD=your_secure_password
DB_NAME=iconfont

# Redis配置
REDIS_PASSWORD=your_redis_password

# JWT配置
JWT_SECRET=your_jwt_secret_key_min_32_chars

# API配置
NEXT_PUBLIC_API_BASE_URL=http://localhost/api
EOF
```

### 5. 启动服务

```bash
# 启动所有服务（不需要 --build，因为已经本地构建好了）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看应用日志
docker-compose logs -f app
```

### 6. 访问应用

- 网站：http://localhost 或 http://服务器IP
- API：http://localhost/api

## 常用命令

```bash
# 停止服务
docker-compose down

# 停止并删除数据卷（谨慎使用）
docker-compose down -v

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f [服务名]

# 进入容器
docker-compose exec app sh
docker-compose exec mysql bash
docker-compose exec redis sh

# 更新部署（需要重新本地构建）
# 1. 本地重新构建
npm run build

# 2. 重新上传 .next 目录
tar -czf next.tar.gz .next
scp next.tar.gz user@server:/path/to/deploy/nextjs-example

# 3. 在服务器上解压并重启
ssh user@server
cd /path/to/deploy/nextjs-example
tar -xzf next.tar.gz
docker-compose restart app
```

## 更新部署流程

### 方式1：完整更新（推荐）

```bash
# 本地操作
npm install
npm run build

# 打包上传
tar -czf deploy.tar.gz \
  Dockerfile docker-compose.yml nginx.conf \
  .next/standalone .next/static public \
  src/lib/db/schema.sql

scp deploy.tar.gz user@server:/path/to/deploy

# 服务器操作
ssh user@server
cd /path/to/deploy
rm -rf nextjs-example
mkdir nextjs-example
cd nextjs-example
tar -xzf ../deploy.tar.gz
docker-compose down
docker-compose up -d
```

### 方式2：增量更新（只更新 .next）

```bash
# 本地操作
npm run build

# 只上传构建产物
tar -czf next.tar.gz .next
scp next.tar.gz user@server:/path/to/deploy/nextjs-example

# 服务器操作
ssh user@server
cd /path/to/deploy/nextjs-example
tar -xzf next.tar.gz
docker-compose restart app
```

## Standalone 模式说明

### 什么是 Standalone 模式？

Standalone 模式会生成一个自包含的输出，包含：

- ✅ 所有必要的运行时依赖（node_modules）
- ✅ 编译后的代码
- ✅ 一个独立的 server.js 文件

### 优势

1. **不需要在服务器上安装依赖**：所有依赖都已打包
2. **镜像更小**：只包含运行时需要的文件
3. **部署更快**：直接复制文件即可，无需 npm install
4. **更安全**：减少构建时的网络请求

### 配置

在 `next.config.ts` 中启用：

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

构建后会生成：

```
.next/
├── standalone/       # 包含所有依赖和 server.js
└── static/          # 静态资源
```

## 生产环境优化

### 1. 配置 HTTPS

将 SSL 证书放入 `ssl` 目录：

```
ssl/
├── fullchain.pem
└── privkey.pem
```

修改 `nginx.conf` 添加 HTTPS 配置：

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # ... 其他配置
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 2. 环境变量配置

生产环境建议：

```bash
# 使用 Docker Secrets 或环境变量文件
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. 数据备份

```bash
# 备份 MySQL 数据
docker-compose exec mysql mysqldump -u root -p iconfont > backup.sql

# 备份 Redis 数据
docker-compose exec redis redis-cli SAVE
docker cp nextjs-redis:/data/dump.rdb ./redis-backup.rdb
```

### 4. 监控和日志

```bash
# 查看资源使用
docker stats

# 查看日志
docker-compose logs -f --tail=100

# 清理日志
docker system prune -f
```

## 故障排查

### 1. 容器无法启动

```bash
# 查看详细日志
docker-compose logs app

# 检查端口占用
netstat -tlnp | grep 3000

# 检查 .next 目录是否存在
ls -la .next
ls -la .next/standalone
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 状态
docker-compose exec mysql mysql -u root -p -e "SHOW DATABASES;"

# 检查网络连接
docker-compose exec app ping mysql
```

### 3. 性能优化

```bash
# 查看容器资源使用
docker stats

# 调整容器资源限制（docker-compose.yml）
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## 安全建议

1. **修改默认密码**：务必修改所有服务的默认密码
2. **限制端口暴露**：生产环境只暴露 80/443 端口
3. **定期更新**：定期更新 Docker 镜像和基础镜像
4. **防火墙配置**：配置服务器防火墙，只允许必要端口
5. **日志审计**：定期检查访问日志和错误日志

## 注意事项

- **必须先在本地执行 `npm run build`**，确保 `.next/standalone` 目录存在
- 上传时必须包含 `.next/standalone` 目录，否则应用无法运行
- 使用 standalone 模式后，**服务器上不需要执行 npm install**
- 服务器上不需要安装 Node.js，只需要 Docker 和 Docker Compose
- 更新代码时，建议在本地重新构建后再上传 `.next` 目录
