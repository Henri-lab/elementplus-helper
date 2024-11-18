import { createComponent } from '../creater';
import mockData from '@/mock/table_test';
import { columns } from '@/components/Table/config/targetAnalyse';

export default createComponent(
  () => mockData('targetAnalyse'), // 示例表格数据获取函数
  () => columns, // 列配置获取函数
  //@ts-ignore
  {
    customDialog: false,
  }
);
