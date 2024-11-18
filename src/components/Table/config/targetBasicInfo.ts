import { getInitialsFromChinese } from "@/utils/format";

export const columns = [
    { label: '目标名称', prop: 'name', width: 200 },
    { label: '目标别名', prop: 'alias', width: 150 },
    { label: '外交名称', prop: 'diplomaticName', width: 150 },
    { label: '国家地区(?)', prop: 'country', width: 150 },
    { label: '国家地区(实际)', prop: 'country2', width: 150 },
    { label: '目标类型', prop: 'type', width: 150 },
]



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