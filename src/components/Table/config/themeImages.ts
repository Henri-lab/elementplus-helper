import { getInitialsFromChinese } from '@/utils/format';

export const columns = [
  { label: '图片名称', prop: 'name', width: 200 },
  { label: '图片类型', prop: 'type', width: 150 },
  { label: '图片地址', prop: 'url', width: 150 },
  { label: '预览', prop: 'preview', width: 150 },
  { label: '描述', prop: 'desc' },
];
export async function convertPropsToInitials(columns: any[]) {
  const transformedColumns = await Promise.all(
    columns.map(async (col) => {
      const initials = await getInitialsFromChinese(col.label);
      return { ...col, prop: initials }; // 更新 prop 为拼音首字母
    })
  );
  return transformedColumns;
}

export let columnsPinyin = await convertPropsToInitials(columns);
