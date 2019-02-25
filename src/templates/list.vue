<template>
  <div class="bvue-page">
    <b-childheader :title="header.title" :subtitle="header.description" :showBack="header.showBack" ></b-childheader>
    <div class="bvue-page-body">
      <Card >
        <component  v-if="isReady" :is="grid.ctype" ref="gridList" v-bind="grid"></component>
        <Alert type="warning" v-if="errorObj.has" show-icon style="margin: 20px 200px">
          页面错误
          <template slot="desc">
            {{ errorObj.message }}
          </template>
        </Alert>
      </Card>
    </div>
  </div>
</template>
<script>
  import  mvueCore from "mvue-core";
  import contextHelper from "../libs/context";
  export default {
    data:function(){
      var entityName=this.$route.params.entityName;
      var metaEntity=mvueCore.metaBase.findMetaEntity(entityName);
      var errorObj={has:false,code:null,message:null};
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
            message:`实体${metaEntity.title}列表，已被禁止访问，请通过配置启用该页面后，再重试！`
          });
        }
      }
      return {
        isReady:false,
        errorObj:errorObj,
        header:{
          title:`${metaEntity.title || metaEntity.name}列表`,
          description:metaEntity.description,
          showBack:false
        },
        metaEntity:metaEntity,
        grid:{
          ctype:"m-grid",
          entityName:metaEntity.name
        }
      }
    },
    mounted:function () {
      if(this.errorObj.has){
        return;
      }
      this.metaEntity.getUISettings().then((settings)=>{
        var gridSetting=(settings && settings.list)||{};
        this.grid=this.metaEntity.extendUISettings(this.grid,gridSetting);
        this.isReady=true;
      });
    }
  };
</script>
