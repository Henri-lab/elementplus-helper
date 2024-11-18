//@ts-ignore
import { createComponent as MyTableSuit } from '@openUI/OpenTable/creater';
import { columnsPinyin } from '@/components/Table/config/targetBasicInfo';
const columns = columnsPinyin;
// console.log(columns,'pinyin');

export default MyTableSuit(
  () => [], // 数据源
  () => columns, // 列配置
  {
    customDialog: false, //
    // customFormName: 'targetAnalyseTableAddForm',
    // customFormType: '<table>',
    innerFormTemplate:{},
    onSubmit:(arg:any)=>{
      console.log('new row', arg.formData);
      //请求后台
    }
  }
);
