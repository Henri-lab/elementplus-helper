import request from "@/utils/request";
// 获取历史记录
export const checkList = (params) => {
  return request({
    url: "/target/check/all-target",
    method: "get",
    params:params
  });
};
// 获取城市
export const getCountry = () => {
  return request({
    url: "/target/tree/country",
    method: "get",
  });
};
// 获取类别
export const getType = () => {
  return request({
    url: "/target/tree/type",
    method: "get",
  });
};
// 获取记录信息
export const getchecklog = (params) => {
  return request({
    url: "/target/check/check-log",
    method: "get",
    params: params,
  });
};
// 修改记录信息
export const taskEdit = (data) => {
  return request({
    url: "/target/check/task-edit",
    method: "put",
    data: data,
  });
};

// 查询设施和装备
export const dictType = (type) => {
  return request({
    url: "/system/dict/data/type/"+type,
    method: "get",
  });
};
// 导出结果
export const exportPdf = (id) => {
  return request({
    url: "/target/check/report?id="+id,
    method: "post",
  });
};
// 获取标汇信息
export const getDrawList = (params) => {
  return request({
    url: "/target/check/image",
    method: "get",
    params:params
  });
};
// 保存信息
export const savelabel = (data) => {
  return request({
    url: "/target/check/save-label",
    method: "post",
    data:data
  });
};
// 提交审核

export const addlabel = (data) => {
  return request({
    url: "/target/check/add-label",
    method: "post",
    data:data
  });
};

// 数据驳回
export const checkfail = (data) => {
  return request({
    url: "/target/check/fail",
    method: "post",
    data:data
  });
};
// 删除核查记录
export const delLog = (id) => {
  return request({
    url: '/target/check/log',
    method: "delete",
    params:id
  })
};

