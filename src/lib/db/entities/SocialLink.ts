import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Relation } from "typeorm" // 使用 import type 不会引起运行时的循环依赖
import { PersonalInfo } from './PersonalInfo';

@Entity({ name: "social_links" })
export class SocialLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  platform!: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  url!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @ManyToOne(() => PersonalInfo, personalInfo => personalInfo.socialLinks)
  personalInfo!: Relation<PersonalInfo>; // 使用 Relation 包装{};
}
