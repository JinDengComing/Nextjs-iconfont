import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from "typeorm" // 使用 import type 不会引起运行时的循环依赖
import { SocialLink } from './SocialLink';

@Entity({ name: "personal_info" })
export class PersonalInfo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  bio!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  email!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  location!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website!: string;

  @OneToMany(() => SocialLink, socialLink => socialLink.personalInfo, {
    cascade: true,
    eager: true
  })
  socialLinks!: Relation<SocialLink>[]; // 使用 Relation 包装;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
