import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: "work_experience" })
export class WorkExperience {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  company!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  position!: string;

  @Column({ type: 'date', nullable: true })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ type: 'json' })
  skills!: string[];

  @Column({ type: 'int', default: 0 })
  order!: number;
}
