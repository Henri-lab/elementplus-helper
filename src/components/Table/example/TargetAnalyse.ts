//@ts-ignore
import { createComponent as MyTableSuit } from '@openUI/OpenTable/creater';
import mockData from '@/mock/table_test';
import { columnsPinyin } from '@/components/Table/config/targetAnalyse';
const columns = columnsPinyin;
// console.log(columns,'pinyin');

export default MyTableSuit(
  () => [], // 数据源
  () => columns, // 列配置
  {
    customDialog: false,
    // customFormName: 'targetAnalyseTableAddForm',
    // customFormType: '<table>',
    onSubmit:(arg:any)=>{
      //请求后台
    }
  }
);
