export const def_treeData = [
  {
    id: 1,
    label: 'Node 1',
    children: [
      { id: 2, label: 'Node 1-1' },
      { id: 3, label: 'Node 1-2' },
      { id: 4, label: 'Node 1-3' },
    ],
  },
  {
    id: 5,
    label: 'Node 2',
    children: [
      { id: 6, label: 'Node 2-1' },
      { id: 7, label: 'Node 2-2' },
      { id: 8, label: 'Node 2-3' },
      { id: 9, label: 'Node 2-4' },
      { id: 10, label: 'Node 2-5' },
    ],
  },
  {
    id: 6,
    label: 'Node 3',
    children: [
      { id: 11, label: 'Node 3-1' },
      { id: 12, label: 'Node 3-2' },
      { id: 13, label: 'Node 3-3' },
      { id: 14, label: 'Node 3-4' },
    ],
  },
  {
    id: 7,
    label: 'Node 4',
    children: [
      { id: 15, label: 'Node 4-1' },
      { id: 16, label: 'Node 4-2' },
      { id: 17, label: 'Node 4-3' },
      { id: 18, label: 'Node 4-4' },
    ],
  },
];

export const def_menuItems = [
  //context-menu accepts 'action' which accepts 'node-infos'
  {
    label: '添加',
    action: ({ curNodeRef }: any) => {
      console.log('添加', curNodeRef.value);
    },
  },
  {
    label: '删除',
    action: () => {
      console.log('删除');
    },
  },
  {
    label: '编辑',
    action: () => {
      console.log('编辑');
    },
  },
  {
    label: '复制',
    action: () => {
      console.log('复制');
    },
  },
  {
    label: '粘贴',
    action: () => {
      console.log('粘贴');
    },
  },
  {
    label: '剪切',
    action: () => {
      console.log('剪切');
    },
  },
  {
    label: '刷新',
    action: () => {
      console.log('刷新');
    },
  },
  {
    label: '保存',
    action: () => {
      console.log('保存');
    },
  },
  {
    label: '取消',
    action: () => {
      console.log('取消');
    },
  },
  {
    label: '帮助',
    action: () => {
      console.log('帮助');
    },
  },
  {
    label: '更多',
    action: () => {
      console.log('更多');
    },
  },
];

