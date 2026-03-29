import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  institution: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  degree: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  field: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', default: 0 })
  order: number;
}
