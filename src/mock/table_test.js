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

const data = Array.from({ length: 5 }).map(() => {
  console.log('%cMock Data of tableData generated', 'color: greenyellow;background-color:gray;')
  return {
    name: faker.person.fullName(), // 使用新的方法生成全名
    age: faker.number.int({ min: 22, max: 60 }), // 随机生成年龄
    job: faker.person.jobTitle() // 使用新的方法生成职位
  }
});

export const targetBasicInfoData = Array.from({ length: 50 }).map(() => {
  console.log('%cMock Data of table targetBasicInfo generated', 'color: greenyellow;background-color:gray;')
  return {
    name: faker.location.country(), // 随机生成公司名称
    alias: faker.location.country(), // 随机生成公司别名
    diplomaticName: faker.word.adjective(), // 随机生成外交名称
    country: faker.location.country(), // 随机生成国家地区
    country2: faker.location.country(), // 随机生成国家地区
    type: faker.helpers.arrayElement(['军事', '政治', '文化', '商业', '医疗', '教育', '其他']) // 随机生成目标类型
  }
})

export const subTargetMaintainData = Array.from(Array.from({ length: 50 })).map(() => {
  console.log('%cMock Data of table subTargetMaintain generated', 'color: greenyellow;background-color:gray;')
  return {
    name: faker.lorem.word(5), // 随机生成子目标名称
    affi: faker.lorem.word(5), // 随机生成所属目标
    type: faker.lorem.word(2), // 随机生成子目标类别
    class1: faker.lorem.word(2), // 随机生成一级分类
    class2: faker.lorem.word(2), // 随机生成二级分类
    class3: faker.lorem.word(2), // 随机生成三级分类
    lon: faker.location.longitude(), // 随机生成经度
    lat: faker.location.latitude(), // 随机生成纬度
    height: faker.number.int({ min: 1000, max: 10000 }), // 随机生成大地高
    alt: faker.number.int({ min: 100, max: 1000 }), // 随机生成海拔
    desc: faker.lorem.sentence(50) // 随机生成说明 
  }
})

export const themeImagesData = Array.from({ length: 50 }).map(() => {
  console.log('%cMock Data of table themeImages generated', 'color: greenyellow;background-color:gray;')
  return {
    name: faker.lorem.word(5),
    url: faker.lorem.word(5),
    type: faker.lorem.word(2),
    preview: faker.lorem.word(3),
    desc: faker.lorem.sentence(50)
  }
})


export const targetAnalyseData = Array.from({ length: 50 }).map(() => {
  console.log('%cMock Data of table targetAnalyse generated', 'color: greenyellow;background-color:gray;')
  return {
    sysName: faker.company.name(), // 假的公司/体系名称
    name: faker.company.name(), // 假的目标名称
    type: faker.helpers.arrayElement(['商业', '住宅', '工业', '政府']), // 目标类型
    population: faker.number.float({ min: 100000, max: 1000000 }), // 人口数
    density: faker.number.float({ min: 500, max: 5000 }), // 人口密度
    subName: faker.company.catchPhrase(), // 假的子目标名称
    subtype: faker.helpers.arrayElement(['服务', '教育', '医疗', '文化']), // 子目标类型
  }
})


export default function mockData(type) {
  if (type == 'targetAnalyse') {
    return targetAnalyseData
  } else if (type == 'themeImages') {
    return themeImagesData
  } else if (type == 'subTargetMaintain') {
    return subTargetMaintainData
  } else if (type == 'targetBasicInfo') {
    return targetBasicInfoData
  } else {
    return data
  }
}