export const def_description = [
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
    label: '邮箱',
    field: 'email',
    span: 12,
    type: 'input',
    placeholder: '请输入邮箱地址',
    style: { width: '100%', height: '40px', color: 'blue' },
    data: '', // 初始值
    rules: [
      { required: true, message: '邮箱不能为空', trigger: 'blur' },
      { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
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
  {
    label: '个人简介',
    field: 'bio',
    span: 24,
    type: 'textarea',
    placeholder: '请输入个人简介',
    style: { width: '100%', height: '100px', backgroundColor: '#f9f9f9' },
    data: '', // 初始值
    rules: [{ required: true, message: '个人简介不能为空', trigger: 'blur' }],
  },
  {
    label: '生日',
    field: 'birthdate',
    span: 12,
    type: 'date-picker',
    placeholder: '请选择生日',
    style: { width: '200px' },
    data: '', // 初始值
    rules: [{ required: true, message: '请选择生日', trigger: 'change' }],
  },
  {
    label: '城市',
    field: 'city',
    span: 12,
    type: 'select',
    placeholder: '请选择城市',
    style: { width: '100%' },
    data: null, // 初始值
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' },
      { label: '深圳', value: 'shenzhen' },
    ],
  },
];


