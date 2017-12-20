/**
 * 元数据管理
 * Created by fulsh on 2017/12/12.
 */
var store=require("store2");
require("store2/cache");

var Config=require("src/config/config.js");
var MetaEntityCls=require("libs/metadata/metaentity");
var mbCacheKey="_mb_";
var mbModule={};

var metabase={
  synced:false,
  entities:null,
  lastUpdate:new Date().getTime()
};
if(store.has(mbCacheKey)){
  metabase=store.get(mbCacheKey);
  metabase.synced=false;
}

/**
 * 同步初始化Mb
 */
function  initMetabase(){
  if(metabase.synced){
    return ;
  }
  var ajaxAsync=true;
  if(metabase.entities==null){
    ajaxAsync=false;
  }

  var swagger=Config.getApiBaseUrl()+"/swagger.json";
  jQuery.ajax({
    url:swagger,
    dataType:"json",
    async:ajaxAsync,
    statusCode:{404:function () {
        alert("加载元数据定义失败，请确认以下配置是否正确："+swagger);
      }},
    success:function (swaggerJson) {
      if(metabase.synced){
        return ;
      }
      loadMetabase(swaggerJson);
      console.log("async("+ajaxAsync+")load metabase from "+swagger);
    }
  });
}

/**
 * 将swagger 转为Metabase
 * @param swagger
 */
function loadMetabase(swagger){
  var context={
    swagger:swagger
  };
  var entities={};
  _.forEach(swagger.definitions,function(val,key){
    var isEntity=firstNotNaN(val["x-entity"],true);
    if(!isEntity){
      return;
    }
    var metaEntity=loadMetaEntityFromMode(context,key,val);
    entities[key.toLowerCase()]=metaEntity;
  });
  metabase.entities=entities;
  metabase.synced=true;
  metabase.lastUpdate=new Date().getTime();
  store.set(mbCacheKey,metabase);
}

/**
 * 将swagger的model转为MetaEntity
 * @param context
 * @param model
 */
function loadMetaEntityFromMode(context,modelName,model){
  var opt={
    name:modelName,
    title:model.title,
    description:modelName.description,
    _model:model
  };
  var metaEntity=MetaEntityCls(opt);
  var propertyContext=_.extend({
    metaEntity:metaEntity,
    model:model
  },context);
  var index=0;
  var relations=[];
  _.forEach(model.properties,function (val,key) {
    var isRelation=firstNotNaN(val["x-relation"],false);
    if(isRelation){
      var metaRelation=loadMetaRelationFromProperty(propertyContext,key,val);
      relations.push(metaRelation);
      return;
    }
    var metaField=loadMetaFieldFromProperty(propertyContext,key,val);
    metaField["displayOrder"]=index;
    metaEntity.fields[key]=metaField;
    index++;
  });

  _.forEach(relations,function (metaRelation,i) {
    _.forEach(metaRelation.joinFields,function(joinField,index){
      var relationField=null;
      if(_.isString(joinField)){
        var relationField=metaEntity[joinField];
      }
      if(relationField==null && _.isPlainObject(joinField) && !_.isEmpty(joinField["local"])){
        var relationField=metaEntity[joinField["local"]];
      }
      if(relationField!=null){
        relationField.isRelationField=true;
        relationField.relations.push(metaRelation);
      }
    });

      metaEntity.relations[metaRelation.name]=metaRelation;
  });
  return metaEntity;
}

/**
 * 将Property构造成metafield对象
 * @param context
 * @param propertyName
 * @param property
 */
function loadMetaFieldFromProperty(context,propertyName,property){
  var metaField={
    name:propertyName,
    title:property["title"],
    entityName:context.metaEntity.name,
    published:true,
    summary:property["description"],
    description:property["description"],
    isSystem:true,
    isDisplay:true,
    displayOrder:0,
    identity:firstNotNaN(property["x-identity"],false),
    autoIncrement:false,
    unique:firstNotNaN(property["x-unique"],property["uniqueItems"],false),
    required:false,
    creatable:firstNotNaN(property["x-creatable"],true),
    updatable:firstNotNaN(property["x-updatable"],property["readOnly"],true),
    sortable:firstNotNaN(property["x-sortable"],false),
    filterable:firstNotNaN(property["x-filterable"],false),
    inputType:firstNotNaN(property["x-input"],"SingleLineText"),
    inputTypeParams:{},
    semantics:property["x-meaning"],
    maxLength:property["maxLength"],
    minLength:property["minLength"],
    pattern:property["pattern"],
    maximum:property["maximum"],
    minimum:property["minimum"],
    enum:property["enum"],
    type:property["type"],
    format:property["format"],
    isRelationField:false,
    relations:[],
    _property:property
  };
  //设置required属性
  if(context.model.required && _.includes(context.model.required,propertyName)){
    metaField.required=true;
  }
  //设置inputTypeParams
  fillInputTypeParams(metaField,property);
  return metaField;
}

/**
 * 设置metaField的inputTypeParams参数
 * @param metaField
 * @param property
 */
function fillInputTypeParams(metaField,property) {
  if(_.isNaN(property["maxLength"])){
    metaField.inputTypeParams["maxLength"]=property["maxLength"];
  }
  if(_.isNaN(property["minLength"])){
    metaField.inputTypeParams["minLength"]=property["minLength"];
  }
  if(_.isNaN(property["pattern"])){
    metaField.inputTypeParams["pattern"]=property["pattern"];
  }
  if(_.isNaN(property["maximum"])){
    metaField.inputTypeParams["max"]=property["maximum"];
  }
  if(_.isNaN(property["minimum"])){
    metaField.inputTypeParams["min"]=property["minimum"];
  }
  if(_.isNaN(property["enum"])){
    metaField.inputTypeParams["enums"]=property["enum"];
  }
  if(_.isNaN(property["format"])){
    metaField.inputTypeParams["format"]=property["format"];
  }
  if(_.isNaN(property["x-options"])){
    var options=[];
    _.forEach(property["x-options"],function(items,key){
      if(key!="items"){
        return;
      }
      _.forEach(items,function (item,index) {
        options.push({
          id:item["value"],
          text:item["title"],
          chcked:false
        });
      });
    });
    metaField.inputTypeParams["options"]=options;
  }
}

/**
 * 根据关系属性构造关系
 * @param context
 * @param propertyName
 * @param property
 */
function loadMetaRelationFromProperty(context,propertyName,property){
  var metaRelation={
    name:propertyName,
    type:firstNotNaN(property["x-relation-type"],"many-to-one"),
    sourceEntity:context.metaEntity.name,
    targetEntity:property["x-target-entity"],
    joinEntity:property["x-join-entity"],
    joinFields:property["x-join-fields"],     //[{"local":"updatedBy","target":"userId"}]
    expandable:firstNotNaN(property["x-expandable"],false),
    _property:property
  };
  return metaRelation;
}


/**
 * 获取第一个非undefined的参数
 */
function firstNotNaN(){
  var reval;
  _.forEach(arguments,function (item,index) {
    if(!_.isNaN(item)){
      reval=item;
      return false;
    }
  });
  return reval;
}


//初始化metabase
initMetabase();

module.exports={
  findMetaEntity:function (metaEntityName) {
    if(!metaEntityName){
      return null;
    }
    return metabase.entities[metaEntityName.toLowerCase()];
  },
  entities:function () {
    return metabase.entities;
  },
  refresh:function () {
    metabase.synced=false;
    initMetabase();
  }
}
