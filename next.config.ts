import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',//把依赖包也打进.next， 独立模式，不依赖 Node.js 运行环境，
  turbopack: {}, // 配置空的turbopack配置，消除错误
  // 将 ali-oss 标记为外部模块，不参与打包
  serverExternalPackages: ['ali-oss'],

  compiler: {
    styledComponents: true, // 如果你用了的话
  },

  //解决类名混淆导致的 Metadata 丢失 ，生产环境中实体类被压缩混淆
  webpack: (config) => {
    config.optimization.minimizer.forEach((minimizer: any) => {
      if (minimizer.options && minimizer.options.terserOptions) {
        minimizer.options.terserOptions.keep_classnames = true; // 关键：保留类名
        minimizer.options.terserOptions.keep_fnames = true;
      }
    });
    return config;
  },
};

export default nextConfig;
