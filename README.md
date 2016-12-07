# studentsystem

##### 编译
  >1.环境nodejs+express+mysql

  >2.npm install mysql --save

  >3.npm start

##### 创建studentsystem数据库。
>1.创建stu数据表，包含字段
  >> id(主键自增) int(11)

  >> name varchar(16)

  >> major varchar(30)

  >> tel varchar(15)

  >> intention varchar(30)

  >> guide varchar(20)

  >> records text

  >> lasttime varchar(20)

  >> state tinyint(1)

 >2.创建worker数据表，包含字段

  >> id(主键自增) int(11)

  >>username varchar(20)

  >>password varchar(20)

  >>mark tinyint(4)
