// OSS配置
import OSS from 'ali-oss';

// 创建OSS客户端实例
const ossClient = new OSS({
  region: 'oss-cn-guangzhou', // 你的OSS区域
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || 'your-access-key-id', // 你的AccessKeyId
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || 'your-access-key-secret', // 你的AccessKeySecret
  bucket: process.env.OSS_BUCKET || 'your-bucket-name', // 你的Bucket名称
});

export default ossClient;
