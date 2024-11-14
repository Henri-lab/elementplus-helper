import { createComponent } from '../creater';
import mockData from '@/mock/table_test';
import config from '@/components/Table/config/targetAnalyse';

export default createComponent(
  () => mockData('targetAnalyse'), // 示例表格数据获取函数
  //   () => '@/components/Table/config/targetAnalyse.ts', // 列配置路径获取函数
  () => config, // 列配置获取函数
  () => 10, // 初始每页条数
  () => 1 // 初始当前页
);
