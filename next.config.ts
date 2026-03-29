import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',//把依赖包也打进.next， 独立模式，不依赖 Node.js 运行环境，
  turbopack: {}, // 配置空的turbopack配置，消除错误

  experimental: {
    // 强制开启装饰器支持
    swcOptions: {
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
          dynamicImport: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true, // 👈 这一行代替了之前的插件
        },
      },
    },
  } as any,
  // 或者尝试最简单的方式：
  compiler: {
    styledComponents: true, // 如果你用了的话
  },
  
};

export default nextConfig;
