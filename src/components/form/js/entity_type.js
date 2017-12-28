import constants from './constants'
var types={
    RefEntity:{ 
        id: "RefEntity", 
        title: "引用实体", 
        icon:"ivu-icon ivu-icon-pound"
    }
};
var componentParams={
    RefEntity:{
        entityId:"",//必填
        idField:"",//必填
        titleField:"",//必填
        entityResourceUrl:""//后端自动生成
    }
};
function accept(componentType){
    return !!types[componentType];
}
function formatData(componentType,item,metaField){
    let fieldName=metaField.name;
    let origin=item[fieldName];
    if(_.isUndefined(origin)||_.isNull(origin)||origin===''){
        return "";
    }
    let rkey=constants.entityModelRedundantKey;
    var $data=item[rkey]&&item[rkey][fieldName];
    var titleField=metaField.inputTypeParams&&metaField.inputTypeParams.titleField;
    titleField=titleField||"name";
    var result= $data.refEntity&&$data.refEntity[origin]&&$data.refEntity[origin].name;
    result=result||origin;
    return result;
}
export default{
    types:types,
    accept:accept,
    componentParams:componentParams,
    formatData:formatData
}