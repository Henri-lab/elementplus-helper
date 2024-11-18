import type { IDescriptionItem, IDescriptionInfoItem } from './interface';
import { descriptionInfos as def_descInfos } from './config';
export const getDescriptionByName = (
  name: string,
  descriptionInfos?: IDescriptionInfoItem[]
): IDescriptionItem[] => {
  if (!descriptionInfos) {
    descriptionInfos = def_descInfos as IDescriptionInfoItem[];
  }
  const res = descriptionInfos.find((item) => item.name === name);
  if (res) {
    return res.descriptions;
  }
  return [];
};

export const getDescriptionByType = (
  type: string,
  descriptionInfos?: IDescriptionInfoItem[]
): Array<IDescriptionItem> | [] => {
  let res: Array<IDescriptionItem> = [];
  if (!descriptionInfos) {
    descriptionInfos = def_descInfos as IDescriptionInfoItem[];
  }
  descriptionInfos.forEach((item) => {
    if (item.type === type) {
      res = item.descriptions;
      return;
    }
  });
  return res;
};

export const getDescriptionFields = (descriptionItems: IDescriptionItem[]) => {
  const res: Array<string> = [];
  descriptionItems.forEach((descItem) => {
    res.push(descItem.field);
  });
  return res;
};

export const generateFormDescriptions = (columns: any[]) => {
  return columns.map((col) => ({
    label: col.label,
    field: col.prop,
    span: 24,
    type: 'input', 
    placeholder: `请输入${col.label}`,
    style: { width: '100%', height: '100px', backgroundColor: '#f9f9f9' },
    data: '', 
    rules: [
      { required: true, message: `${col.label}不能为空`, trigger: 'blur' },
    ],
  }));
};
