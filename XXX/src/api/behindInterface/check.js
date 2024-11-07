import { get, post,put ,del} from "../../utils/methods";
//任务列表
export function getTaskTree(params) {
  return get("/target/check/task-list", params);
}








//目录树列表
export function getTree(params) {
  return get("/target/check/check-list", params);
}

//目录树 按指定范围分配
export function getTreeArea() {
  return get("/target/tree/area");
}

export function getCheckTree(params) {
  return get("/target/check/check-list", params);
}
// http://192.168.3.40:6020/target/check/check-list
export function uploadFile(params) {
  return post("/common/upload", params);
}

// /target/check/importTask
// 导入文件
export function importTaskFile(params) {
  return post(`/target/check/importTask?path=${params}`);
}
//获取用户列表
export function userList(params) {
  return get(`/system/user/list`, params);
}
//新增核查任务
// /target/check/task-add

export function addTask(params) {
  return post(`target/check/task-add`, params);
}

//查询核查选中的目标列表
export function getBackLog(params) {
  return get(`target/check/backlog`, params);
}

// 进度检测查询树列表
export function getTaskProgressTree(params) {
  return get(`target/check/task-progress?taskId=${params}`);
}

//进度监测 目标详情
export function getTaskLog(params) {
  return get(`target/check/log`, params);
}

//核查记录     目录详情
export function getHCTaskLog(params) {
  return get(`target/check/check-log`, params);
}

//导入目标
export function FileInfo(params) {
  // target/check/import
  return post(`/target/check/import?path=${params}`);
}
//发展变化图
export function getChange(params) {
  return get(`target/check/change`, params);
}
export function getTasklist(params) {
  return get(`/target/info/list`, params);
}
export function coordinate(params) {
  return get(`/target/check/coordinate`, params);
}
export function addlabel(params) {
  return post(`/target/check/add-label`, params);
}

//保存核查记录信息
export function savelabel(params) {
  return post(`/target/check/save-label`, params);
}

//核查记录，查看影像以及标注信息
export function getTaskLogImage(params) {
  return get(`/target/check/image`, params);
}

export function getNewest(params) {
  return get(`/target/check/newest`, params);
}
// http://192.168.3.40:6020/target/check/logInfo?id=3
export function getLoginInfo(params) {
  console.log(params.id)
  return get(`/target/check/logInfo?id=${params.id}`);
}
export function reportInfo(params) {
  return post(`/target/check/report?id=${params}`);
}
//审核通过
//http://192.168.3.40:6020/target/check/success?logId
export function success(params) {
  return post(`/target/check/success?logId=${params}`);
}

//审核驳回
// http://192.168.3.40:6020/target/check/fail?logId=23
export function fail(params) {
  return post(`/target/check/fail?logId=${params}`);
}
//  http://192.168.3.40:6020/target/check/assess
export function assess(params) {
  return post(`/target/check/assess`, params);
}


//按人员展示所有目标

export function getAllTarget() {
  return get(`/target/check/all-target`);
}



//修改任务
export function editWork(params){
  return put("/target/check/task-edit",params)
}



//删除任务列表里面的任务
export function workDel(id){
  return del(`/target/check/task-del?ids=${id}`)
}





