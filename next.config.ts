import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',//把依赖包也打进.next， 独立模式，不依赖 Node.js 运行环境，
};

export default nextConfig;
