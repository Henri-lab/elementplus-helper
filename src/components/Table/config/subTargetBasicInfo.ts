import { getInitialsFromChinese } from '@/utils/format';
export const columns = [
  { label: '子目标名称', prop: 'name', width: 80 },
  { label: '所属目标', prop: 'affi', width: 80 },
  { label: '子目标类别', prop: 'type', width: 80 },
  { label: '一级分类', prop: 'class1', width: 80 },
  { label: '二级分类', prop: 'class2', width: 80 },
  { label: '三级分类', prop: 'class3', width: 80 },
  { label: '经度', prop: 'lon', width: 80 },
  { label: '纬度', prop: 'lat', width: 80 },
  { label: '大地高(米)', prop: 'height', width: 80 },
  { label: '海拔(米)', prop: 'alt', width: 80 },
  { label: '说明', prop: 'desc', width: 160 },
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

export let columnsPinyin =await convertPropsToInitials(columns);
