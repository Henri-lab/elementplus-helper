import { get,post,del ,put} from '../../../utils/methods'
export function getTreeList(params) {
    return get(`/target/tree/tree`,params ); 
 }
 export function removeTargetList(params) {
    return del(`/target/tree/del?ids=${params}` ); 
 }
 //新增目录树
//  /target/tree/add
export function addTreeList(params) {
    return post(`/target/tree/add`,params ); 
 }
 export function changeTreeList(params) {
   return put(`/target/tree/update`,params ); 
}
//  /target/tree/details

export function getDetailsList(params) {
    return get(`/target/tree/details?id=${params}` ); 
 }