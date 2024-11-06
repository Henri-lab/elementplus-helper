// // 引入 mock.js
// import Mock from 'mockjs';

// // 使用 mock.js 生成数据
// const data = Mock.mock({
//   'items|100': [  // 生成 100 条记录
//     {
//       'name': '@cname',              // 随机生成中文姓名
//       'age|22-60': 1,                // 随机生成年龄 22 到 60 之间
//       'job|1': ['工程师', '设计师', '程序员', '产品经理', '测试工程师', '运维工程师'] // 随机选择一个职位
//     }
//   ]
// }).items;


import { faker } from '@faker-js/faker';

const data = Array.from({ length: 5 }).map(() => ({
  name: faker.person.fullName(), // 使用新的方法生成全名
  age: faker.number.int({ min: 22, max: 60 }), // 随机生成年龄
  job: faker.person.jobTitle() // 使用新的方法生成职位
}));


// console.log(data);
export default data;


export const targetBasicInfoData = Array.from({ length: 500 }).map(() => ({
  name: faker.location.country(), // 随机生成公司名称
  alias: faker.location.country(), // 随机生成公司别名
  diplomaticName: faker.word.adjective(), // 随机生成外交名称
  country: faker.location.country(), // 随机生成国家地区
  country2: faker.location.country(), // 随机生成国家地区
  type: faker.helpers.arrayElement(['军事', '政治', '文化', '商业', '医疗', '教育', '其他']) // 随机生成目标类型
}))

