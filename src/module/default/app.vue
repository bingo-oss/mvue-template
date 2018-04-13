<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data: function () {
      //每次刷新页面要强制重新获取项目的元数据
      var projectId=this.$route.params.projectId;
      this.$metaBase.initMetabase(projectId,true);
      return {

      };
    }
  }
</script>
<style lang="scss">
@import "~style/font/iconfont.css";
@import "~sass/reset.scss";
@import "~sass/base/bootstrap.scss";
@import "~sass/base.scss";
@import "~sass/common";
@import "~sass/base/aminate.min";
@import "~sass/app_common.scss";
</style>

