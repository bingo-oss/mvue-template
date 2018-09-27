<template>
  <div class="bvue-page">
    <b-childheader :title="header.title" :subtitle="header.description" :showBack="header.showBack" ></b-childheader>
    <div class="bvue-page-body">
      <Card>
        <meta-layout :layout="pageSettings.layout" :key="$route.fullPath"></meta-layout>
      </Card>
    </div>
  </div>
</template>
<script>
  import confs from '../pages/auto-page-confs';
  import mvueCore from 'mvue-core';
  export default {
    data:function(){
      var key=this.$route.path;
      var pageSettings=mvueCore.metaLayoutConvertor.convert(confs[key]);
      var header={
        title:pageSettings.title||"未设置",
        description:pageSettings.description
      };
      return {
        pageSettings:pageSettings,
        header:header
      };
    }
  };
</script>

