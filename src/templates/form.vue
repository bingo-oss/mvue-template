<template>
  <div class="bvue-page" v-if="isReady" :key="$route.fullPath"  :id="'default-form-uuid-'+metaEntity.name">
    <b-childheader v-if="isForm" :title="childheader.title"></b-childheader>
    <div class="bvue-page-body">
      <Card v-if="isForm">
        <meta-layout  :layout="layout"></meta-layout>
      </Card>
      <meta-layout v-else :layout="layout"></meta-layout>
        <Alert type="warning" v-if="errorObj.has" show-icon style="margin: 20px 200px">
          页面错误
          <template slot="desc">
            {{ errorObj.message}}
          </template>
        </Alert>
    </div>
  </div>
</template>
<script>
  import  mvueCore from "mvue-core";
  export default {
    data:function () {
      var entityName=this.$route.params.entityName;
      var id=this.$route.params.id;
      var errorObj={has:false,code:null,message:null};
      var metaEntity=mvueCore.metaBase.findMetaEntity(entityName);
      if(metaEntity==null){
        errorObj=_.assign(errorObj,{
          has:true,
          code:"404",
          message:`实体${entityName}不存在`
        });
        metaEntity={title:"不存在实体"};
      }else{
        var hasError=!metaEntity.isUIEnable();
        if(hasError){
          errorObj=_.assign(errorObj,{
            has:true,
            code:"500",
            message:`实体${metaEntity.title}表单，已被禁止访问，请通过配置启用该页面后，再重试！`
          });
        }
      }
      return {
        isReady:false,
        errorObj:errorObj,
        childheader:{
          title:"",
        },
        recordId:id,
        metaEntity:metaEntity,
        form:{
          entityName:metaEntity.name,
          recordId:id,
        }
      }
    },
    computed:{
      isViewMode(){
        var utils=mvueCore.context.getMvueToolkit().utils;
        let action=this.$route.query&&this.$route.query[utils.queryKeys.action];
        return utils.formActions.view===action;
      },
      layout() {
        var pageSettings = mvueCore.metaLayoutConvertor.convert(this.form, self);
        var layout=pageSettings.layout;
        _.forEach(layout,com=>{
          if(com.ctype=="m-form" || com.ctype=="m-detail-view"){
            com["entityName"]=this.metaEntity.name;
            com["recordId"]=this.recordId;
          }
        });
        return layout;
      },
      isForm(){
        return this.form.ctype=="m-form";
      }
    },
    mounted(){
      var prefix='';
      var action="create";
      if(this.isViewMode){
        prefix='查看';
        action="view";
      }else if(this.form.recordId){
        prefix='编辑';
        action="edit";
      }else{
        prefix='新建';
      }
      this.childheader.title=`${prefix}${this.metaEntity.title}`;
      if(this.errorObj.has){
        return;
      }
      this.metaEntity.getFormSettings(action).then(st=>{
        if(st==null){
          this.hasError=true;
          return;
        }
        this.form=this.metaEntity.extendUISettings(this.form,st || {});
        this.isReady=true;
      });
    }
  }
</script>
