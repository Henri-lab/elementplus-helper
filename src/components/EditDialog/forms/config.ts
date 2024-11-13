import $bus from '@/utils/bus';
export const des1 = [
  {
    label: '用户名',
    field: 'username',
    span: 12,
    type: 'input',
    placeholder: '请输入用户名',
    style: { width: '100%', height: '40px', backgroundColor: '#f0f0f0' },
    data: '', // 初始值
    rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  },
  {
    label: '性别',
    field: 'gender',
    span: 24,
    type: 'select',
    placeholder: '请选择性别',
    style: { width: '200px' },
    data: null, // 初始值
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' },
    ],
    rules: [{ required: true, message: '请选择性别', trigger: 'change' }],
  },
  {
    label: '爱好',
    field: 'hobbies',
    span: 24,
    type: 'checkbox',
    style: { margin: '10px 0', color: 'red' },
    data: [], // 初始值
    options: [
      { label: '阅读', value: 'reading' },
      { label: '旅行', value: 'traveling' },
      { label: '运动', value: 'sports' },
    ],
    rules: [
      { required: true, message: '请选择至少一个爱好', trigger: 'change' },
    ],
  },
];
export const open = (desc: any, name: any) => {
  console.log('open dialog with form to edit');
  $bus.emit('$:EditDialog:SlotForm:open', {
    description: desc,
    formName: name || 'test form',
  });
};
export const close = () => {
  console.log('close dialog with form to edit');
  $bus.emit('$:EditDialog:SlotForm:close');
};
