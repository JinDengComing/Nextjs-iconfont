## typeorm

#### ReferenceError: Cannot access 'PortfolioProject' before initialization

实体类相互导入引用，导致 import 导入顺序问题？
使用 import type { Relation } from "typeorm" // 使用 import type 不会引起运行时的循环依赖

然后在引用的时候，使用 Relation 引用

```js

  import { SocialLink } from './SocialLink';

  @OneToMany(() => SocialLink, socialLink => socialLink.personalInfo, {
    cascade: true,
    eager: true
  })
  socialLinks: Relation<SocialLink>[]; // 使用 Relation 包装;


```

#### 又是一个 synchronize: true 引起的典型冲突。

这个错误 Duplicate foreign key constraint name 说明 MySQL 数据库中已经存在名为 FK_e89409c923138326fbd66cfa418 的外键约束，但 TypeORM 的同步逻辑认为它不存在（或者正在尝试重新创建它）。
这通常发生在：
重命名了实体类，但旧的外键约束还在。
手动修改过数据库，导致 TypeORM 的自动同步逻辑“迷路”了。
快速解决办法

```js
synchronize: true,
```

```sql
query failed: ALTER TABLE `social_links` ADD CONSTRAINT `FK_e89409c923138326fbd66cfa418` FOREIGN KEY (`personalInfoId`) REFERENCES `personal_info`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
error: Error: Duplicate foreign key constraint name 'FK_e89409c923138326fbd66cfa418'
```
