/**
 * 提供grid内置的操作
 */

/**
 * 创建操作，跳转到新建表单页
 * @param context
 */
function operationForCreate(context){
  var path=context.grid.formPath;
  if(_.isEmpty(path) && !_.isEmpty(context.metaEntity)){
    path=context.metaEntity.formPathForCreate();
  }
  var operation= {
    title:"新建",
    icon:"plus-round",
    onclick:function(params){
      if(_.isEmpty(path)){
        alert("not implement,please set formPath");
        return ;
      }

      if(path.indexOf('/')>-1){
        router.push({path:path});
      }else{
        router.push({name:path,params:{entityName:context.metaEntity.name}});
      }
    }
  };
  return operation;
}

/**
 * 创建操作，跳转到新建表单页
 * @param context
 */
function operationForEdit(context){
  var path=context.grid.formPath;
  if(_.isEmpty(path) && !_.isEmpty(context.metaEntity)){
    path=context.metaEntity.formPathForEdit();
  }
  //计算id字段
  var idFields=[];
  if( !_.isEmpty(context.metaEntity)){
    var idFields=context.metaEntity.getIdFields();
  }
  var operation= {
    title:"修改",
    icon:"edit",
    onclick:function(params){
      var clickContext=this;
      if(_.isEmpty(path)){
        alert("not implement,please set formPath");
        return ;
      }
      if(_.isEmpty(idFields)){
        alert("entity:"+clickContext.metaEntity.name+" not set identity field");
        return;
      }
      var id=params.row[idFields[0].name];
      var queryParams={
        id:id
      };
      if(path.indexOf('/')>0){
        router.push({path:path,query:queryParams});
      }else{
        router.push({name:path,query:queryParams});
      }
    }
  };
  return operation;
}
function operationForDel(context) {
  var resource=context.grid.queryResource;
  if(_.isEmpty(resource) &&  !_.isEmpty(context.metaEntity)){
    resource=context.metaEntity.dataResource();
  }
  //计算id字段
  var idFields=[];
  if( !_.isEmpty(context.metaEntity)){
    var idFields=context.metaEntity.getIdFields();
  }

  var operation= {
    title:"删除",
    icon:"trash-a",
    onclick:function(params){
      if(_.isEmpty(resource)){
        alert("can't find delete action path");
        return;
      }
      if(_.isEmpty(idFields)){
        alert("entity:"+clickContext.metaEntity.name+" not set identity field");
        return;
      }
      var clickContext=this;
      var id=params.row[idFields[0].name];
      iview$Modal.confirm({
        title: '提示',
        content: '确定删除吗?',
        onOk: () => {
            resource.delete({id:id,cascade_delete:true}).then(function (re) {
            clickContext.grid.reload();
          });
        }
      });
    }
  };
  return operation;
}


var operations={
  create:operationForCreate,
  edit:operationForEdit,
  del:operationForDel,
}

export default {
  /**
   * 根据操作中，创建一个默认的操作
   * @param context
   * @param operationName
   */
  createOperation:function (context,operationName) {
    if(_.isEmpty(operationName)){
      return null;
    }
    var func=null;
    _.forEach(operations,function (opFunc,key) {
      if(key.toLowerCase()==operationName){
        func=opFunc;
        return false;
      }
    });
    if(func!=null){
      return func(context);
    }
    return null;
  },
  fillOperationByMb:function (context,btn) {
      var oldBtn = {};
      var name = "";
      if (_.isString(btn)) {
        name = btn;
      } else {
        name = btn.name;
        oldBtn = btn;
      }
      var mergedBtn = this.createOperation(context, name);
      if (mergedBtn == null) {
        return oldBtn;
      } else {
        mergedBtn = _.extend(mergedBtn, oldBtn);
        return mergedBtn;
      }
  }
}



