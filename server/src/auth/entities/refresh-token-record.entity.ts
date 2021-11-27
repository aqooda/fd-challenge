import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class RefreshTokenRecord {
  @PrimaryColumn({ length: 32 })
  token: string;

  @Column()
  userId: string;

  @Column()
  expireAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
