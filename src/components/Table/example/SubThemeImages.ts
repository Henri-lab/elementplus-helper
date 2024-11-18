//@ts-ignore
import { createComponent as MyTableSuit } from '@openUI/OpenTable/creater';
import { columnsPinyin } from '@/components/Table/config/themeImages';
const columns = columnsPinyin;
// console.log(columns,'pinyin');

export default MyTableSuit(
  () => [], // 数据源
  () => columns, // 列配置
  {
    customDialog: false,
    // customFormName: 'subThemeImagesTableAddForm',
    // customFormType: '<table>',
    customButtons: [
      {
        label: '关联图片',
        onClick: (row: any) => {
          console.log('关联图片', row);
        },
      },
      {
        label: '关联子目标',
        onClick: (row: any) => {
          console.log('导出', row);
        },
      },
    ],
    onSubmit: (arg: any) => {
      //请求后台
    },
  }
);
