import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('pub_roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    comment: '角色名称',
  })
  roleName: string;

  @Column({
    unique: true,
    comment: '角色编码',
  })
  roleCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.role)
  @JoinTable({
    name: 'pub_user_roles',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'roleId' },
  })
  users: User[];
}
