import type { IDescriptionItem, IDescriptionInfoItem } from './interface';
import { descriptionInfos as def_descInfos } from './config';
export const getDescriptionByName = (
  name: string,
  descriptionInfos?: IDescriptionInfoItem[]
): IDescriptionItem[] => {
  if (!descriptionInfos) {
    descriptionInfos = def_descInfos;
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
    descriptionInfos = def_descInfos;
  }
  descriptionInfos.forEach((item) => {
    if (item.type === type) {
      res=item.descriptions;
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
