import { get,post,del,put } from '../../../utils/methods'


export function uploadFile(params) {
    return post("/common/upload", params);

}

  
  //导入目标
export function FileInfo(params) {
    // target/check/import
    return post(`/target/check/import?path=${params}`);
}


//target/tree/list  分页查询目标基本信息列表 
export function getTargetList(params) {
    return get(`/target/tree/list`,params ); 
 }
 //删除目标
 // /target/tree/remove
 export function removeTargetList(params) {
    return del(`/target/tree/remove?ids=${params}` ); 
 }