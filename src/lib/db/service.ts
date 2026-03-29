import dataSource from './ormconfig';
import { PersonalInfo, SocialLink, WorkExperience, Education, PortfolioProject, ProjectImage } from './entities';

class DatabaseService {
  private initialized = false;

  constructor() {
    // 在构造函数中初始化数据库连接
    this.initialize();
  }

  async initialize() {
    if (!this.initialized && !dataSource?.isInitialized) {
      try {
        await (dataSource.initialize)();
        console.log('数据库连接成功！');
        this.initialized = true;
      } catch (error) {
        console.error('数据库连接失败:', error);
        // 不要抛出错误，避免应用启动失败
      }
    }
  }

  // Personal info methods
  async getPersonalInfo() {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }

    // 调试：打印当前 DataSource 已知的所有实体
    const registeredEntities = dataSource.entityMetadatas.map(m => m.name);
    console.log("📦 Registered entities:", registeredEntities);


    const repo = dataSource.getRepository<PersonalInfo>("PersonalInfo");
    return repo.find({ relations: ['socialLinks'] });
  }

  async createPersonalInfo(info: Partial<PersonalInfo>) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(PersonalInfo);
    const personalInfo = repo.create(info);
    return repo.save(personalInfo);
  }

  // Work experience methods
  async getWorkExperience() {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(WorkExperience);
    return repo.find({ order: { order: 'ASC' } });
  }

  async createWorkExperience(experience: Partial<WorkExperience>) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(WorkExperience);
    const workExperience = repo.create(experience);
    return repo.save(workExperience);
  }

  // Education methods
  async getEducation() {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(Education);
    return repo.find({ order: { order: 'ASC' } });
  }

  async createEducation(education: Partial<Education>) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(Education);
    const edu = repo.create(education);
    return repo.save(edu);
  }

  // Portfolio methods
  async getPortfolioProjects(page: number = 1, pageSize: number = 10) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(PortfolioProject);
    const [projects, total] = await repo.findAndCount({
      relations: ['images'],
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: { createdAt: 'DESC' },
    });
    return { projects, total };
  }

  async getPortfolioProjectById(id: string) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(PortfolioProject);
    return repo.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async createPortfolioProject(project: Partial<PortfolioProject>) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(PortfolioProject);
    const newProject = repo.create(project);
    return repo.save(newProject);
  }

  async updatePortfolioProject(id: string, project: Partial<PortfolioProject>) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(PortfolioProject);
    await repo.update(id, project);
    return repo.findOne({
      where: { id },
      relations: ['images'],
    });
  }

  async deletePortfolioProject(id: string) {
    // 确保数据库连接已初始化
    if (!this.initialized) {
      await this.initialize();
    }
    const repo = dataSource.getRepository(PortfolioProject);
    return repo.delete(id);
  }
}

// 创建并导出数据库服务实例
export default new DatabaseService();
