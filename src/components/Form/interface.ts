export interface IDescriptionItem {
  label: string;
  field: string;
  span: number;
  type: string;
  placeholder?: string;
  style?: Record<string, string>;
  data?: any;
  rules?: Array<any>;
  options?: Array<any>;
}

export interface IDescriptionInfoItem {
  type?: string;
  name?: string;
  descriptions: IDescriptionItem[];
  columns?: any; // 表格列配置
}
