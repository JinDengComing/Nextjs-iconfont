import "reflect-metadata";
import { DataSource } from 'typeorm';

// 静态导入实体类
import { PersonalInfo } from './entities/PersonalInfo';
import { SocialLink } from './entities/SocialLink';
import { WorkExperience } from './entities/WorkExperience';
import { Education } from './entities/Education';
import { PortfolioProject } from './entities/PortfolioProject';
import { ProjectImage } from './entities/ProjectImage';

// 防止开发环境下重复创建连接
const globalForData = global as unknown as { dataSource: DataSource };

console.log('检测是否原本就存在数据库连接是实例：-----', globalForData?.dataSource)

const dataSource = globalForData?.dataSource || new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'portfolio',
  // 强制驱动使用更稳健的方式
  connectorPackage: "mysql2",
  extra: {
    connectionLimit: 10,
    // 某些旧版 MySQL 插件需要明确指定
    authProtocol: 'mysql_native_password'
  },
  entities: [
    PersonalInfo,
    SocialLink,
    WorkExperience,
    Education,
    PortfolioProject,
    ProjectImage,

  ],
  migrations: [],
  // synchronize: true, // 开发环境使用，生产环境应该关闭
  logging: true, // 开启日志以便调试
});

console.log('正在尝试连接数据库......');
if (process.env.NODE_ENV !== "production") globalForData.dataSource = dataSource;


export default dataSource;
