<template>
    <a class="logout">{{ user }} <i class="iconfont icon-tuichu" @click="logout" title="注销"></i></a>
</template>
<script>
  var userResource = require('services/security/user_service.js').$resource;

  module.exports = {
    data: function () {
      return {
        user: ''
      }
    },
    methods: {
      'logout': function () {
        mvueCore.session.doLogout();
      }
    },
    mounted: function () {
      var _this = this;
      //获取当前用户名称
      userResource.currentUser().then(function({data}){
        _this.user = data.name;
      });
    }
  };
</script>
<style lang="scss">

</style>
