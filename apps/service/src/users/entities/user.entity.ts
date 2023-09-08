import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { EntityHelper } from '../../utils/entity-helper';
import moment from 'moment';

@Entity('pub_user')
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    comment: '用户名',
  })
  username: string;

  @Column({
    comment: '密码',
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    unique: true,
    nullable: true,
    comment: '邮箱',
  })
  email: string;

  @Column({
    unique: true,
    nullable: true,
    comment: '手机号',
  })
  phone: string;

  @Column({
    nullable: true,
    comment: '头像',
  })
  avatar: string;

  @Column({
    unique: true,
    nullable: true,
    comment: '昵称',
  })
  nickname: string;

  @Column({
    comment: '性别',
    nullable: true,
  })
  genders: string;

  @Column({
    comment: '生日',
    nullable: true,
  })
  birthday: Date;

  @Column({
    default: 0,
  })
  @Exclude({ toPlainOnly: true })
  delFlag: number;

  @CreateDateColumn({
    transformer: {
      to(value: any): any {
        return value;
      },
      from(value: any): any {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  })
  createdAt: Date;

  @UpdateDateColumn({
    transformer: {
      to(value: any): any {
        return value;
      },
      from(value: any): any {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
