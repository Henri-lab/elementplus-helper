import request from "@/utils/request";
// 获取任务列表
export const getTaskList = (params) => {
  return request({
    url: "/target/check/task-list",
    method: "get",
    params:params
  });
};
// 获取任务下拉列表
export const getTaskSet = () => {
  return request({
    url: "/target/check/task-set",
    method: "get",
  });
};
export const importTask = (params) => {
    return request({
      url: `/target/check/importTask?path=${params}`,
      method: "post",
    });
  };


//获取用户列表
export const userList = (params) => {
  return request({
    url: "/system/user/list",
    method: "get",
    params:params
  });
};

//指定目标分配 目录树
export  function getTree(params) {
  return request({
    url: "/target/tree/tree",
    method: "get",
    params:params
  });
}

//目录树 按指定范围分配

export  function getTreeArea(params) {
  return request({
    url: "/target/tree/area",
    method: "get",
    params:params
  });
}


export  function addTask(params) {
  return request({
    url: "target/check/task-add",
    method: "post",
    data:params
  });
}
// 领导
export  function taskass() {
  return request({
    url: "/target/check/task-ass",
    method: "get",
  });
}

// 获取书
export  function taskprogress(params) {
  return request({
    url: "/target/check/task-progress",
    method: "get",
    params:params
  });
}
// 提交更新

export const checkassess = (data) => {
  return request({
    url: "/target/check/assess",
    method: "post",
    data:data
  });
};
// 获取目标信息
export const getLogInfo = (params) => {
  return request({
    url: "/target/check/logInfo",
    method: "get",
    params:params
  });
};

// 删除任务
export const delTaskInfo = (params) => {
  return request({
    url:'/target/check/task-del?ids=' + params,
    method: "delete",
  });
};