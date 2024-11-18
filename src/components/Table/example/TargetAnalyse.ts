//@ts-ignore
import { createComponent as MyTable } from '@openUI/OpenTable/creater';
import mockData from '@/mock/table_test';
import { columnsPinyin } from '@/components/Table/config/targetAnalyse';
const columns = await columnsPinyin;
// console.log(columns,'pinyin');

export default MyTable(
  () => [], // 示例表格数据获取函数
  //   () => '@/components/Table/config/targetAnalyse.ts', // 列配置路径获取函数
  () => columns, // 列配置获取函数
  {
    customDialog: true,
    customFormName: 'targetAnalyseTableAddForm',
    customFormType: '<table>',
  }
);
