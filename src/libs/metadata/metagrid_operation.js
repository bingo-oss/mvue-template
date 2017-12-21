/**
 * 提供grid内置的操作
 */

/**
 * 创建操作，跳转到新建表单页
 * @param context
 */
function createOperation(context){
  var metaEntity=context.metaEntity;
  var operation= {
    title:"新建",
    icon:"plus-round",
    onclick:function(){
      alert("not implement");
    }
  };
  return operation;
}




export default {

}



