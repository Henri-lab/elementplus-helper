import { get, post, del, put } from '../../../utils/methods'
//目录树接口
export function getTree(params) {
   return get('/target/tree/tree', params);
}
//目标详情
export function getDetail(id) {
   return get(`/target/tree/details?id=${id}`,);
}
//目标详情
// http://192.168.3.40:6020/target/tree/fileInfo?fileType=1

export function getFileInfo(params) {
   return get(`/target/tree/fileInfo`, params);
}

// 上传文件
export function FileInfo(params) {
   return post(`/target/info`, params);
}
//预测信息
export function getSelect(params) {
   return get(`system/dict/data/type/${params}`,);
}
//添加预测信息
// /target/check/forecast

export function addForecast(params) {
   return post('/target/check/forecast', params);
}
//预测信息关联文件列表
// http://192.168.3.40:6020/target/info/list?id=1
export function getFileTable(params) {
   return get(`/target/info/list?id=${params}`,);
}
///target/tree/list  分页查询目标基本信息列表 
export function getTargetList(params) {
   return get(`/target/tree/list`, params);
}
//删除目标
// /target/tree/remove
export function removeTargetList(params) {
   return del(`/target/tree/remove?ids=${params}`);
}
// /target/tree
// 新增基本信息
// http://192.168.3.40:6020/target/tree
export function addTarget(params) {
   return post('/target/tree', params);
}
export function changeTarget(params) {
   return put('/target/tree', params);
}
// /target/tree/details


// 目标中的类别
// http://192.168.3.40:6020/target/tree/type

export function getType(params) {
   return get(`/target/tree/type`, params);
}

// http://192.168.3.40:6020/target/tree/country

export function getCountry(params) {
   return get(`/target/tree/country`, params);
}

// NEED WTACH@hf 
// /target/tree/alias ??
export function getAlias(params) {
   return get(`/target/tree/alias`, params);
}


// 目标操作员接口


export function getUser(params) {
   return get(`/target/check/task-user`, params);
}
