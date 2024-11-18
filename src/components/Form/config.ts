import type { IDescriptionItem, IDescriptionInfoItem } from './interface';
import { generateFormDescriptions } from './tool';
import { columns as cfg_TA } from '@/components/Table/config/targetAnalyse';



export const descriptionInfos = [
  {
    type: 'tree->dialog->form',
    name: 'sysTreeAddForm',
    descriptions: [
      {
        label: '目标体系树节点添加备注',
        field: 'notes',
        span: 24,
        type: 'textarea',
        placeholder: '请输入备注信息',
        style: { width: '100%', height: '100px', backgroundColor: '#f9f9f9' },
        data: '', // 初始值
        rules: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    ],
  },
  {
    type: 'tree->dialog->form',
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
    type: 'table->dialog->form',
    name: 'targetAnalyseTableAddForm',
    descriptions: () => generateFormDescriptions(cfg_TA),
  },
];
