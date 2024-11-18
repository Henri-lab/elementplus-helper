import { getInitialsFromChinese } from '@/utils/format';

export const columns = [
  { label: '体系名称', prop: 'sysName', width: 200 },
  { label: '目标名称', prop: 'name', width: 150 },
  { label: '目标类型', prop: 'type', width: 150 },
  { label: '市区人口', prop: 'population', width: 150 },
  { label: '市区人口密度', prop: 'density', width: 250 },
  { label: '子目标名称', prop: 'subName', width: 150 },
  { label: '子目标类型', prop: 'subtype' },
];


// 将 columns 的 prop 转换为拼音首字母
export async function convertPropsToInitials(columns: any[]) {
  const transformedColumns = await Promise.all(
    columns.map(async (col) => {
      const initials = await getInitialsFromChinese(col.label);
      return { ...col, prop: initials }; // 更新 prop 为拼音首字母
    })
  );
  return transformedColumns;
}

export let columnsPinyin = convertPropsToInitials(columns);
