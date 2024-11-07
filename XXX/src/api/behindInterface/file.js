import { get,post,del } from '../../utils/methods'
export function getInfoList(params) {
    return get(`/target/info/list`,params ); 
 }
//  删除文件
//  target/info/123
 export function removeFileList(params) {
    return del(`/target/info/${params}` ); 
 }
 //新增文件

 export function addFileInfo(params) {
    // target/check/import
    // return post(`/target/info?path=${params.path}&targetId=${params.targetId}`);
    return post(`/target/info`,params);
    
  }