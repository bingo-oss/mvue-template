module.exports=function (options) {
    var metaEntity=_.extend({
      name:"",
      title:"",
      description:"",
      isRemote:false,
      tableDroppable:false,
      tableFieldAddable:false,
      fields:{},
      relations:{},
      _model:null
    },options);

  /**
   * 获取Id字段
   * @returns {Array}
   */
  metaEntity.getIdFields=function(){
    var idFields=[];
    _.forEach(this.fields,function (metaField,key) {
      if(metaField.identity){
        idFields.push(idFields);
      }
    });
    return idFields;
  };

  /**
   * 第一个语义为的title字段
   */
  metaEntity.firstTitleField=function () {
    return firstSemanticsField("title");
  };

  /**
   * 获取每一个语义为semantics的字段
   * @param semantics
   * @returns {*}
   */
  metaEntity.firstSemanticsField=function (semantics) {
    var field=null;
    _.forEach(this.fields,function (metaField,key) {
      if(metaField.semantics==semantics
        || (_.isArray(metaField.semantics)&& _.includes(metaField.semantics,semantics))){
        field=metaField;
        return false;
      }
    });
    return  field;
  };

  /**
   * 根据源字段，及目标实体（可为空）查询关系字段
   * @param sourceField
   * @param targetEntity
   */
  metaEntity.findRelation=function(sourceField,targetEntity){
    var relation=null;
    var self=this;
    _.forEach(self.relations,function(metaRelation,key){
      var eqTargetEntity=true;
      if(!_.isEmpty(targetEntity)){
        eqTargetEntity=(metaRelation.targetEntity.toLowerCase()==targetEntity.toLowerCase());
      }
      if(!eqTargetEntity){
        return;
      }
      var eqField=false;
      _.forEach(metaRelation.joinFields,function(joinField,index){
        if(eqField){
          return false;
        }
        if(_.isString(joinField)){
          eqField=(sourceField.toLowerCase()== joinField.toLowerCase());
          return;
        }
        if(_.isPlainObject(joinField) && !_.isEmpty(joinField["local"])){
          eqField=(sourceField.toLowerCase()==joinField["local"].toLowerCase());
          return;
        }
      });
      if(eqField){
        relation=metaRelation;
        return false;
      }
    });
    return relation;
  }

  return metaEntity;
}
