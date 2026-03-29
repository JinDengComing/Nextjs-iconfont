import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { ProjectImage } from './ProjectImage';

@Entity({ name: "portfolio_projects" })
export class PortfolioProject {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ type: 'text', nullable: false })
  content!: string; // Rich text content

  @Column({ type: 'varchar', length: 100, nullable: false })
  category!: string;

  @Column({ type: 'json' })
  tags!: string[];

  @Column({ type: 'varchar', length: 500, nullable: false })
  coverImage!: string;

  @OneToMany(() => ProjectImage, projectImage => projectImage.project, {
    cascade: true,
    eager: true
  })
  images!: Relation<ProjectImage>[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  demoUrl!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  sourceUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
