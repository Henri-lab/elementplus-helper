import { get, post,put ,del} from "@/utils/methods";


//目标详情核查首页目录树列表
export function getMbTree() {
    return get("/target/tree/tree");
}


//目标详情接口
export  function getDetail(id) {
    return get(`/target/tree/details?id=${id}`); 
}

//目标详情文件信息展示
export  function getFileInfo(params) {
    return get(`/target/tree/fileInfo`, params); 
 }

//进度监测 目标详情
export function getTaskLog(params) {
    return get(`target/check/log`, params);
}


//装备部署情况 折线图数据
export function getFacility(params) {
    return get(`/target/check/facility`, params);
}
//发展变化图
export function getChange(params) {
    return get(`target/check/change`, params);
}

//上传文件接口
export function uploadFile(params) {
    return post("/common/upload", params);
}


  //预测信息
export function getSelect(params) {
    return get(`system/dict/data/type/${params}`, ); 
}
//新增预测信息接口
export function addForecast(params) {
    return post('/target/check/forecast',params ); 
}

export function getFileTable(params) {
    return get(`/target/info/list?id=${params}`); 
}
// 上传文件
export  function FileInfo(params) {
    return post(`/target/info`, params); 
 }


 //历史变化列表接口
 export  function historyData(params) {
    return get(`/target/check/fixed`, params); 
 }


 //获取所有设施的点位

export  function getFacilityPoint(params) {
    return get(`/target/check/point`, params); 
}
//影像数据
export function getTasklist(params) {
    return get(`/target/info/list`, params);
  }

  export function coordinate(params) {
    return get(`/target/check/coordinate`, params);
  }