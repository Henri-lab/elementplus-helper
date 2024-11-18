import type { IDescriptionItem, IDescriptionInfoItem } from './interface';
import { columnsPinyin as cfg_TA } from '@/components/Table/config/targetAnalyse';

export const descriptionInfos = [
  {
    type: '<tree>',
    name: 'sysTreeAddForm',
    descriptions: [
      {
        label: '目标体系树节点添加备注',
        field: 'notes',
        span: 12,
        type: 'textarea',
        placeholder: '请输入备注信息',
        style: { width: '100%', height: '100px', backgroundColor: '#f9f9f9' },
        data: '', // 初始值
        rules: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    ],
  },
  {
    type: '<tree>',
    name: 'singleTargetTreeAddForm',
    descriptions: [
      {
        label: '单目标名称',
        field: 'name',
        span: 24,
        type: 'input',
        placeholder: '请输入单目标名称',
        style: { width: '100%', height: '100px', backgroundColor: '#f9f9f9' },
        data: '', // 初始值
        rules: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    ],
  },
  {
    type: '<table>',
    name: 'targetAnalyseTableAddForm',
    descriptions: null,
    columns: await cfg_TA,
  },
];
