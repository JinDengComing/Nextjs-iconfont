FROM node:20-alpine

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=8000

# 复制本地构建产物（standalone 模式）
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# 暴露端口
EXPOSE 8888

# 启动应用
CMD ["node", "server.js"]
