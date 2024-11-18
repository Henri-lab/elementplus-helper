import type { IDescriptionItem, IDescriptionInfoItem } from './interface';

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
      {
        label: '目标体系树节点添加备注2',
        field: 'notes2',
        span: 24,
        type: 'textarea',
        placeholder: '请输入备注信息',
        style: { width: '100%', height: '100px', backgroundColor: '#f9f9f9' },
        data: '', // 初始值
        rules: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    ],
  },
];
