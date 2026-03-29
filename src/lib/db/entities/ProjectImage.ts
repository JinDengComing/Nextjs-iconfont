import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Relation } from "typeorm" // 使用 import type 不会引起运行时的循环依赖
import { PortfolioProject } from './PortfolioProject';

@Entity('project_images')
export class ProjectImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PortfolioProject, project => project.images)
  project: Relation<PortfolioProject>;

  @Column({ type: 'varchar', length: 500, nullable: false })
  url: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  alt: string;

  @Column({ type: 'int', default: 0 })
  order: number;
}
