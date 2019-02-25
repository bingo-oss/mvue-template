<template>
  <div>
    <meta-layout v-if="ready" :layout="pageSettings.layout"></meta-layout>
    <Alert type="warning" v-if="errorObj.has" show-icon style="margin: 20px 200px">
      页面错误
      <template slot="desc">
        {{ errorObj.message }}
      </template>
    </Alert>
  </div>
</template>
<script>
  import  mvueCore from "mvue-core";
  export default {
    data:function(){
      var errorObj={has:false,code:null,message:null};
      return {
        errorObj:errorObj,
        ready:false,
        pageSettings:null,
      };
    },
     mounted:async function() {
      var self=this;
      var entityName=this.$route.params.entityName;
      var subPage=this.$route.params.subPage;
       var recordId=this.$route.params.id;
      var metaEntity=mvueCore.metaBase.findMetaEntity(entityName);
      var url=`${entityName}/$relations/${subPage}/_ui.json`;
      //var url="/config/group_member.json";
        try{
          var settings=null;
          if(metaEntity){
            settings=await metaEntity.getFormSettings(subPage);
          }
          if(_.isEmpty(settings)){
            settings=await self.$http.get(url);
              settings=settings.data;
          }
          this.pageSettings=mvueCore.metaLayoutConvertor.convert(settings,self);
          _.forEach(this.pageSettings.layout,com=>{
            if(com.ctype=="m-form" || com.ctype=="m-detail-view"){
              com["entityName"]=metaEntity.name;
              com["recordId"]=recordId;
            }
          });
          this.ready=true;
        }catch (e){
          this.errorObj.has=true;
          this.errorObj.message=e;
        }
    }
  };
</script>

